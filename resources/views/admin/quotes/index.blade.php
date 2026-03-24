@extends('layouts.admin')

@section('title', __('Quotes'))

@section('content')
@php
    $totalQuotes = \App\Models\Quote::count();
    $pendingQuotes = \App\Models\Quote::whereIn('status', ['sent', 'viewed'])->count();
    $acceptedQuotes = \App\Models\Quote::where('status', 'accepted')->count();
    $totalAcceptedValue = \App\Models\Quote::where('status', 'accepted')->sum('total');
@endphp

    {{-- Module Banner --}}
    <div class="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div class="relative z-10">
            <p class="text-amber-100 text-sm mb-1">{{ __('Business') }} / {{ __('Quotes') }}</p>
            <h2 class="font-display text-2xl text-white tracking-wide">{{ __('Quotes') }}</h2>
            <p class="text-amber-100 text-sm mt-1">{{ __('Create and manage quotes for your clients. Send professional PDF quotes and track their status.') }}</p>
        </div>
        {{-- Background icon --}}
        <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
        </svg>
        {{-- Action button --}}
        <div class="absolute right-6 bottom-6">
            <a href="{{ route('admin.quotes.create') }}" class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium rounded-lg transition">
                + {{ __('New Quote') }}
            </a>
        </div>
    </div>

    {{-- KPI Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-amber-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Total Quotes') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $totalQuotes }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-amber-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Pending') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $pendingQuotes }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-amber-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Accepted') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $acceptedQuotes }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-amber-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Total Value') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">&euro;{{ number_format($totalAcceptedValue, 0, ',', '.') }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <form method="GET" action="{{ route('admin.quotes.index') }}" class="mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
            <!-- Status Filter -->
            <select name="status"
                    onchange="this.form.submit()"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-amber-400 focus:ring-amber-400">
                <option value="">{{ __('All Statuses') }}</option>
                @foreach(['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'] as $status)
                    <option value="{{ $status }}" {{ request('status') === $status ? 'selected' : '' }}>
                        {{ __(ucwords(str_replace('_', ' ', $status))) }}
                    </option>
                @endforeach
            </select>

            <!-- Search Input -->
            <div class="flex-1">
                <input type="text"
                       name="search"
                       value="{{ request('search') }}"
                       placeholder="{{ __('Search by title, number, or client...') }}"
                       class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-amber-400 focus:ring-amber-400">
            </div>

            <!-- Submit -->
            <button type="submit"
                    class="inline-flex items-center gap-2 bg-amber-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-amber-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {{ __('Search') }}
            </button>

            @if(request()->hasAny(['status', 'search']))
                <a href="{{ route('admin.quotes.index') }}"
                   class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    {{ __('Clear') }}
                </a>
            @endif
        </div>
    </form>

    <!-- Table -->
    @if($quotes->count() > 0)
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('#Number') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Title') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Client') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Subtotal') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Total') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Issue Date') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Valid Until') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($quotes as $quote)
                            @php
                                $color = \App\Helpers\StatusHelper::quoteStatusColor($quote->status);
                            @endphp
                            <tr class="hover:bg-amber-50/40 transition-colors border-l-4 border-l-transparent hover:border-l-amber-400">
                                <td class="px-4 py-3 font-medium text-gray-900">
                                    <a href="{{ route('admin.quotes.show', $quote) }}" class="text-amber-600 hover:text-amber-700">
                                        {{ $quote->quote_number }}
                                    </a>
                                </td>
                                <td class="px-4 py-3 text-gray-700">{{ $quote->title }}</td>
                                <td class="px-4 py-3 text-gray-600">{{ $quote->client_name }}</td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-{{ $color }}-100 text-{{ $color }}-700">
                                        {{ __(\App\Helpers\StatusHelper::formatStatus($quote->status)) }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-gray-600 text-right">&euro;{{ number_format($quote->subtotal, 2, ',', '.') }}</td>
                                <td class="px-4 py-3 font-medium text-gray-900 text-right">&euro;{{ number_format($quote->total, 2, ',', '.') }}</td>
                                <td class="px-4 py-3 text-gray-500 text-xs">{{ $quote->issue_date?->format('d/m/Y') ?? '-' }}</td>
                                <td class="px-4 py-3 text-xs {{ $quote->valid_until && $quote->valid_until->isPast() ? 'text-red-500 font-medium' : 'text-gray-500' }}">
                                    {{ $quote->valid_until?->format('d/m/Y') ?? '-' }}
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="{{ route('admin.quotes.show', $quote) }}"
                                           class="text-gray-500 hover:text-amber-600 transition-colors"
                                           title="{{ __('View') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </a>
                                        <a href="{{ route('admin.quotes.edit', $quote) }}"
                                           class="text-gray-500 hover:text-blue-600 transition-colors"
                                           title="{{ __('Edit') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                        </a>
                                        <form method="POST" action="{{ route('admin.quotes.destroy', $quote) }}"
                                              onsubmit="return confirm('{{ __('Are you sure you want to delete this quote?') }}')"
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
            @if($quotes->hasPages())
                <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    {{ $quotes->links() }}
                </div>
            @endif
        </div>
    @else
        <!-- Empty State -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-amber-400 p-12 text-center">
            <svg class="w-12 h-12 text-amber-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
            <h3 class="text-lg font-medium text-gray-900 mb-1">{{ __('No quotes yet') }}</h3>
            <p class="text-gray-500 mb-6">{{ __('Create your first quote to get started.') }}</p>
            <a href="{{ route('admin.quotes.create') }}"
               class="inline-flex items-center gap-2 bg-amber-500 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-amber-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                {{ __('New Quote') }}
            </a>
        </div>
    @endif
@endsection
