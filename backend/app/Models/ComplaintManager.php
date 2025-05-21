<?php

// app/Models/ComplaintManager.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComplaintManager extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'message',
        'attachment',
    ];
}

