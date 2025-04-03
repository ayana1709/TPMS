<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Zone extends Model
{
    use HasFactory;

    protected $fillable = ['osm_id', 'name', 'region_id'];

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function woredas()
    {
        return $this->hasMany(Woreda::class);
    }
}

