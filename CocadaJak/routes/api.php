<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\PhotoController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\AboutController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/portfolio', [PortfolioController::class, 'index'])
    ->name('portfolio');

Route::get('/about', [AboutController::class, 'show'])->name('about.show');

Route::get('/categories', [CategoryController::class, 'index'])
    ->name('categories.index');

Route::post('/contato', [ContactController::class, 'store'])
    ->name('contact.store');

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/user', [AuthController::class, 'me'])->name('user');
});

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('photos', PhotoController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::post('/about', [\App\Http\Controllers\Admin\AboutController::class, 'update'])
    ->name('about.update');
});