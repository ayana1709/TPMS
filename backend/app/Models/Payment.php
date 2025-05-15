<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = ['tx_ref', 'email', 'full_name', 'amount', 'status', 'license', 'fine_id', ];


     public function fine()
    {
        return $this->belongsTo(Fine::class);
    }

    
}

