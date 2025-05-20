<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('tx_ref')->unique(); // ✅ required for validation
            $table->string('email');
            $table->string('full_name');
            $table->string('license');
            $table->decimal('amount', 10, 2);
            $table->string('status')->default('pending'); // optional
            $table->foreignId('fine_id')->constrained('fines')->onDelete('cascade');
            $table->timestamps();
        });
    }



 

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};

