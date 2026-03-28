<?php

namespace App\Http\Controllers;

use App\Models\LandingSection;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AboutController extends Controller
{
    public function index()
    {
        $about = LandingSection::where('section_key', 'about')->first();

        $seo = [
            'title' => Setting::get('seo.about_title', 'À propos — NA Innovations'),
            'description' => Setting::get('seo.about_description', ''),
        ];

        return Inertia::render('About', [
            'about' => $about,
            'seo' => $seo,
        ]);
    }
}
