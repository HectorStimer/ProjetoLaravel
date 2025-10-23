<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QueueEntry extends Model
{
    protected $fillable = [
        'id',
        'patientId',
        'status',
        'createdBy',
        'timestamp'
    ];
}
