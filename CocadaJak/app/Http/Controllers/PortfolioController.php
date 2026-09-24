<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $events = Event::with(['category', 'photos'])
            ->when($request->filled('category_id'), function ($query) use ($request) {
                $query->where('category_id', $request->query('category_id'));
            })
            ->latest()
            ->get();

        return response()->json(['events' => $events]);
    }
}