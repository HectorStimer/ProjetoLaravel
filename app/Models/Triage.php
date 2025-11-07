<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Triage extends Model
{
    protected $fillable = [
        'patient_id',
        'triagist_id',
        'score',
        'notes'
    ];
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
    
    public function triagist()
    {
        return $this->belongsTo(User::class, 'triagist_id');
    }
}
