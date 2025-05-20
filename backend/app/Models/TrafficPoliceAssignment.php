<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrafficPoliceAssignment extends Model
{
    protected $fillable = [
        'user_id',
        'location_name',
        'latitude',
        'longitude',
        'start_time',
        'end_time',
        'assignment_date',
        'radius_meters'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'assignment_date' => 'date',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'radius_meters' => 'decimal:2'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isWithinTimeRange(): bool
    {
        $now = now();
        $currentTime = $now->format('H:i:s');
        return $currentTime >= $this->start_time && $currentTime <= $this->end_time;
    }

    public function isWithinLocation(float $currentLat, float $currentLng): bool
    {
        $distance = $this->calculateDistance(
            $this->latitude,
            $this->longitude,
            $currentLat,
            $currentLng
        );
        
        return $distance <= $this->radius_meters;
    }

    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371000; // Earth's radius in meters

        $lat1 = deg2rad($lat1);
        $lon1 = deg2rad($lon1);
        $lat2 = deg2rad($lat2);
        $lon2 = deg2rad($lon2);

        $latDelta = $lat2 - $lat1;
        $lonDelta = $lon2 - $lon1;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($lat1) * cos($lat2) * pow(sin($lonDelta / 2), 2)));
        
        return $angle * $earthRadius;
    }
} 