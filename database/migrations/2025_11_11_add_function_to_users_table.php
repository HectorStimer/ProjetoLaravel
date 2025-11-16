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
        // Guard against running this migration when the column already exists
        if (!Schema::hasColumn('users', 'function')) {
            Schema::table('users', function (Blueprint $table) {
                $table->enum('function', ['admin', 'triagist', 'doctor'])
                    ->default('doctor')
                    ->after('password');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Only drop if the column exists
        if (Schema::hasColumn('users', 'function')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('function');
            });
        }
    }
};
