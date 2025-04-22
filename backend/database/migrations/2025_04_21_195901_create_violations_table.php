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
        Schema::create('violations', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->text('violation_name');
            $table->string('category');
            $table->string('offence_type');
            $table->string('demerit_points'); // use string to handle ranges like "4-9" or "10-11"
            $table->decimal('fine_birr', 8, 2);
            $table->string('action_description')->nullable();
            $table->timestamps();
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('violations');
    }
};
