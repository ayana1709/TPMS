<?php



namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'traffic_user_id',
        'shift_assignment_id',
        'status',
        'date',
    ];

    public function trafficUser()
    {
        return $this->belongsTo(TrafficUser::class);
    }

    public function shiftAssignment()
    {
        return $this->belongsTo(ShiftAssignment::class);
    }
}
