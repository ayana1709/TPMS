<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Create the table without foreign key
        Schema::create('fine_violations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fine_id');
            $table->string('code');
            $table->string('type');
            $table->decimal('amount', 10, 2);
            $table->string('description');
            $table->integer('demerit_points');
            $table->timestamps();
        });

        // Add foreign key constraint in a separate statement
        Schema::table('fine_violations', function (Blueprint $table) {
            $table->index('fine_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('fine_violations');
    }
}; 