@extends('layouts.admin')

@section('title', __('Commissions'))

@section('content')
@php
    $totalCommissions = \App\Models\Commission::count();
    $pendingPayout = \App\Models\Commission::whereIn('status', ['confirmed', 'scheduled'])->sum('commission_amount');
    $paidOut = \App\Models\Commission::where('status', 'paid')->sum('commission_amount');
    $partnersActive = \App\Models\Commission::whereIn('status', ['estimated', 'confirmed', 'scheduled'])->distinct('referral_partner_id')->count('referral_partner_id');
@endphp

    {{-- Module Banner --}}
    <div class="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div class="relative z-10">
            <p class="text-orange-100 text-sm mb-1">{{ __('Finance') }} / {{ __('Commissions') }}</p>
            <h2 class="font-display text-2xl text-white tracking-wide">{{ __('Commissions') }}</h2>
            <p class="text-orange-100 text-sm mt-1">{{ __('Track referral partner commissions. Confirm, schedule, and record payments for earned commissions.') }}</p>
        </div>
        {{-- Background icon --}}
        <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 text-white/10 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>
        </svg>
    </div>

    {{-- KPI Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-orange-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Total Commissions') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $totalCommissions }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-orange-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Pending Payout') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">&euro;{{ number_format($pendingPayout, 0, ',', '.') }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-orange-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Paid Out') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">&euro;{{ number_format($paidOut, 0, ',', '.') }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-orange-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Partners Active') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $partnersActive }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <form method="GET" action="{{ route('admin.commissions.index') }}" class="mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
            <!-- Status Filter -->
            <select name="status"
                    onchange="this.form.submit()"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-400 focus:ring-orange-400">
                <option value="">{{ __('All Statuses') }}</option>
                @foreach(['estimated', 'confirmed', 'scheduled', 'paid', 'cancelled'] as $status)
                    <option value="{{ $status }}" {{ request('status') === $status ? 'selected' : '' }}>
                        {{ __(ucwords($status)) }}
                    </option>
                @endforeach
            </select>

            <!-- Partner Filter -->
            <select name="partner_id"
                    onchange="this.form.submit()"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-400 focus:ring-orange-400">
                <option value="">{{ __('All Partners') }}</option>
                @foreach($partners as $partner)
                    <option value="{{ $partner->id }}" {{ request('partner_id') == $partner->id ? 'selected' : '' }}>
                        {{ $partner->user?->name ?? 'Partner #' . $partner->id }}
                    </option>
                @endforeach
            </select>

            <!-- Search -->
            <div class="flex-1">
                <input type="text" name="search" value="{{ request('search') }}"
                       placeholder="{{ __('Search by partner or lead name...') }}"
                       class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-orange-400 focus:ring-orange-400">
            </div>

            <button type="submit"
                    class="inline-flex items-center gap-2 bg-orange-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-orange-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {{ __('Search') }}
            </button>

            @if(request()->hasAny(['status', 'partner_id', 'search']))
                <a href="{{ route('admin.commissions.index') }}"
                   class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    {{ __('Clear') }}
                </a>
            @endif
        </div>
    </form>

    <!-- Table -->
    @if($commissions->count() > 0)
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Partner') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Lead') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Invoice #') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Base Amount') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-center">{{ __('Rate') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Commission') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($commissions as $commission)
                            @php
                                $color = \App\Helpers\StatusHelper::commissionStatusColor($commission->status);
                            @endphp
                            <tr class="hover:bg-orange-50/40 transition-colors border-l-4 border-l-transparent hover:border-l-orange-400">
                                <td class="px-4 py-3 font-medium text-gray-900">
                                    {{ $commission->referralPartner?->user?->name ?? '-' }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    @if($commission->lead)
                                        <a href="{{ route('admin.leads.show', $commission->lead) }}" class="text-orange-600 hover:text-orange-700">
                                            {{ $commission->lead->first_name }} {{ $commission->lead->last_name }}
                                        </a>
                                    @else
                                        -
                                    @endif
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    @if($commission->invoice)
                                        <a href="{{ route('admin.invoices.show', $commission->invoice) }}" class="text-orange-600 hover:text-orange-700">
                                            {{ $commission->invoice->invoice_number }}
                                        </a>
                                    @else
                                        -
                                    @endif
                                </td>
                                <td class="px-4 py-3 text-gray-600 text-right">&euro;{{ number_format($commission->base_amount, 2, ',', '.') }}</td>
                                <td class="px-4 py-3 text-gray-600 text-center">{{ $commission->commission_rate }}%</td>
                                <td class="px-4 py-3 font-medium text-gray-900 text-right">&euro;{{ number_format($commission->commission_amount, 2, ',', '.') }}</td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-{{ $color }}-100 text-{{ $color }}-700">
                                        {{ __(\App\Helpers\StatusHelper::formatStatus($commission->status)) }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="{{ route('admin.commissions.show', $commission) }}"
                                           class="text-gray-500 hover:text-orange-600 transition-colors"
                                           title="{{ __('View') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </a>

                                        @if($commission->status === 'estimated')
                                            <form method="POST" action="{{ route('admin.commissions.confirm', $commission) }}" class="inline">
                                                @csrf
                                                @method('PATCH')
                                                <button type="submit"
                                                        class="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                                        title="{{ __('Confirm') }}">
                                                    {{ __('Confirm') }}
                                                </button>
                                            </form>
                                        @endif

                                        @if($commission->status === 'confirmed')
                                            <form method="POST" action="{{ route('admin.commissions.schedule', $commission) }}" class="inline"
                                                  x-data x-on:submit.prevent="
                                                    const date = prompt('{{ __('Enter scheduled payment date (YYYY-MM-DD):') }}');
                                                    if (date) {
                                                        const input = document.createElement('input');
                                                        input.type = 'hidden';
                                                        input.name = 'scheduled_payment_date';
                                                        input.value = date;
                                                        $el.appendChild(input);
                                                        $el.submit();
                                                    }
                                                  ">
                                                @csrf
                                                @method('PATCH')
                                                <button type="submit"
                                                        class="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                                                        title="{{ __('Schedule') }}">
                                                    {{ __('Schedule') }}
                                                </button>
                                            </form>
                                        @endif

                                        @if(in_array($commission->status, ['confirmed', 'scheduled']))
                                            <form method="POST" action="{{ route('admin.commissions.pay', $commission) }}" class="inline">
                                                @csrf
                                                @method('PATCH')
                                                <button type="submit"
                                                        class="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                                                        title="{{ __('Mark Paid') }}">
                                                    {{ __('Pay') }}
                                                </button>
                                            </form>
                                        @endif

                                        @if(!in_array($commission->status, ['paid', 'cancelled']))
                                            <form method="POST" action="{{ route('admin.commissions.destroy', $commission) }}"
                                                  onsubmit="return confirm('{{ __('Cancel this commission?') }}')"
                                                  class="inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit"
                                                        class="text-gray-500 hover:text-red-600 transition-colors"
                                                        title="{{ __('Cancel') }}">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                </button>
                                            </form>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            @if($commissions->hasPages())
                <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    {{ $commissions->links() }}
                </div>
            @endif
        </div>
    @else
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-orange-400 p-12 text-center">
            <svg class="w-12 h-12 text-orange-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/></svg>
            <h3 class="text-lg font-medium text-gray-900 mb-1">{{ __('No commissions yet') }}</h3>
            <p class="text-gray-500">{{ __('Commissions will appear here when payments are recorded for referred leads.') }}</p>
        </div>
    @endif
@endsection
