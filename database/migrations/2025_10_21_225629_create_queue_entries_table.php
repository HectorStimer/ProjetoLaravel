<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('queue_entries', function (Blueprint $table) {
            $table->id();
            $table->integer('patient_id');
            $table->integer('service_id');
            $table->enum('status',['waiting','called','in_service','canceled','finished']);
            $table->int('priority')->default(0);
            $table->timestamp('arrived_at');
            $table->timestamp('called_at');
            $table->timestamp('started_at');
            $table->timestamp('finished_at');
            $table->int('estimated_service_time')->nullable();
            $table->timestamps();
            $table->foreign('patient_id')->references('id')->on('patients');
            $table->foreign('service_id')->references('id')->on('services');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('queue_entries');
    }
};
