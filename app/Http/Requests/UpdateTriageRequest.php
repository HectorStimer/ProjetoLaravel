<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTriageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Permitir apenas usuários com papel de triagem
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'score' => 'required|integer|between:1,5',
            'notes' => 'nullable|string|max:1000',
            'vital_signs' => 'nullable|array',
            'vital_signs.blood_pressure' => 'nullable|string',
            'vital_signs.heart_rate' => 'nullable|integer',
            'vital_signs.temperature' => 'nullable|numeric',
            'vital_signs.oxygen_saturation' => 'nullable|integer|between:0,100',
            'symptoms' => 'required|string',
            'service_id' => 'required|exists:services,id'
        ];
    }
}
