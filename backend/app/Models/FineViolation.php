<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FineViolation extends Model
{
    use HasFactory;

    protected $fillable = [
        'fine_id',
        'code',
        'type',
        'amount',
        'description',
        'demerit_points'
    ];

    public function fine()
    {
        return $this->belongsTo(Fine::class);
    }
} 