<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('abouts', function (Blueprint $table) {
            $table->id();
            $table->string('photo_path')->nullable();
            $table->text('bio')->nullable();
            $table->string('camera')->nullable();
            $table->string('lenses')->nullable();
            $table->string('lighting')->nullable();
            $table->string('editing')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('abouts');
    }
};