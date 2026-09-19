<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\About;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AboutController extends Controller
{
    public function update(Request $request)
    {
        $data = $request->validate([
            'bio' => ['nullable', 'string'],
            'camera' => ['nullable', 'string', 'max:255'],
            'lenses' => ['nullable', 'string', 'max:255'],
            'lighting' => ['nullable', 'string', 'max:255'],
            'editing' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $about = About::first() ?? new About();

        if ($request->hasFile('photo')) {
            if ($about->photo_path) {
                Storage::disk('public')->delete($about->photo_path);
            }
            $data['photo_path'] = $request->file('photo')->store('about', 'public');
        }

        $about->fill($data);
        $about->save();

        return response()->json([
            'about' => $about,
            'photo_url' => $about->photo_path ? Storage::url($about->photo_path) : null,
        ]);
    }
}