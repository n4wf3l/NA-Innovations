<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;
use Illuminate\Support\Facades\Session;


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

    
    $formData = $request->all();

    $serviceOptions = [
        'service1' => 'Web Development',
        'service2' => 'Mobile Development',
        'service3' => 'Software Development',
        'service4' => 'Video Editing',
        'service5' => 'Graphic Design',
        'service6' => 'Photography',
    ];
    $selectedService = $serviceOptions[$request->input('service')];
    $formData['service'] = $selectedService;
    
    $recipientEmail = 'ajari.nawfel@gmail.com';
    Mail::to($recipientEmail)->send(new ContactFormMail($formData));
    return redirect()->back()->with('success', 'Votre e-mail a été envoyé avec succès ! Nous vous contacterons bientôt.');
}

}
