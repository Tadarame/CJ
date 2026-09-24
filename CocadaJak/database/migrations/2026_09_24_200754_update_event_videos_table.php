<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('event_videos', function (Blueprint $table) {
            $table->renameColumn('video_url', 'video_path');
        });
    }

    public function down(): void
    {
        Schema::table('event_videos', function (Blueprint $table) {
            $table->renameColumn('video_path', 'video_url');
        });
    }
};