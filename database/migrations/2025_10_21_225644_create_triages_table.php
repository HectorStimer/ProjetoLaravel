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
        Schema::create('triages', function (Blueprint $table) {
            $table->int('id')->primary();
            $table->int('patient_id')->foreign('patient_id')->references('id')->on('patients');
            $table->int('trigist_id')->foreign('trigist_id')->references('id')->on('users');
            $table->enum('score',[1,2,3,4,5]);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('triages');
    }
};
