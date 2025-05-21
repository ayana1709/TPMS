<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDriverAccidentsTable extends Migration
{
    public function up()
    {
        Schema::create('driver_accidents', function (Blueprint $table) {
            $table->id();
            $table->decimal('location_lat', 10, 7);
            $table->decimal('location_lng', 10, 7);
            $table->dateTime('timeOfAccident');
            $table->string('vehiclePlateNumber')->nullable();
            $table->text('description');
            $table->text('files')->nullable(); // store as JSON
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('driver_accidents');
    }
}
