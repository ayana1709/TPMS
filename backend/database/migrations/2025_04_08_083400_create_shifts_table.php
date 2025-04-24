<?php

// database/migrations/xxxx_xx_xx_create_shifts_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name');            
            $table->time('start_time');        
            $table->time('end_time');          
            $table->date('start_date');        
            $table->date('end_date');
            
            // ✅ This links the shift to the manager who created it
            $table->foreignId('manager_id')->constrained('managers')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
