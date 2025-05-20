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
        Schema::create('complaints', function (Blueprint $table) {
    $table->id();
    $table->string('type');
    $table->dateTime('datetime');
    $table->text('description');
    $table->string('plate_number');
    $table->string('contact_info');
    $table->json('start_coords'); // latitude & longitude as JSON
    $table->json('dest_coords');
    $table->string('file_path')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
