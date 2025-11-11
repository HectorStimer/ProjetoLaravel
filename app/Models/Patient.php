<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $fillable = [
        'name',
        'document',
        'birth_date',
        'created_by',
        'phone'
    ];

    /**
     * Relacionamento com o usuário que criou o registro
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
