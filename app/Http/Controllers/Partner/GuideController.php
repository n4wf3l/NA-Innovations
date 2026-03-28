<?php

namespace App\Http\Controllers\Partner;

use App\Enums\ProjectType;
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
}
