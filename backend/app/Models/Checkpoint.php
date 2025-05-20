<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checkpoint extends Model
{
    use HasFactory;
        
        protected $fillable = [
            'name', 
            'latitude',
             'longitude',
              'radius',
              'description', 
              'manager_id'];


    public function manager()
{
    return $this->belongsTo(Manager::class);
}
public function assignments()
{
    return $this->hasMany(ShiftAssignment::class);
}

public function complaints()
{
    return $this->belongsToMany(Complaint::class, 'checkpoint_complaint');
}

public function trafficUsers()
{
    return $this->hasManyThrough(
        \App\Models\TrafficUser::class,
        \App\Models\ShiftAssignment::class,
        'checkpoint_id', // Foreign key on ShiftAssignment
        'id',            // Foreign key on TrafficUser
        'id',            // Local key on Checkpoint
        'traffic_user_id' // Local key on ShiftAssignment
    );
}

public function accidents()
{
    return $this->belongsToMany(Accident::class, 'accident_checkpoint');
}

}
