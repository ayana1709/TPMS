<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('first_name')->nullable();
        $table->string('last_name')->nullable();
        $table->string('phone_number')->unique()->nullable();
        $table->string('id_number')->nullable();
        $table->string('city')->nullable();
        $table->string('woreda')->nullable();
        $table->string('house_number')->nullable();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn([
            'first_name',
            'last_name',
            'phone_number',
            'id_number',
            'city',
            'woreda',
            'house_number'
        ]);
    });
}

};
