<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;

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
            'event_date' => ['nullable', 'date'],
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ]);

        $paths = $this->storeOptimizedImage($request->file('image'));
        $data['image_path'] = $paths['full'];
        $data['thumbnail_path'] = $paths['thumb'];

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
            'event_date' => ['nullable', 'date'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ]);

        if ($request->hasFile('image')) {
            $this->deleteImages($photo);
            $paths = $this->storeOptimizedImage($request->file('image'));
            $data['image_path'] = $paths['full'];
            $data['thumbnail_path'] = $paths['thumb'];
        }

        $photo->update($data);

        return response()->json([
            'photo' => $photo,
            'image_url' => Storage::url($photo->image_path),
        ]);
    }

    public function destroy(Photo $photo)
    {
        $this->deleteImages($photo);
        $photo->delete();

        return response()->json(null, 204);
    }

    /**
     * Gera e salva duas versões da imagem enviada:
     * - "full": redimensionada (máx. 1600px de largura), pro modal de detalhes.
     * - "thumb": cortada num formato fixo (600x750), pro grid do portfólio.
     * As duas são salvas em WebP, formato mais leve que JPG com qualidade equivalente.
     * Ideia principal é nao sobrecarregar com imagens Pesadas
     */
    private function storeOptimizedImage(UploadedFile $file): array
    {
        $manager = ImageManager::gd();
        $filename = Str::random(40);

        $full = $manager->read($file->getRealPath());
        $full->scaleDown(width: 1600);
        $fullPath = "photos/{$filename}-full.webp";
        Storage::disk('public')->put($fullPath, (string) $full->toWebp(quality: 82));

        $thumb = $manager->read($file->getRealPath());
        $thumb->cover(600, 750);
        $thumbPath = "photos/{$filename}-thumb.webp";
        Storage::disk('public')->put($thumbPath, (string) $thumb->toWebp(quality: 78));

        return ['full' => $fullPath, 'thumb' => $thumbPath];
    }

    private function deleteImages(Photo $photo): void
    {
        if ($photo->image_path) {
            Storage::disk('public')->delete($photo->image_path);
        }
        if ($photo->thumbnail_path) {
            Storage::disk('public')->delete($photo->thumbnail_path);
        }
    }
}