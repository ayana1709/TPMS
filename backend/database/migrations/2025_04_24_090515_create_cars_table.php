<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('driver_id');
            $table->string('plate_number')->unique();
            $table->string('vin')->nullable();
            $table->string('model')->nullable();
            $table->string('chasis_number')->nullable();
            $table->string('car_ownership_path')->nullable(); // file
            $table->string('car_bollo_path')->nullable();     // file
            $table->timestamps();

            $table->foreign('driver_id')->references('id')->on('drivers')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
