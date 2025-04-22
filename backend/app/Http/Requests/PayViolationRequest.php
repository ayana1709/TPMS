<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PayViolationRequest extends FormRequest
{
  
    public function authorize() {
        
        return $this->user()->id === $this->route('violation')->driver_id;
     }


   
    public function rules(): array
    {
        return [
            'violation_id' => 'required|exists:violations,id',
            'payment_method' => 'required|string|in:credit_card,debit_card,cash',
            'amount' => 'required|numeric|min:0',
        ];
    }
}
