<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class TrafficUser extends Model
{
    use HasFactory,   HasApiTokens, Notifiable;
    protected $fillable = [
        'full_name', 'badge_number', 'rank', 'phone', 'email',
         'username', 'password','manager_id',
    ];
    
    protected $hidden = ['password'];


    // public function assignedShifts() {
    //     return $this->belongsToMany(Shift::class, 'shift_user');
    // }
    


public function manager()
{
    return $this->belongsTo(Manager::class);
}

public function shiftAssignments()
{
    return $this->hasMany(ShiftAssignment::class);
}

public function complaints()
{
    return $this->belongsToMany(Complaint::class, 'complaint_traffic_user');
}

}
