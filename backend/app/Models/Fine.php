<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'address',
        'contact_number',
        'drivers_license_number',
        'vehicle_registration_number',
        'vehicle_type',
        'date_of_offense',
        'time_of_offense',
        'location',
        'incident_description',
        'total_fine_amount',
        'due_date',
        'officer_name',
        'badge_number',
        'police_station',
        'is_paid'
    ];

    protected $casts = [
        'date_of_offense' => 'date',
        'time_of_offense' => 'datetime',
        'due_date' => 'date',
        'is_paid' => 'boolean',
        'total_fine_amount' => 'decimal:2'
    ];

    public function driver() {
        return $this->belongsTo(Driver::class, 'driver_id');
    }

    public function officer() {
        return $this->belongsTo(TrafficUser::class, 'traffic_officer_id');
    }

    public function car() {
        return $this->belongsTo(Car::class);
    }

    public function violations()
    {
        return $this->hasMany(FineViolation::class, 'fine_id');
    }
    
}
