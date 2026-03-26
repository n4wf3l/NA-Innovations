<?php

namespace App\Http\Controllers\Admin;

use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends BaseAdminController
{
    /**
     * Display a listing of messages.
     */
    public function index()
    {
        $messages = Message::all();

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
        ]);
    }

    /**
     * Store a newly created message.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        Message::create([
            'content' => $request->content,
            'enabled' => true,
        ]);

        return redirect()->back()->with('success', 'Message created successfully.');
    }

    /**
     * Update the specified message.
     */
    public function update(Request $request, Message $message)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $message->update([
            'content' => $request->content,
            'enabled' => $request->boolean('enabled'),
        ]);

        return redirect()->back()->with('success', 'Message updated successfully.');
    }

    /**
     * Remove the specified message.
     */
    public function destroy(Message $message)
    {
        $message->delete();

        return redirect()->back()->with('success', 'Message deleted successfully.');
    }
}
