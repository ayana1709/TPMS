<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShiftAssignment extends Model
{
    use HasFactory;

    // Explicitly define the table name (optional if Laravel already guesses it right)
    protected $table = 'shift_assignments';

    protected $fillable = [
        'traffic_user_id',
        'shift_id',
        'checkpoint_id',
        'manager_id',
        'assigned_date',
    ];
    

    public function trafficUser()
    {
        return $this->belongsTo(TrafficUser::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    public function checkpoint()
    {
        return $this->belongsTo(Checkpoint::class);
    }

    public function manager()
    {
        return $this->belongsTo(Manager::class);
    }
}
