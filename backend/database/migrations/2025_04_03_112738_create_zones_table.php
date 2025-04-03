<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('zones', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('osm_id')->unique();
            $table->string('name');
             // Add the region_id column explicitly
        $table->bigInteger('region_id'); // Add the region_id column

            // Explicitly reference 'osm_id' from 'regions' table
            $table->foreign('region_id')->references('osm_id')->on('regions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('zones');
    }
};

