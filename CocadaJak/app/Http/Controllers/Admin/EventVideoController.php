<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventVideo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventVideoController extends Controller
{
    public function store(Request $request, Event $event)
    {
        $data = $request->validate([
            'video' => ['required', 'file', 'mimes:mp4,webm,mov', 'max:51200'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $path = $request->file('video')->store('events/videos', 'public');

        $video = EventVideo::create([
            'event_id' => $event->id,
            'video_path' => $path,
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

        if ($video->video_path) {
            Storage::disk('public')->delete($video->video_path);
        }

        $video->delete();

        return response()->json(null, 204);
    }
}