@extends('layouts.admin')

@section('title', __('Recurring Services'))

@section('content')
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Recurring Services') }}</h1>
        <a href="{{ route('admin.services.create') }}"
           class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            {{ __('New Service') }}
        </a>
    </div>
    <p class="text-sm text-gray-500 -mt-4 mb-6">{{ __('Monitor hosting, domains, and other recurring services. Stay ahead of renewals and track your margins.') }}</p>

    <!-- Filters -->
    <form method="GET" action="{{ route('admin.services.index') }}" class="mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
            <!-- Type Filter -->
            <select name="type"
                    onchange="this.form.submit()"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                <option value="">{{ __('All Types') }}</option>
                @foreach(['domain', 'hosting', 'ssl', 'email', 'saas', 'maintenance', 'support', 'other'] as $type)
                    <option value="{{ $type }}" {{ request('type') === $type ? 'selected' : '' }}>
                        {{ __(ucwords($type)) }}
                    </option>
                @endforeach
            </select>

            <!-- Status Filter -->
            <select name="status"
                    onchange="this.form.submit()"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                <option value="">{{ __('All Statuses') }}</option>
                @foreach(['active', 'expiring_soon', 'expired', 'cancelled', 'suspended'] as $status)
                    <option value="{{ $status }}" {{ request('status') === $status ? 'selected' : '' }}>
                        {{ __(ucwords(str_replace('_', ' ', $status))) }}
                    </option>
                @endforeach
            </select>

            <!-- Search -->
            <div class="flex-1">
                <input type="text" name="search" value="{{ request('search') }}"
                       placeholder="{{ __('Search by name or provider...') }}"
                       class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
            </div>

            <button type="submit"
                    class="inline-flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {{ __('Search') }}
            </button>

            @if(request()->hasAny(['type', 'status', 'search']))
                <a href="{{ route('admin.services.index') }}"
                   class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    {{ __('Clear') }}
                </a>
            @endif
        </div>
    </form>

    <!-- Table -->
    @if($services->count() > 0)
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Name') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Type') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Client') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Provider') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Expiry Date') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Cost') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Billed') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Margin') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($services as $service)
                            @php
                                $sColor = \App\Helpers\StatusHelper::serviceStatusColor($service->status);
                                $daysUntilExpiry = $service->expiry_date ? now()->diffInDays($service->expiry_date, false) : null;
                                $isExpiringSoon = $daysUntilExpiry !== null && $daysUntilExpiry >= 0 && $daysUntilExpiry <= 30;
                                $isExpired = $daysUntilExpiry !== null && $daysUntilExpiry < 0;

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
                            <tr class="{{ $isExpiringSoon ? 'bg-amber-50/50' : ($isExpired ? 'bg-red-50/50' : '') }} hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 font-medium text-gray-900">
                                    <a href="{{ route('admin.services.show', $service) }}" class="text-teal-600 hover:text-teal-700">
                                        {{ $service->name }}
                                    </a>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {{ $typeColors[$service->type] ?? 'bg-gray-100 text-gray-700' }}">
                                        {{ __(ucfirst($service->type)) }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-gray-600">{{ $service->client?->name ?? '-' }}</td>
                                <td class="px-4 py-3 text-gray-600">{{ $service->provider ?? '-' }}</td>
                                <td class="px-4 py-3 text-xs font-medium {{ $isExpired ? 'text-red-600' : ($isExpiringSoon ? 'text-amber-600' : 'text-gray-500') }}">
                                    {{ $service->expiry_date?->format('d/m/Y') ?? '-' }}
                                    @if($isExpiringSoon)
                                        <span class="block text-xs">({{ (int) $daysUntilExpiry }}{{ __('d left') }})</span>
                                    @elseif($isExpired)
                                        <span class="block text-xs">({{ __('Expired') }})</span>
                                    @endif
                                </td>
                                <td class="px-4 py-3 text-gray-600 text-right">&euro;{{ number_format($service->real_cost, 2, ',', '.') }}</td>
                                <td class="px-4 py-3 text-gray-600 text-right">&euro;{{ number_format($service->billed_price, 2, ',', '.') }}</td>
                                <td class="px-4 py-3 text-right font-medium {{ $service->margin >= 0 ? 'text-emerald-600' : 'text-red-600' }}">
                                    &euro;{{ number_format($service->margin, 2, ',', '.') }}
                                </td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-{{ $sColor }}-100 text-{{ $sColor }}-700">
                                        {{ __(\App\Helpers\StatusHelper::formatStatus($service->status)) }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="{{ route('admin.services.show', $service) }}"
                                           class="text-gray-500 hover:text-teal-600 transition-colors" title="{{ __('View') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </a>
                                        <a href="{{ route('admin.services.edit', $service) }}"
                                           class="text-gray-500 hover:text-blue-600 transition-colors" title="{{ __('Edit') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                        </a>
                                        <form method="POST" action="{{ route('admin.services.renew', $service) }}" class="inline"
                                              onsubmit="return confirm('{{ __('Renew this service?') }}')">
                                            @csrf
                                            <button type="submit"
                                                    class="text-gray-500 hover:text-emerald-600 transition-colors" title="{{ __('Renew') }}">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                                            </button>
                                        </form>
                                        <form method="POST" action="{{ route('admin.services.destroy', $service) }}"
                                              onsubmit="return confirm('{{ __('Delete this service?') }}')" class="inline">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit"
                                                    class="text-gray-500 hover:text-red-600 transition-colors" title="{{ __('Delete') }}">
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

            @if($services->hasPages())
                <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    {{ $services->links() }}
                </div>
            @endif
        </div>
    @else
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"/></svg>
            <h3 class="text-lg font-medium text-gray-900 mb-1">{{ __('No recurring services yet') }}</h3>
            <p class="text-gray-500 mb-6">{{ __('Add your first recurring service to track domains, hosting, and more.') }}</p>
            <a href="{{ route('admin.services.create') }}"
               class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                {{ __('New Service') }}
            </a>
        </div>
    @endif
@endsection
