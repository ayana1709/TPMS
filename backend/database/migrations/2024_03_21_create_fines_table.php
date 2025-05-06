<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('fines', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('full_name');
            $table->string('address');
            $table->string('contact_number');
            $table->string('drivers_license_number');
            $table->string('vehicle_registration_number');
            $table->string('vehicle_type');
            $table->date('date_of_offense');
            $table->time('time_of_offense');
            $table->string('location');
            $table->text('incident_description');
            $table->decimal('total_fine_amount', 10, 2);
            $table->date('due_date');
            $table->string('officer_name');
            $table->string('badge_number');
            $table->string('police_station');
            $table->boolean('is_paid')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('fines');
    }
}; 