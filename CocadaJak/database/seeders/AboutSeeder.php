<?php

namespace Database\Seeders;

use App\Models\About;
use Illuminate\Database\Seeder;

class AboutSeeder extends Seeder
{
    public function run(): void
    {
        About::firstOrCreate(['id' => 1], [
            'bio' => 'Sou CocadaJak, fotógrafo com foco em retratos, eventos e paisagens.',
            'camera' => 'Sony A7 III',
            'lenses' => '35mm f/1.8, 85mm f/1.8',
            'lighting' => 'Flash speedlight + softbox portátil',
            'editing' => 'Lightroom + Photoshop',
        ]);
    }
}