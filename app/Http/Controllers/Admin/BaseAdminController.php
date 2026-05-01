<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller;

class BaseAdminController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * True if the current session has unlocked financial values
     * via the financial PIN within the last 15 minutes.
     */
    protected function financialUnlocked(): bool
    {
        $unlockedAt = session('financial_unlocked_at');
        if (!$unlockedAt) return false;
        return (now()->timestamp - $unlockedAt) <= 900;
    }

    /**
     * Returns $value if the session is unlocked, otherwise null.
     * Use to gate financial values sent in Inertia props.
     */
    protected function protectedAmount(mixed $value): mixed
    {
        return $this->financialUnlocked() ? $value : null;
    }
}
