<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventVideo;
use Illuminate\Http\Request;

class EventVideoController extends Controller
{
    public function store(Request $request, Event $event)
    {
        $data = $request->validate([
            'video_url' => ['required', 'url'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $video = EventVideo::create([
            'event_id' => $event->id,
            'video_url' => $data['video_url'],
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return response()->json([
            'video' => $video,
        ], 201);
    }
    
    public function destroy(Event $event, EventVideo $video)
    {
        if ($video->event_id !== $event->id) {
            abort(404);
        }

        $video->delete();

        return response()->json(null, 204);
    }

}