<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LocaleController
{
    public function switch(Request $request, string $locale)
    {
        if (in_array($locale, ['en', 'fr', 'nl'])) {
            session(['locale' => $locale]);
        }

        return redirect()->back();
    }
}
