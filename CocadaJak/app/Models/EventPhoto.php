<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventPhoto extends Model
{
    protected $fillable = [
        'event_id',
        'image_path',
        'thumbnail_path',
        'sort_order',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}