<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class IssueViolationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {

       
        if (auth()->user()->role === 'officer') {
            return true;
        }
        return false;
    }
    public function laws(){
        return[
            'law_number' => 'required|exists:traffic_laws,id',
            'driver_id' => 'required|exists:users,id',
            'car_id' => 'required|exists:cars,id',
            'officer_id' => 'required|exists:users,id',
            'penalty_amount' => 'required|numeric|min:0',
            'signed' => 'boolean',
            'signed_at' => 'nullable|date',
            'paid' => 'boolean',
            'paid_at' => 'nullable|date',
        ];


    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
        ];
    }
}
