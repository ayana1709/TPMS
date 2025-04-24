<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'start_date',
        'end_date',
        'manager_id',
    ];

    // ✅ A shift belongs to a manager
    public function manager()
    {
        return $this->belongsTo(Manager::class);
    }
    public function assignments()
{
    return $this->hasMany(ShiftAssignment::class);
}

}




