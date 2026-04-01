<?php

namespace App\Http\Controllers\Partner;

use App\Enums\ProjectType;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class GuideController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'referral']);
    }

    public function index()
    {
        $partner = auth()->user()->referralPartner;

        return Inertia::render('Partner/Guide', [
            'referralCode' => $partner?->referral_code,
            'commissionRate' => $partner?->default_commission_rate ?? 10,
            'projectTypes' => ProjectType::allWithRates(),
        ]);
    }

    public function prospecting()
    {
        $partner = auth()->user()->referralPartner;

        return Inertia::render('Partner/Prospecting', [
            'kbAccessStatus' => $partner?->kb_access_status ?? 'none',
            'kbNdaSignedAt' => $partner?->kb_nda_signed_at,
            'ndaMode' => \App\Models\Setting::get('kb.nda_mode', 'text'),
            'ndaText' => \App\Models\Setting::get('kb.nda_text', ''),
            'ndaPdfUrl' => \App\Models\Setting::get('kb.nda_pdf_path') ? '/storage/' . \App\Models\Setting::get('kb.nda_pdf_path') : null,
        ]);
    }

    public function requestKbAccess(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'signature_data' => 'required|string',
        ]);

        $partner = auth()->user()->referralPartner;

        if (!$partner || $partner->kb_access_status === 'approved') {
            return redirect()->back()->with('error', 'Accès déjà accordé ou partenaire introuvable.');
        }

        $partner->update([
            'kb_access_status' => 'pending',
            'kb_nda_full_name' => $request->input('full_name'),
            'kb_nda_signature' => $request->input('signature_data'),
            'kb_nda_signed_at' => now(),
            'kb_nda_signed_ip' => $request->ip(),
        ]);

        // Notify all admins with in-app notification
        $admins = \App\Models\User::where('role', 'admin')->where('is_active', true)->get();
        foreach ($admins as $admin) {
            \App\Models\NotificationLog::create([
                'user_id' => $admin->id,
                'type' => 'kb_access_request',
                'title' => __('Demande d\'accès Knowledge Base'),
                'message' => auth()->user()->name . ' ' . __('a signé le NDA et demande l\'accès à la Knowledge Base de prospection.'),
                'action_url' => '/admin/team',
                'is_read' => false,
            ]);
        }

        return redirect()->back()->with('success', 'Votre demande d\'accès a été envoyée. L\'administrateur la traitera dans les plus brefs délais.');
    }
}
