<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;

class SignatureController extends BaseAdminController
{

    /**
     * Get the current user's saved signature.
     */
    public function show()
    {
        $user = auth()->user();

        return response()->json([
            'signature' => $user->signature,
        ]);
    }

    /**
     * Save a signature for the current user.
     */
    public function store(Request $request)
    {
        $request->validate([
            'signature' => 'required|string',
        ]);

        $user = auth()->user();
        $user->signature = $request->input('signature');
        $user->save();

        return redirect()->back()->with('success', 'Signature saved.');
    }

    /**
     * Delete the current user's signature.
     */
    public function destroy()
    {
        $user = auth()->user();
        $user->signature = null;
        $user->save();

        return redirect()->back()->with('success', 'Signature removed.');
    }
}
