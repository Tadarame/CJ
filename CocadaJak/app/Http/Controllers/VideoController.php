<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    public function show(Request $request, string $path)
    {
        $disk = Storage::disk('public');

        if (!$disk->exists($path)) {
            abort(404);
        }

        $fullPath = $disk->path($path);

        $size = filesize($fullPath);
        $mimeType = mime_content_type($fullPath) ?: 'video/mp4';

        $range = $request->header('Range');

        if (!$range) {
            return response()->stream(function () use ($fullPath) {
                readfile($fullPath);
            }, 200, [
                'Content-Type' => $mimeType,
                'Content-Length' => $size,
                'Accept-Ranges' => 'bytes',
            ]);
        }

        preg_match('/bytes=(\d+)-(\d*)/', $range, $matches);

        $start = (int) $matches[1];
        $end = isset($matches[2]) && $matches[2] !== ''
            ? (int) $matches[2]
            : $size - 1;

        if ($start >= $size || $start > $end) {
            return response('', 416, [
                'Content-Range' => "bytes */{$size}",
            ]);
        }

        $end = min($end, $size - 1);
        $length = $end - $start + 1;

        return response()->stream(function () use ($fullPath, $start, $length) {
            $handle = fopen($fullPath, 'rb');

            fseek($handle, $start);

            $remaining = $length;

            while ($remaining > 0 && !feof($handle)) {
                $chunk = fread($handle, min(8192, $remaining));

                if ($chunk === false) {
                    break;
                }

                echo $chunk;

                $remaining -= strlen($chunk);
            }

            fclose($handle);
        }, 206, [
            'Content-Type' => $mimeType,
            'Content-Length' => $length,
            'Content-Range' => "bytes {$start}-{$end}/{$size}",
            'Accept-Ranges' => 'bytes',
        ]);
    }
}