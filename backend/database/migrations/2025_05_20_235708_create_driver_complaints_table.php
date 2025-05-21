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
        Schema::create('driver_complaints', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->dateTime('datetime');
            $table->text('description');
            $table->string('plateNumber')->nullable();
            $table->string('contactInfo')->nullable();
            $table->string('startCoords')->nullable();
            $table->string('destCoords')->nullable();
            $table->text('files')->nullable(); // store as JSON or comma-separated
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('driver_complaints');
    }
};
