<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image_path',
        'category_id',
        'event_date',
        'thumbnail_path'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
