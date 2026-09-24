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
use Intervention\Image\Drivers\Gd\Driver;
use App\Models\EventVideo;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with(['category', 'photos', 'videos'])->latest()->get();

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
            'videos' => ['nullable', 'array'],
            'videos.*' => ['file', 'mimes:mp4,webm,mov', 'max:61440'],
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
        if ($request->hasFile('videos')) {
            foreach ($request->file('videos') as $index => $video) {
                $path = $video->store('events/videos', 'public');

                EventVideo::create([
                    'event_id' => $event->id,
                    'video_path' => $path,
                    'sort_order' => $index,
                ]);
            }
        }

        return response()->json([
            'event' => $event->load(['category', 'photos', 'videos']),
        ], 201);
    }

    public function show(Event $event)
    {
        return response()->json([
            'event' => $event->load(['category', 'photos', 'videos']),
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
            'videos' => ['nullable', 'array'],
            'videos.*' => ['file', 'mimes:mp4,webm,mov', 'max:61440'],
        ]);

        $event->update(
            collect($data)
                ->except(['images', 'videos'])
                ->toArray()
        );

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

        if ($request->hasFile('videos')) {
        $nextVideoOrder = $event->videos()->max('sort_order') + 1;

        foreach ($request->file('videos') as $index => $video) {
            $path = $video->store('events/videos', 'public');

            EventVideo::create([
                'event_id' => $event->id,
                'video_path' => $path,
                'sort_order' => $nextVideoOrder + $index,
            ]);
        }
    }

        return response()->json([
            'event' => $event->fresh(['category', 'photos', 'videos']),
        ]);
    }

    public function destroy(Event $event)
    {
        foreach ($event->photos as $photo) {
            $this->deletePhotoFiles($photo);
        }

        foreach ($event->videos as $video) {
            if ($video->video_path) {
                Storage::disk('public')->delete($video->video_path);
            }
        }

        $event->delete();

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
    $manager = new ImageManager(new Driver());

    $filename = Str::random(40);

    // Imagem principal
    $full = $manager->decodePath($file->getRealPath());
    $full->scaleDown(width: 1600);

    $fullPath = "events/{$filename}-full.webp";

    Storage::disk('public')->put(
        $fullPath,
        (string) $full->encodeUsingFormat(
            \Intervention\Image\Format::WEBP,
            quality: 82
        )
    );

    // Thumbnail
    $thumb = $manager->decodePath($file->getRealPath());
    $thumb->cover(600, 750);

    $thumbPath = "events/{$filename}-thumb.webp";

    Storage::disk('public')->put(
        $thumbPath,
        (string) $thumb->encodeUsingFormat(
            \Intervention\Image\Format::WEBP,
            quality: 78
        )
    );

    return [
        'full' => $fullPath,
        'thumb' => $thumbPath,
    ];
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