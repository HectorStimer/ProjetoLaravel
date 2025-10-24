<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QueueEntry extends Model
{
    protected $fillable = [
        'patientId',
        'serviceId',
        'priority',
        'arrivedAt',
        'calledAt',
        'startedAt',
        'finishedAt',
        'estimatedServiceTime',        
        'status',
        'createdBy'
    ];
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
