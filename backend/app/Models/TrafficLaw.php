<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrafficLaw extends Model
{
    use HasFactory;

    protected $fillable = [
        'law_number',
        'title',
        'description',
        'penalty_amount',
        'penalty_description',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'penalty_amount' => 'decimal:2'
    ];
} 