<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Photo;

class HomeController extends Controller
{
    public function index()
    {
        $latestPhotos = Photo::with('category')
            ->latest()
            ->take(6)
            ->get();

        return response()->json([
            'message' => 'API do portfólio no ar',
            'latest_photos' => $latestPhotos,
        ]);
    }
}
