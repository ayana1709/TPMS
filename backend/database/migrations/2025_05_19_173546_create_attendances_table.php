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
       Schema::create('attendances', function (Blueprint $table) {
    $table->id();
    $table->foreignId('traffic_user_id')->constrained('traffic_users')->onDelete('cascade');
    $table->foreignId('shift_assignment_id')->constrained('shift_assignments')->onDelete('cascade');
    $table->enum('status', ['Present', 'Absent']);
    $table->date('date');
    $table->timestamps();
});


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
