<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('woredas', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('osm_id')->unique();
            $table->bigInteger('zone_id');
            $table->string('name');
            $table->foreign('zone_id')->references('osm_id')->on('zones')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('woredas');
    }
}; 

