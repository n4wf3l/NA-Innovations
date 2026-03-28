<?php

namespace App\Http\Controllers\Api;

use App\Models\Lead;
use App\Models\Projet;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class SearchController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function __invoke(Request $request): JsonResponse
    {
        $q = $request->input('q', '');
        if (strlen($q) < 2) {
            return response()->json(['results' => []]);
        }

        $results = [];
        $like = "%{$q}%";

        // Clients
        User::where('role', 'client')
            ->where(fn($query) => $query->where('name', 'like', $like)
                ->orWhere('email', 'like', $like)
                ->orWhere('company_name', 'like', $like))
            ->take(5)
            ->get()
            ->each(function ($user) use (&$results) {
                $results[] = [
                    'id' => $user->id,
                    'type' => 'client',
                    'name' => $user->name,
                    'subtitle' => $user->company_name ?: $user->email,
                    'url' => "/admin/clients/{$user->id}",
                ];
            });

        // Projects
        Projet::where('nom_societe', 'like', $like)
            ->orWhere('description', 'like', $like)
            ->take(5)
            ->get()
            ->each(function ($project) use (&$results) {
                $results[] = [
                    'id' => $project->id,
                    'type' => 'project',
                    'name' => $project->nom_societe,
                    'subtitle' => $project->status ? ucfirst(str_replace('_', ' ', $project->status)) : '',
                    'url' => "/admin/projects/{$project->id}",
                ];
            });

        // Partners
        User::where('role', 'referral_partner')
            ->with('referralPartner')
            ->where(fn($query) => $query->where('name', 'like', $like)->orWhere('email', 'like', $like))
            ->take(5)
            ->get()
            ->each(function ($user) use (&$results) {
                $partnerId = $user->referralPartner?->id;
                if (!$partnerId) return;
                $results[] = [
                    'id' => $user->id,
                    'type' => 'partner',
                    'name' => $user->name,
                    'subtitle' => $user->email,
                    'url' => "/admin/partners/{$partnerId}",
                ];
            });

        // Developers
        User::where('role', 'developer')
            ->where(fn($query) => $query->where('name', 'like', $like)->orWhere('email', 'like', $like))
            ->take(3)
            ->get()
            ->each(function ($user) use (&$results) {
                $results[] = [
                    'id' => $user->id,
                    'type' => 'developer',
                    'name' => $user->name,
                    'subtitle' => $user->email,
                    'url' => "/admin/team",
                ];
            });

        // Leads
        Lead::where(fn($query) => $query->where('first_name', 'like', $like)
                ->orWhere('last_name', 'like', $like)
                ->orWhere('email', 'like', $like)
                ->orWhere('company_name', 'like', $like))
            ->take(5)
            ->get()
            ->each(function ($lead) use (&$results) {
                $results[] = [
                    'id' => $lead->id,
                    'type' => 'lead',
                    'name' => "{$lead->first_name} {$lead->last_name}",
                    'subtitle' => $lead->company_name ?: $lead->email,
                    'url' => "/admin/leads/{$lead->id}",
                ];
            });

        return response()->json(['results' => $results]);
    }
}
