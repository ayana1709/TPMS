<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up() 
{
    Schema::create('shift_assignments', function (Blueprint $table) {
        $table->id();

        $table->foreignId('traffic_user_id')->constrained()->onDelete('cascade');
        $table->foreignId('shift_id')->constrained()->onDelete('cascade');
        $table->foreignId('checkpoint_id')->constrained()->onDelete('cascade');
        $table->foreignId('manager_id')->constrained()->onDelete('cascade'); // ✅ New!
        $table->date('assigned_date');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shift_assignments');
    }
};
