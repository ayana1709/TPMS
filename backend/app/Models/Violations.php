<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Violations extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'violation_name',
        'category',
        'offence_type',
        'demerit_points',
        'fine_birr',
        'action_description',
    ];

    public function fines()
    {
        return $this->belongsToMany(Fine::class, 'fine_violation');
    }


}

