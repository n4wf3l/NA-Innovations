@extends('layouts.admin')

@section('title', $partner->user->name ?? 'Partner')

@section('content')
    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.partners.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Partners') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900">{{ $partner->user->name ?? 'Partner' }}</h1>
            @if($partner->is_active)
                <x-admin.badge color="emerald" label="{{ __('Active') }}" />
            @else
                <x-admin.badge color="gray" label="{{ __('Inactive') }}" />
            @endif
        </div>
        <a href="{{ route('admin.partners.edit', $partner) }}"
           class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            {{ __('Edit Partner') }}
        </a>
    </div>

    <!-- Partner Info + Referral Link -->
    <x-admin.card class="mb-6">
        <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Partner Information') }}</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Email') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                        <a href="mailto:{{ $partner->user->email }}" class="text-teal-600 hover:text-teal-700">{{ $partner->user->email }}</a>
                    </dd>
                </div>
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Commission Rate') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ $partner->default_commission_rate }}%</dd>
                </div>
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Payment Method') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ ucwords(str_replace('_', ' ', $partner->payment_method ?? '-')) }}</dd>
                </div>
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Bank IBAN') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ $partner->bank_iban ?? '-' }}</dd>
                </div>
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('PayPal Email') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ $partner->paypal_email ?? '-' }}</dd>
                </div>
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Partner Since') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ $partner->created_at->format('d/m/Y') }}</dd>
                </div>
            </dl>

            <!-- Referral Link -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg" x-data="{ copied: false }">
                <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{{ __('Referral Link') }}</label>
                <div class="flex items-center gap-2">
                    <code id="referral-link" class="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-700 truncate">
                        {{ url('/?ref=' . $partner->referral_code) }}
                    </code>
                    <button type="button"
                            @click="navigator.clipboard.writeText(document.getElementById('referral-link').textContent.trim()); copied = true; setTimeout(() => copied = false, 2000)"
                            class="inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <template x-if="!copied">
                            <span class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                                {{ __('Copy') }}
                            </span>
                        </template>
                        <template x-if="copied">
                            <span class="flex items-center gap-1 text-emerald-600">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                                {{ __('Copied!') }}
                            </span>
                        </template>
                    </button>
                </div>
                <p class="mt-1 text-xs text-gray-500">{{ __('Referral Code') }}: <code class="font-mono font-bold">{{ $partner->referral_code }}</code></p>
            </div>

            @if($partner->notes)
                <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{{ __('Notes') }}</label>
                    <p class="text-sm text-gray-700">{!! nl2br(e($partner->notes)) !!}</p>
                </div>
            @endif
        </div>
    </x-admin.card>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <x-admin.stat-card label="{{ __('Total Leads') }}" :value="$totalLeads" />
        <x-admin.stat-card label="{{ __('Won Leads') }}" :value="$wonLeads" />
        <x-admin.stat-card label="{{ __('Conversion Rate') }}" :value="$conversionRate . '%'" />
        <x-admin.stat-card label="{{ __('Total Earned') }}" :value="'EUR ' . number_format($totalCommissionPaid, 2, ',', '.')" />
    </div>

    <!-- Commission Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <x-admin.card>
            <div class="p-4">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Estimated') }}</p>
                <p class="mt-1 text-xl font-bold text-gray-900">&euro;{{ number_format($totalCommissionEstimated, 2, ',', '.') }}</p>
            </div>
        </x-admin.card>
        <x-admin.card>
            <div class="p-4">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Confirmed') }}</p>
                <p class="mt-1 text-xl font-bold text-blue-600">&euro;{{ number_format($totalCommissionConfirmed, 2, ',', '.') }}</p>
            </div>
        </x-admin.card>
        <x-admin.card>
            <div class="p-4">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Paid') }}</p>
                <p class="mt-1 text-xl font-bold text-emerald-600">&euro;{{ number_format($totalCommissionPaid, 2, ',', '.') }}</p>
            </div>
        </x-admin.card>
    </div>

    <!-- Recent Leads -->
    <x-admin.card class="mb-6">
        <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Recent Leads') }}</h2>

            @if($partner->leads->count() > 0)
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Name') }}</th>
                                <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Email') }}</th>
                                <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Status') }}</th>
                                <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Created') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            @foreach($partner->leads as $lead)
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-2 font-medium text-gray-900">
                                        <a href="{{ route('admin.leads.show', $lead) }}" class="text-teal-600 hover:text-teal-700">
                                            {{ $lead->first_name }} {{ $lead->last_name }}
                                        </a>
                                    </td>
                                    <td class="px-4 py-2 text-gray-600">{{ $lead->email }}</td>
                                    <td class="px-4 py-2">
                                        <x-admin.badge :color="\App\Helpers\StatusHelper::leadStatusColor($lead->status)" :label="\App\Helpers\StatusHelper::formatStatus($lead->status)" />
                                    </td>
                                    <td class="px-4 py-2 text-gray-500 text-xs">{{ $lead->created_at->format('d/m/Y') }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <p class="text-sm text-gray-400 text-center py-4">{{ __('No leads yet for this partner.') }}</p>
            @endif
        </div>
    </x-admin.card>

    <!-- Commissions -->
    <x-admin.card>
        <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Commissions') }}</h2>

            @if($partner->commissions->count() > 0)
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Base Amount') }}</th>
                                <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Rate') }}</th>
                                <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Commission') }}</th>
                                <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Status') }}</th>
                                <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Paid Date') }}</th>
                                <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Created') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            @foreach($partner->commissions as $commission)
                                <tr class="hover:bg-gray-50">
                                    <td class="px-4 py-2 text-gray-600">&euro;{{ number_format($commission->base_amount ?? 0, 2, ',', '.') }}</td>
                                    <td class="px-4 py-2 text-gray-600">{{ $commission->commission_rate }}%</td>
                                    <td class="px-4 py-2 font-medium text-gray-900">&euro;{{ number_format($commission->commission_amount ?? 0, 2, ',', '.') }}</td>
                                    <td class="px-4 py-2">
                                        <x-admin.badge :color="\App\Helpers\StatusHelper::commissionStatusColor($commission->status)" :label="\App\Helpers\StatusHelper::formatStatus($commission->status)" />
                                    </td>
                                    <td class="px-4 py-2 text-gray-500 text-xs">
                                        {{ $commission->paid_date ? $commission->paid_date->format('d/m/Y') : '-' }}
                                    </td>
                                    <td class="px-4 py-2 text-gray-500 text-xs">{{ $commission->created_at->format('d/m/Y') }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <p class="text-sm text-gray-400 text-center py-4">{{ __('No commissions yet for this partner.') }}</p>
            @endif
        </div>
    </x-admin.card>
@endsection
