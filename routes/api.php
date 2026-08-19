<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/', [HomeController::class. 'index'])->name('home');

Route::get('/portifolio', [PortifolioController::class, 'index'])
 ->name('portifolio');

Route::get('/contato', [ContactController::class, 'create'])
 ->name('contact');

Route::post('/contato', [ContactController::class, 'store'])
 ->name('contact.store');

Route::prefix('admin')->group(function () {
    Route::resource('photos', PhotoController::class);
    Route::resource('categories', CategoryController::class);
});