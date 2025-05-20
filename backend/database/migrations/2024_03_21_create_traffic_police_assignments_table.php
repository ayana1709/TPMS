<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('traffic_police_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users'); // Assuming users table exists
            $table->string('location_name');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->time('start_time');
            $table->time('end_time');
            $table->date('assignment_date');
            $table->decimal('radius_meters', 8, 2)->default(100); // Allowed radius from assigned position
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('traffic_police_assignments');
    }
}; 