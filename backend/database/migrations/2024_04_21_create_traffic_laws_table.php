<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('traffic_laws', function (Blueprint $table) {
            $table->id();
            $table->string('law_number')->unique();
            $table->string('title');
            $table->text('description');
            $table->decimal('penalty_amount', 10, 2);
            $table->text('penalty_description');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('traffic_laws');
    }
}; 