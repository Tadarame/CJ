<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventVideo extends Model
{
    protected $fillable = [
        'event_id',
        'video_url',
        'sort_order',
    ];


    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}