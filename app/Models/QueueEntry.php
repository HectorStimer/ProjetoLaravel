<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QueueEntry extends Model
{
    protected $fillable = [
        'patient_id',
        'service_id',
        'priority',
        'arrived_at',
        'called_at',
        'started_at',
        'finished_at',
        'estimated_service_time',        
        'status',
        'created_by'
    ];
    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
    
    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
    
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
