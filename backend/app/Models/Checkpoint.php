<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checkpoint extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'latitude', 'longitude', 'radius','description'];


    public function manager()
{
    return $this->belongsTo(Manager::class);
}
}
