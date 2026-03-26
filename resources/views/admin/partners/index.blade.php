@extends('layouts.admin')

@section('title', __('Partners'))

@section('content')
@php
    $totalPartners = \App\Models\ReferralPartner::count();
    $activePartners = \App\Models\ReferralPartner::where('is_active', true)->count();
    $totalLeadsReferred = \App\Models\Lead::whereNotNull('referral_partner_id')->count();
    $totalEarned = \App\Models\Commission::where('status', 'paid')->sum('commission_amount');
@endphp

    {{-- Module Banner --}}
    <div class="bg-gradient-to-r from-pink-600 to-rose-500 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div class="relative z-10">
            <p class="text-pink-200 text-sm mb-1">{{ __('Business') }} / {{ __('Partners') }}</p>
            <h2 class="font-display text-2xl text-white tracking-wide">{{ __('Referral Partners') }}</h2>
            <p class="text-pink-200 text-sm mt-1">{{ __('Manage your referral partners. Each partner gets a unique referral link to track the leads they bring in.') }}</p>
        </div>
        {{-- Background icon --}}
        <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 text-white/10 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
        </svg>
        {{-- Action button --}}
        <div class="absolute right-6 bottom-6 z-20">
            <a href="{{ route('admin.partners.create') }}" class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium rounded-lg transition">
                + {{ __('Add Partner') }}
            </a>
        </div>
    </div>

    {{-- KPI Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-pink-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Total Partners') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $totalPartners }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-pink-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Active') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $activePartners }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-pink-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Total Leads Referred') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $totalLeadsReferred }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-pink-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Total Earned') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">&euro;{{ number_format($totalEarned, 0, ',', '.') }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <form method="GET" action="{{ route('admin.partners.index') }}" class="mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search Input -->
            <div class="flex-1">
                <input type="text"
                       name="search"
                       value="{{ request('search') }}"
                       placeholder="{{ __('Search by name or email...') }}"
                       class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-pink-400 focus:ring-pink-400">
            </div>

            <!-- Submit -->
            <button type="submit"
                    class="inline-flex items-center gap-2 bg-pink-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-pink-700 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {{ __('Search') }}
            </button>

            @if(request()->hasAny(['search']))
                <a href="{{ route('admin.partners.index') }}"
                   class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    {{ __('Clear') }}
                </a>
            @endif
        </div>
    </form>

    <!-- Table -->
    @if($partners->count() > 0)
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Name') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Email') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Referral Code') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Commission Rate') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Leads') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Commissions') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($partners as $partner)
                            <tr class="hover:bg-pink-50/40 transition-colors border-l-4 border-l-transparent hover:border-l-pink-400">
                                <td class="px-4 py-3 font-medium text-gray-900">
                                    {{ $partner->user->name ?? '-' }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    {{ $partner->user->email ?? '-' }}
                                </td>
                                <td class="px-4 py-3">
                                    <code class="px-2 py-1 bg-pink-50 rounded text-xs font-mono text-pink-700">{{ $partner->referral_code }}</code>
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    {{ $partner->default_commission_rate }}%
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">
                                        {{ $partner->leads_count }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">
                                        {{ $partner->commissions_count }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    @if($partner->is_active)
                                        <x-admin.badge color="emerald" label="{{ __('Active') }}" />
                                    @else
                                        <x-admin.badge color="gray" label="{{ __('Inactive') }}" />
                                    @endif
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="{{ route('admin.partners.show', $partner) }}"
                                           class="text-gray-500 hover:text-pink-600 transition-colors"
                                           title="{{ __('View') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </a>
                                        <a href="{{ route('admin.partners.edit', $partner) }}"
                                           class="text-gray-500 hover:text-blue-600 transition-colors"
                                           title="{{ __('Edit') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                        </a>
                                        <form method="POST" action="{{ route('admin.partners.destroy', $partner) }}"
                                              onsubmit="return confirm('{{ __('Are you sure you want to delete this partner?') }}')"
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
            @if($partners->hasPages())
                <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    {{ $partners->links() }}
                </div>
            @endif
        </div>
    @else
        <!-- Empty State -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-pink-400 p-12 text-center">
            <svg class="w-12 h-12 text-pink-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>
            <h3 class="text-lg font-medium text-gray-900 mb-1">{{ __('No partners yet') }}</h3>
            <p class="text-gray-500 mb-6">{{ __('No referral partners found. Add your first partner to get started.') }}</p>
            <a href="{{ route('admin.partners.create') }}"
               class="inline-flex items-center gap-2 bg-pink-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-pink-700 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                {{ __('Add Partner') }}
            </a>
        </div>
    @endif
@endsection
