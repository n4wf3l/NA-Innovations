<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class FinancialPinController
{
    // Verify PIN and set session
    public function verify(Request $request)
    {
        $request->validate(['pin' => 'required|string|min:4|max:6']);

        $user = $request->user();

        if (!$user->financial_pin) {
            return response()->json(['error' => 'No PIN set. Contact admin.'], 403);
        }

        if (!Hash::check($request->pin, $user->financial_pin)) {
            return response()->json(['error' => 'Incorrect PIN.'], 401);
        }

        // Store unlock timestamp in session (15 min validity)
        session(['financial_unlocked_at' => now()->timestamp]);

        return response()->json(['success' => true, 'expires_in' => 900]); // 900 seconds = 15 min
    }

    // Lock (clear session)
    public function lock(Request $request)
    {
        session()->forget('financial_unlocked_at');
        return response()->json(['success' => true]);
    }

    // Check if currently unlocked
    public function status(Request $request)
    {
        $unlockedAt = session('financial_unlocked_at');
        if (!$unlockedAt) {
            return response()->json(['unlocked' => false]);
        }

        $elapsed = now()->timestamp - $unlockedAt;
        if ($elapsed > 900) { // 15 min expired
            session()->forget('financial_unlocked_at');
            return response()->json(['unlocked' => false]);
        }

        return response()->json([
            'unlocked' => true,
            'remaining' => 900 - $elapsed,
        ]);
    }
}
