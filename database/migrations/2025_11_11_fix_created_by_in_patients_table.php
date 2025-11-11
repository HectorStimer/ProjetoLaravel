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
        Schema::table('patients', function (Blueprint $table) {
            // Primeiro remover a coluna string
            $table->dropColumn('created_by');
        });

        Schema::table('patients', function (Blueprint $table) {
            // Depois adicionar como FK
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->after('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropConstrainedForeignId('created_by');
        });

        Schema::table('patients', function (Blueprint $table) {
            $table->string('created_by')->nullable();
        });
    }
};
