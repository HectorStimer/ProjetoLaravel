<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Triage extends Model
{
    protected $fillable = [
        'patient_id',
        'trigist_id',
        'score',
        'notes'
    ];
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
    public function trigist()
    {
        return $this->belongsTo(User::class, 'trigist_id'); }
}
