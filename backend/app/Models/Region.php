<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;

    protected $fillable = ['osm_id', 'name'];

    public function zones()
    {
        return $this->hasMany(Zone::class);
    }
}

