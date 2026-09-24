<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\EventVideoController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\AboutController as AdminAboutController;
use App\Http\Controllers\VideoController;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/portfolio', [PortfolioController::class, 'index'])->name('portfolio');

Route::get('/videos/{path}', [VideoController::class, 'show'])
    ->where('path', '.*');

Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');

Route::get('/about', [AboutController::class, 'show'])->name('about.show');

Route::post('/contato', [ContactController::class, 'store'])->name('contact.store');

Route::post('/login', [AuthController::class, 'login'])->name('login');


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/user', [AuthController::class, 'me'])->name('user');
});

Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    Route::apiResource('events', EventController::class);
    Route::delete('events/{event}/photos/{photo}', [EventController::class, 'destroyPhoto'])
        ->name('events.photos.destroy');
    Route::apiResource('categories', AdminCategoryController::class);
    Route::post('/about', [AdminAboutController::class, 'update'])->name('about.update');
    Route::post('events/{event}/videos', [EventVideoController::class, 'store'])
    ->name('events.videos.store');
    Route::delete('events/{event}/videos/{video}', [EventVideoController::class, 'destroy'])
    ->name('events.videos.destroy');
});