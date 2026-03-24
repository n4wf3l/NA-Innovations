@extends('layouts.admin')

@section('title', __('Clients'))

@section('content')
@php
    $totalClients = \App\Models\User::where('role', 'client')->count();
    $activeProjects = \App\Models\Projet::whereIn('status', ['planning', 'in_progress', 'review'])->count();
    $totalRevenue = \App\Models\Invoice::where('status', 'paid')->sum('total');
    $avgProjectValue = \App\Models\Projet::whereNotNull('budget')->avg('budget') ?? 0;
@endphp

    {{-- Module Banner --}}
    <div class="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div class="relative z-10">
            <p class="text-blue-200 text-sm mb-1">{{ __('Business') }} / {{ __('Clients') }}</p>
            <h2 class="font-display text-2xl text-white tracking-wide">{{ __('Clients') }}</h2>
            <p class="text-blue-200 text-sm mt-1">{{ __('Your client database. View all clients, their projects and invoices.') }}</p>
        </div>
        {{-- Background icon --}}
        <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>
        </svg>
        {{-- Action button --}}
        <div class="absolute right-6 bottom-6">
            <a href="{{ route('admin.clients.create') }}" class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium rounded-lg transition">
                + {{ __('Add Client') }}
            </a>
        </div>
    </div>

    {{-- KPI Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-blue-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Total Clients') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $totalClients }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-blue-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Active Projects') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $activeProjects }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-blue-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Total Revenue') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">&euro;{{ number_format($totalRevenue, 0, ',', '.') }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-blue-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Avg Project Value') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">&euro;{{ number_format($avgProjectValue, 0, ',', '.') }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <form method="GET" action="{{ route('admin.clients.index') }}" class="mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search Input -->
            <div class="flex-1">
                <input type="text"
                       name="search"
                       value="{{ request('search') }}"
                       placeholder="{{ __('Search by name, email or company...') }}"
                       class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-blue-400 focus:ring-blue-400">
            </div>

            <!-- Submit -->
            <button type="submit"
                    class="inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {{ __('Search') }}
            </button>

            @if(request()->hasAny(['search']))
                <a href="{{ route('admin.clients.index') }}"
                   class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    {{ __('Clear') }}
                </a>
            @endif
        </div>
    </form>

    <!-- Table -->
    @if($clients->count() > 0)
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Name') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Email') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Company') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Phone') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Projects') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Invoices') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($clients as $client)
                            <tr class="hover:bg-blue-50/40 transition-colors border-l-4 border-l-transparent hover:border-l-blue-400">
                                <td class="px-4 py-3 font-medium text-gray-900">
                                    {{ $client->name }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    {{ $client->email }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    {{ $client->company_name ?? '-' }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    {{ $client->phone ?? '-' }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                        {{ $client->projects_count }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                        {{ $client->invoices_count }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="{{ route('admin.clients.show', $client) }}"
                                           class="text-gray-500 hover:text-blue-600 transition-colors"
                                           title="{{ __('View') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </a>
                                        <a href="{{ route('admin.clients.edit', $client) }}"
                                           class="text-gray-500 hover:text-blue-600 transition-colors"
                                           title="{{ __('Edit') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                        </a>
                                        <form method="POST" action="{{ route('admin.clients.destroy', $client) }}"
                                              onsubmit="return confirm('{{ __('Are you sure you want to delete this client?') }}')"
                                              class="inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"
                                                    class="text-gray-500 hover:text-red-600 transition-colors"
                                                    title="{{ __('Delete') }}">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            @if($clients->hasPages())
                <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    {{ $clients->links() }}
                </div>
            @endif
        </div>
    @else
        <!-- Empty State -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-blue-400 p-12 text-center">
            <svg class="w-12 h-12 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/></svg>
            <h3 class="text-lg font-medium text-gray-900 mb-1">{{ __('No clients yet') }}</h3>
            <p class="text-gray-500 mb-6">{{ __('No clients found. Add your first client to get started.') }}</p>
            <a href="{{ route('admin.clients.create') }}"
               class="inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                {{ __('Add Client') }}
            </a>
        </div>
    @endif
@endsection
