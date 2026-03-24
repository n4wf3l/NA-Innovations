@extends('layouts.admin')

@section('title', __('Service') . ' - ' . $service->name)

@section('content')
    @php
        $sColor = \App\Helpers\StatusHelper::serviceStatusColor($service->status);
        $daysUntilExpiry = $service->expiry_date ? now()->diffInDays($service->expiry_date, false) : null;
        $typeColors = [
            'domain' => 'bg-blue-100 text-blue-700',
            'hosting' => 'bg-violet-100 text-violet-700',
            'ssl' => 'bg-emerald-100 text-emerald-700',
            'email' => 'bg-cyan-100 text-cyan-700',
            'saas' => 'bg-indigo-100 text-indigo-700',
            'maintenance' => 'bg-amber-100 text-amber-700',
            'support' => 'bg-teal-100 text-teal-700',
            'other' => 'bg-gray-100 text-gray-700',
        ];
    @endphp

    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.services.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Services') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900">{{ $service->name }}</h1>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {{ $typeColors[$service->type] ?? 'bg-gray-100 text-gray-700' }}">
                {{ __(ucfirst($service->type)) }}
            </span>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-{{ $sColor }}-100 text-{{ $sColor }}-700">
                {{ __(\App\Helpers\StatusHelper::formatStatus($service->status)) }}
            </span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <form method="POST" action="{{ route('admin.services.renew', $service) }}" class="inline"
                  onsubmit="return confirm('{{ __('Renew this service?') }}')">
                @csrf
                <button type="submit" class="inline-flex items-center gap-2 bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-emerald-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    {{ __('Renew') }}
                </button>
            </form>
            <a href="{{ route('admin.services.edit', $service) }}"
               class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                {{ __('Edit') }}
            </a>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column (2/3) -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Service Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Service Information') }}</h2>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Provider') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $service->provider ?? '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Frequency') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ __(ucwords(str_replace('_', ' ', $service->frequency))) }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Purchase Date') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $service->purchase_date?->format('d/m/Y') ?? '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Expiry Date') }}</dt>
                        <dd class="mt-1 text-sm font-medium {{ $daysUntilExpiry !== null && $daysUntilExpiry < 0 ? 'text-red-600' : ($daysUntilExpiry !== null && $daysUntilExpiry <= 30 ? 'text-amber-600' : 'text-gray-900') }}">
                            {{ $service->expiry_date?->format('d/m/Y') ?? '-' }}
                            @if($daysUntilExpiry !== null)
                                @if($daysUntilExpiry < 0)
                                    ({{ __('Expired :count days ago', ['count' => abs((int)$daysUntilExpiry)]) }})
                                @elseif($daysUntilExpiry == 0)
                                    ({{ __('Expires today') }})
                                @else
                                    ({{ __(':count days remaining', ['count' => (int)$daysUntilExpiry]) }})
                                @endif
                            @endif
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Payment Mode') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ __(ucwords(str_replace('_', ' ', $service->payment_mode ?? 'manual'))) }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Auto-Renew') }}</dt>
                        <dd class="mt-1 text-sm">
                            @if($service->auto_renew)
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">{{ __('Yes') }}</span>
                            @else
                                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{{ __('No') }}</span>
                            @endif
                        </dd>
                    </div>
                    @if($service->client)
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Client') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $service->client->name }}</dd>
                        </div>
                    @endif
                    @if($service->projet)
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Project') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $service->projet->nom_societe }}</dd>
                        </div>
                    @endif
                </dl>

                @if($service->description)
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{{ __('Description') }}</dt>
                        <dd class="text-sm text-gray-700">{!! nl2br(e($service->description)) !!}</dd>
                    </div>
                @endif

                @if($service->notes)
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{{ __('Notes') }}</dt>
                        <dd class="text-sm text-gray-700">{!! nl2br(e($service->notes)) !!}</dd>
                    </div>
                @endif
            </div>

            <!-- Renewal History -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Renewal History') }}</h2>
                @if($service->renewals->count() > 0)
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Renewal Date') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('New Expiry') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600 text-right">{{ __('Cost') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600 text-right">{{ __('Billed') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Status') }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                @foreach($service->renewals->sortByDesc('renewal_date') as $renewal)
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-2 text-gray-900">{{ $renewal->renewal_date?->format('d/m/Y') }}</td>
                                        <td class="px-4 py-2 text-gray-600">{{ $renewal->new_expiry_date?->format('d/m/Y') }}</td>
                                        <td class="px-4 py-2 text-gray-600 text-right">&euro;{{ number_format($renewal->cost, 2, ',', '.') }}</td>
                                        <td class="px-4 py-2 text-gray-600 text-right">&euro;{{ number_format($renewal->billed_amount, 2, ',', '.') }}</td>
                                        <td class="px-4 py-2">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {{ $renewal->status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700' }}">
                                                {{ __(ucfirst($renewal->status ?? 'pending')) }}
                                            </span>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @else
                    <p class="text-sm text-gray-400 text-center py-4">{{ __('No renewals recorded yet.') }}</p>
                @endif
            </div>
        </div>

        <!-- Right Column (1/3) - Margin -->
        <div class="space-y-6">
            <!-- Margin Calculation -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Margin Calculation') }}</h2>
                <dl class="space-y-3">
                    <div class="flex justify-between items-center">
                        <dt class="text-sm text-gray-500">{{ __('Real Cost') }}</dt>
                        <dd class="text-sm font-medium text-gray-900">&euro;{{ number_format($service->real_cost, 2, ',', '.') }}</dd>
                    </div>
                    <div class="flex justify-between items-center">
                        <dt class="text-sm text-gray-500">{{ __('Billed Price') }}</dt>
                        <dd class="text-sm font-medium text-gray-900">&euro;{{ number_format($service->billed_price, 2, ',', '.') }}</dd>
                    </div>
                    <div class="flex justify-between items-center pt-3 border-t border-gray-200">
                        <dt class="text-sm font-semibold text-gray-900">{{ __('Margin') }}</dt>
                        <dd class="text-lg font-bold {{ $service->margin >= 0 ? 'text-emerald-600' : 'text-red-600' }}">
                            &euro;{{ number_format($service->margin, 2, ',', '.') }}
                        </dd>
                    </div>
                    @if($service->billed_price > 0)
                        <div class="flex justify-between items-center">
                            <dt class="text-xs text-gray-400">{{ __('Margin %') }}</dt>
                            <dd class="text-sm font-medium {{ $service->margin >= 0 ? 'text-emerald-600' : 'text-red-600' }}">
                                {{ number_format(($service->margin / $service->billed_price) * 100, 1) }}%
                            </dd>
                        </div>
                    @endif
                </dl>
            </div>

            <!-- Quick Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Quick Info') }}</h2>
                <dl class="space-y-3">
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Created') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $service->created_at->format('d/m/Y H:i') }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Last Updated') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $service->updated_at->format('d/m/Y H:i') }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Total Renewals') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $service->renewals->count() }}</dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
@endsection
