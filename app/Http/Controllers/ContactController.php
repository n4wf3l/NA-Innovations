<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
class ContactController extends Controller
{
    public function index()
    {
        return view('contact');

    }

    public function sendEmail(Request $request)
{
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'service' => 'required|string|max:255',
        'budget' => 'required|numeric',
        'message' => 'required|string',
    ]);

    if ($validator->fails()) {
        return redirect()->back()
            ->withErrors($validator)
            ->withInput();
    }

    Mail::to('nawfel.ajari@student.ehb.be')->send(new ContactFormMail($request->all()));
    return redirect()->back()->with('success', 'Votre e-mail a été envoyé avec succès ! Nous vous contacterons bientôt.');
}
}
