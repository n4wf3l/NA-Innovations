<?php

namespace App\Http\Controllers\Admin;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends BaseAdminController
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user')->latest();

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->whereHas('user', fn($q) => $q->where('role', $request->role));
        }

        // Filter by action
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Filter by date range
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        // Filter by single date (legacy)
        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        // Search in URL/route
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereJsonContains('properties->url', $search)
                  ->orWhereJsonContains('properties->route', $search)
                  ->orWhereHas('user', fn($uq) => $uq->where('name', 'like', "%{$search}%"));
            });
        }

        $logs = $query->paginate(50)->withQueryString();

        $users = User::select('id', 'name', 'role')
            ->whereIn('id', ActivityLog::distinct()->pluck('user_id'))
            ->orderBy('name')
            ->get();

        $actions = ActivityLog::distinct()->pluck('action');

        return Inertia::render('Admin/AuditLog/Index', [
            'logs' => $logs,
            'users' => $users,
            'actions' => $actions,
        ]);
    }
}
