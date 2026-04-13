<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Str;
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;

class TwoFactorController extends Controller
{
    protected Google2FA $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Generate a new 2FA secret + QR code for setup.
     */
    public function setup(Request $request)
    {
        $user = $request->user();

        // Generate new secret
        $secret = $this->google2fa->generateSecretKey();

        // Store temporarily in session until user confirms
        session(['2fa_setup_secret' => $secret]);

        $otpauthUrl = $this->google2fa->getQRCodeUrl(
            config('app.name', 'NA Innovations'),
            $user->email,
            $secret
        );

        // Generate QR code locally (no external API call)
        $renderer = new ImageRenderer(
            new RendererStyle(220),
            new SvgImageBackEnd()
        );
        $writer = new Writer($renderer);
        $svg = $writer->writeString($otpauthUrl);
        $qrDataUri = 'data:image/svg+xml;base64,' . base64_encode($svg);

        return response()->json([
            'secret' => $secret,
            'qr_svg' => $qrDataUri,
        ]);
    }

    /**
     * Confirm & enable 2FA after user verifies with a code from their Authenticator app.
     */
    public function enable(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:6',
        ]);

        $secret = session('2fa_setup_secret');
        if (!$secret) {
            return back()->withErrors(['code' => __('Session expirée. Veuillez recommencer la configuration.')]);
        }

        $valid = $this->google2fa->verifyKey($secret, $request->code);
        if (!$valid) {
            return back()->withErrors(['code' => __('Code invalide. Vérifiez votre application Authenticator et réessayez.')]);
        }

        // Generate recovery codes
        $recoveryCodes = collect(range(1, 8))->map(fn () => Str::random(10))->toArray();

        $user = $request->user();
        $user->forceFill([
            'two_factor_enabled' => true,
            'two_factor_secret' => $secret,
            'two_factor_recovery_codes' => $recoveryCodes,
            'two_factor_confirmed_at' => now(),
        ])->save();

        session()->forget('2fa_setup_secret');

        return response()->json([
            'success' => true,
            'recovery_codes' => $recoveryCodes,
        ]);
    }

    /**
     * Disable 2FA.
     */
    public function disable(Request $request)
    {
        $request->validate([
            'code' => 'required|digits:6',
        ]);

        $user = $request->user();

        if (!$user->two_factor_enabled || !$user->two_factor_secret) {
            return back()->withErrors(['code' => __('La 2FA n\'est pas activée.')]);
        }

        $valid = $this->google2fa->verifyKey($user->two_factor_secret, $request->code);
        if (!$valid) {
            return back()->withErrors(['code' => __('Code invalide.')]);
        }

        $user->forceFill([
            'two_factor_enabled' => false,
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        return response()->json(['success' => true]);
    }

    /**
     * Show the 2FA challenge page (Blade — during login flow).
     */
    public function challenge()
    {
        if (!session('2fa:user_id')) {
            return redirect('/login');
        }

        return view('auth.two-factor-challenge');
    }

    /**
     * Verify the 2FA code during login.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $userId = session('2fa:user_id');
        $remember = session('2fa:remember', false);

        if (!$userId) {
            return redirect('/login')->withErrors(['email' => __('Session expirée. Veuillez vous reconnecter.')]);
        }

        $user = \App\Models\User::findOrFail($userId);

        // Try TOTP code first
        if (strlen($request->code) === 6 && ctype_digit($request->code)) {
            $valid = $this->google2fa->verifyKey($user->two_factor_secret, $request->code);
            if ($valid) {
                return $this->complete2faLogin($request, $user, $remember);
            }
        }

        // Try recovery code
        $recoveryCodes = $user->two_factor_recovery_codes ?? [];
        if (in_array($request->code, $recoveryCodes)) {
            // Remove used recovery code
            $remaining = array_values(array_filter($recoveryCodes, fn ($c) => $c !== $request->code));
            $user->forceFill(['two_factor_recovery_codes' => $remaining])->save();
            return $this->complete2faLogin($request, $user, $remember);
        }

        return back()->withErrors(['code' => __('Code invalide. Utilisez votre application Authenticator ou un code de récupération.')]);
    }

    /**
     * Complete the login after 2FA verification.
     */
    protected function complete2faLogin(Request $request, $user, bool $remember)
    {
        session()->forget(['2fa:user_id', '2fa:remember']);
        session()->put('2fa_verified', true);

        \Illuminate\Support\Facades\Auth::login($user, $remember);

        $request->session()->regenerate();

        // Track login (same as AuthenticatedSessionController)
        $user->update(['last_login_at' => now()]);
        \App\Models\ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'login',
            'properties' => ['role' => $user->role, '2fa' => true],
            'ip_address' => $request->ip(),
            'user_agent' => substr($request->userAgent() ?? '', 0, 500),
        ]);

        // Role-based redirect (same logic as AuthenticatedSessionController)
        $redirectMap = [
            'admin' => '/admin/dashboard',
            'developer' => '/dev/dashboard',
            'client' => '/client/dashboard',
            'referral_partner' => '/partner/dashboard',
        ];

        return redirect()->intended($redirectMap[$user->role] ?? '/dashboard')
            ->with('success', "Bienvenue, {$user->name} !");
    }
}
