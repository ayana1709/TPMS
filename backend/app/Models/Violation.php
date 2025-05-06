<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'category',
        'description',
        'fine_birr',
        'demerit_points',
        'offense_type'
    ];

    public function fines()
    {
        return $this->belongsToMany(Fine::class)
            ->withPivot('fine_birr', 'demerit_points')
            ->withTimestamps();
    }
} 