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
            $table->patient_id();
            $table->service_id();
            $table->enum('waiting','called','in_service','canceled','finished');
            $table->int('priority')->default(0);
            $table->timestamp('arrived_at');
            $table->timestamp('called_at');
            $table->timestamp('started_at');
            $table->timestamp('finished_at');
            $table->int('estimated_service_time')->nullable();
            $table->timestamps();
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
