<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use Illuminate\Http\Request;
use Chapa\Chapa\Facades\Chapa;
use Illuminate\Support\Facades\Http;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{

    //initialize
public function initialize(Request $request)
{
    $data = $request->validate([
        'amount' => 'required|numeric',
        'email' => 'required|email',
        'full_name' => 'required|string',
         'license'=> 'required|string',
         'fine_id' => 'required|exists:fines,id',
        'tx_ref' => 'required|string|unique:payments,tx_ref',
    ]);

    // Add first_name and last_name from full_name
    $data['first_name'] = explode(' ', $data['full_name'])[0] ?? 'Customer';
    $data['last_name'] = explode(' ', $data['full_name'])[1] ?? '';

    $data['currency'] = 'ETB';
    $data['callback_url'] = route('chapa.callback');

    $data['return_url'] = route('chapa.return') . '?tx_ref=' . $data['tx_ref'];
    $data['customization'] = [
        'title' => 'TPMS Penalty',
        'description' => 'Penalty payment for traffic violations',
    ];

    try {
        $response = Http::withOptions([
            'verify' => 'C:\cacert.pem',
        ])
        ->withToken(config('services.chapa.secret'))
        ->post('https://api.chapa.co/v1/transaction/initialize', $data);

        if (!$response->successful()) {
            throw new \Exception("Chapa Init Failed: " . $response->body());
        }

        $payment = $response->json();

        // Save to DB`
        Payment::create([
            'tx_ref' => $data['tx_ref'],
            'email' => $data['email'],
            'full_name' => $data['full_name'],
            'amount' => $data['amount'],
            'status' => 'pending',
            'license'=> $data['license'],
            'fine_id' => $request->input('fine_id'),
            'payment_url' => $payment['data']['checkout_url'],
        ]);

        return response()->json([
            'checkout_url' => $payment['data']['checkout_url']
        ]);
    } catch (\Exception $e) {
        Log::error('Chapa Payment Initialization Error', ['error' => $e->getMessage()]);

        return response()->json([
            'error' => 'Chapa initialization failed',
            'message' => $e->getMessage()
        ], 500);
    }
}





//callback
public function callback(Request $request)
{
    // Try to extract tx_ref from any possible source
    $tx_ref = $request->input('tx_ref') ?? $request->query('tx_ref') ?? $request->json('tx_ref');
    Log::info("Entered Chapa callback", ['tx_ref' => $tx_ref]);

    if (!$tx_ref) {
        Log::error("Transaction reference is missing");
        return response()->json(['error' => 'Missing transaction reference'], 400);
    }

    try {
        $chapaResponse = Http::withOptions([
            'verify' => 'C:\cacert.pem',
        ])
        ->withToken(config('services.chapa.secret'))
        ->get("https://api.chapa.co/v1/transaction/verify/{$tx_ref}");

        if (!$chapaResponse->successful()) {
            Log::error('Chapa verification failed', [
                'tx_ref' => $tx_ref,
                'response' => $chapaResponse->body(),
            ]);
            return response()->json(['error' => 'Verification failed'], 500);
        }

        $data = $chapaResponse->json()['data'];
        $status = $data['status'];
        Log::info("Chapa status received", ['status' => $status]);

        $payment = Payment::where('tx_ref', $tx_ref)->first();

        if (!$payment) {
            Log::warning('Payment not found for tx_ref', ['tx_ref' => $tx_ref]);
            return response()->json(['error' => 'Payment record not found'], 404);
        }

        $payment->update(['status' => $status]);

        if ($status === 'success') {
            Log::info("Payment successful", ['tx_ref' => $tx_ref]);

            $fine = $payment->fine;

            if ($fine) {
                Log::info("Fine found via relationship", [
                    'fine_id' => $fine->id,
                    'current_is_paid' => $fine->is_paid,
                ]);

                $fine->is_paid = true;
                $fine->save();

                $refreshedFine = Fine::find($fine->id);
                Log::info("Fine updated", [
                    'fine_id' => $fine->id,
                    'saved_is_paid' => $fine->is_paid,
                    'refreshed_is_paid' => $refreshedFine->is_paid,
                ]);
            } else {
                Log::warning("Fine not found via relationship", [
                    'payment_id' => $payment->id,
                    'fine_id' => $payment->fine_id
                ]);
            }

            return response()->json([
                'message' => 'Payment verified successfully',
                'tx_ref' => $tx_ref,
                'status' => $status,
            ]);
        } else {
            Log::info("Payment not successful", ['status' => $status]);

            return response()->json([
                'message' => 'Payment not successful',
                'tx_ref' => $tx_ref,
                'status' => $status,
            ], 400);
        }
    } catch (\Exception $e) {
        Log::error('Chapa Callback Exception', [
            'tx_ref' => $tx_ref,
            'error' => $e->getMessage(),
        ]);

        return response()->json([
            'error' => 'Server error',
            'message' => $e->getMessage()
        ], 500);
    }
}



public function return(Request $request)
{
    $tx_ref = $request->query('tx_ref');
    \Log::info("Return URL hit", ['tx_ref' => $tx_ref]);

    if (!$tx_ref) {
        return redirect(config('services.chapa.return_url') . '?error=missing_tx_ref');
    }

    $payment = \App\Models\Payment::where('tx_ref', $tx_ref)->first();

    if (!$payment) {
        return redirect(config('services.chapa.return_url') . '?error=payment_not_found');
    }

    return redirect(config('services.chapa.return_url') . '?tx_ref=' . $tx_ref . '&license=' . $payment->license . '&fine_id=' . $payment->fine_id);
}







public function verifyFromFrontend(Request $request)
{
    $tx_ref = $request->query('tx_ref');

    if (!$tx_ref) {
        return response()->json(['error' => 'Missing tx_ref'], 400);
    }

    $payment = Payment::where('tx_ref', $tx_ref)->first();

    if (!$payment) {
        return response()->json(['error' => 'Payment not found'], 404);
    }

    // If still pending, try re-verifying with Chapa
    if ($payment->status === 'pending') {
        $chapaResponse = Http::withOptions([
            'verify' => 'C:\cacert.pem',
        ])
        ->withToken(config('services.chapa.secret'))
        ->get("https://api.chapa.co/v1/transaction/verify/{$tx_ref}");

        if ($chapaResponse->successful()) {
            $data = $chapaResponse->json()['data'];
            $payment->update(['status' => $data['status']]);
        }
    }

    return response()->json([
        'message' => 'Payment found',
        'status' => $payment->status,
        'tx_ref' => $payment->tx_ref,
    ]);
}



 

}
