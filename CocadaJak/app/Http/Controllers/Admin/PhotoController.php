<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PhotoController extends Controller
{
    public function index()
    {
        $photos = Photo::with('category')->latest()->get();

        return response()->json(['photos' => $photos]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $data['image_path'] = $request->file('image')->store('photos', 'public');

        $photo = Photo::create($data);

        return response()->json([
            'photo' => $photo,
            'image_url' => Storage::url($photo->image_path),
        ], 201);
    }

    public function show(Photo $photo)
    {
        return response()->json([
            'photo' => $photo->load('category'),
            'image_url' => Storage::url($photo->image_path),
        ]);
    }

    public function update(Request $request, Photo $photo)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['sometimes', 'required', 'exists:categories,id'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($request->hasFile('image')) {
            // Apaga a imagem antiga antes de salvar a nova, senão fica lixo acumulando no storage
            if ($photo->image_path) {
                Storage::disk('public')->delete($photo->image_path);
            }
            $data['image_path'] = $request->file('image')->store('photos', 'public');
        }

        $photo->update($data);

        return response()->json([
            'photo' => $photo,
            'image_url' => Storage::url($photo->image_path),
        ]);
    }

    public function destroy(Photo $photo)
    {
        if ($photo->image_path) {
            Storage::disk('public')->delete($photo->image_path);
        }

        $photo->delete();

        return response()->json(null, 204);
    }
}