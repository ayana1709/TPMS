<?php
// app/Models/Accident.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accident extends Model
{
    use HasFactory;

    protected $fillable = [
        'location_lat',
        'location_lng',
        'time_of_accident',
        'vehicle_plate_number',
        'description',
        'files',
    ];

    protected $casts = [
        'files' => 'array',
    ];

    public function checkpoints()
    {
        return $this->belongsToMany(Checkpoint::class, 'accident_checkpoint');
    }
}