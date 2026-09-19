<?php

namespace App\Http\Controllers;

use App\Models\About;
use Illuminate\Support\Facades\Storage;

class AboutController extends Controller
{
    public function show()
    {
        $about = About::first();

        return response()->json([
            'about' => $about,
            'photo_url' => $about?->photo_path ? Storage::url($about->photo_path) : null,
        ]);
    }
}