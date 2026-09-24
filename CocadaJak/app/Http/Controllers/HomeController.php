<?php

namespace App\Http\Controllers;

use App\Models\Event;

class HomeController extends Controller
{
    public function index()
    {
        $latestEvents = Event::with(['category', 'photos'])
            ->latest()
            ->take(3)
            ->get();

        return response()->json([
            'message' => 'API do portfólio no ar',
            'latest_events' => $latestEvents,
        ]);
    }
}