<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventPhoto;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with(['category', 'photos'])->latest()->get();

        return response()->json(['events' => $events]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'event_date' => ['nullable', 'date'],
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ]);

        $event = Event::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'category_id' => $data['category_id'],
            'event_date' => $data['event_date'] ?? null,
        ]);

        foreach ($request->file('images') as $index => $image) {
            $paths = $this->storeOptimizedImage($image);
            EventPhoto::create([
                'event_id' => $event->id,
                'image_path' => $paths['full'],
                'thumbnail_path' => $paths['thumb'],
                'sort_order' => $index,
            ]);
        }

        return response()->json([
            'event' => $event->load(['category', 'photos']),
        ], 201);
    }

    public function show(Event $event)
    {
        return response()->json([
            'event' => $event->load(['category', 'photos']),
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'event_date' => ['nullable', 'date'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ]);

        $event->update(collect($data)->except('images')->toArray());

        if ($request->hasFile('images')) {
            $nextOrder = $event->photos()->max('sort_order') + 1;
            foreach ($request->file('images') as $index => $image) {
                $paths = $this->storeOptimizedImage($image);
                EventPhoto::create([
                    'event_id' => $event->id,
                    'image_path' => $paths['full'],
                    'thumbnail_path' => $paths['thumb'],
                    'sort_order' => $nextOrder + $index,
                ]);
            }
        }

        return response()->json([
            'event' => $event->fresh(['category', 'photos']),
        ]);
    }

    public function destroy(Event $event)
    {
        foreach ($event->photos as $photo) {
            $this->deletePhotoFiles($photo);
        }

        $event->delete(); // cascadeOnDelete já apaga os event_photos no banco

        return response()->json(null, 204);
    }

    public function destroyPhoto(Event $event, EventPhoto $photo)
    {
        if ($photo->event_id !== $event->id) {
            abort(404);
        }

        $this->deletePhotoFiles($photo);
        $photo->delete();

        return response()->json(null, 204);
    }

    private function storeOptimizedImage(UploadedFile $file): array
    {
        $manager = ImageManager::gd();
        $filename = Str::random(40);

        $full = $manager->read($file->getRealPath());
        $full->scaleDown(width: 1600);
        $fullPath = "events/{$filename}-full.webp";
        Storage::disk('public')->put($fullPath, (string) $full->toWebp(quality: 82));

        $thumb = $manager->read($file->getRealPath());
        $thumb->cover(600, 750);
        $thumbPath = "events/{$filename}-thumb.webp";
        Storage::disk('public')->put($thumbPath, (string) $thumb->toWebp(quality: 78));

        return ['full' => $fullPath, 'thumb' => $thumbPath];
    }

    private function deletePhotoFiles(EventPhoto $photo): void
    {
        if ($photo->image_path) {
            Storage::disk('public')->delete($photo->image_path);
        }
        if ($photo->thumbnail_path) {
            Storage::disk('public')->delete($photo->thumbnail_path);
        }
    }
}