<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('photos')->get();

        return response()->json(['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
        ]);

        $category = Category::create($data);

        return response()->json(['category' => $category], 201);
    }

    public function show(Category $category)
    {
        return response()->json([
            'category' => $category->load('photos'),
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $category->id],
        ]);

        $category->update($data);

        return response()->json(['category' => $category]);
    }

    public function destroy(Category $category)
    {
        // cascadeOnDelete() na migration de photos já apaga as fotos junto
        $category->delete();

        return response()->json(null, 204);
    }
}