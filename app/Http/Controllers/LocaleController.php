<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LocaleController
{
    public function switch(Request $request, string $locale)
    {
        if (!in_array($locale, ['en', 'fr', 'nl'])) {
            return redirect()->back();
        }

        session()->put('locale', $locale);
        app()->setLocale($locale);

        // Persist to DB if authenticated
        if (auth()->check()) {
            auth()->user()->update(['locale' => $locale]);
        }

        return redirect()->back();
    }
}
