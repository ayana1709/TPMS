<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('violations', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('violation_name');
            $table->string('category');
            $table->string('offence_type');
            $table->string('demerit_points');
            $table->decimal('fine_birr', 10, 2);
            $table->string('action_description')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('violations');
    }
}; 