@extends('layouts.admin')

@section('title', __('Invoices'))

@section('content')
@php
    $totalInvoices = \App\Models\Invoice::count();
    $paidAmount = \App\Models\Invoice::where('status', 'paid')->sum('total');
    $outstandingAmount = \App\Models\Invoice::whereNotIn('status', ['paid', 'cancelled'])->sum('amount_due');
    $overdueCount = \App\Models\Invoice::where('status', '!=', 'paid')
        ->where('status', '!=', 'cancelled')
        ->whereNotNull('due_date')
        ->where('due_date', '<', now())
        ->count();
@endphp

    {{-- Module Banner --}}
    <div class="bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div class="relative z-10">
            <p class="text-emerald-100 text-sm mb-1">{{ __('Finance') }} / {{ __('Invoices') }}</p>
            <h2 class="font-display text-2xl text-white tracking-wide">{{ __('Invoices') }}</h2>
            <p class="text-emerald-100 text-sm mt-1">{{ __('Manage all invoices. Track payments, send reminders, and monitor overdue amounts.') }}</p>
        </div>
        {{-- Background icon --}}
        <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
        </svg>
        {{-- Action button --}}
        <div class="absolute right-6 bottom-6">
            <a href="{{ route('admin.invoices.create') }}" class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium rounded-lg transition">
                + {{ __('New Invoice') }}
            </a>
        </div>
    </div>

    {{-- KPI Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-emerald-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Total Invoices') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $totalInvoices }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-emerald-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Paid Amount') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">&euro;{{ number_format($paidAmount, 0, ',', '.') }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-emerald-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Outstanding') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">&euro;{{ number_format($outstandingAmount, 0, ',', '.') }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-red-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Overdue') }}</p>
                    <p class="text-2xl font-bold text-red-600 mt-1">{{ $overdueCount }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <form method="GET" action="{{ route('admin.invoices.index') }}" class="mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
            <!-- Status Filter -->
            <select name="status"
                    onchange="this.form.submit()"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-emerald-400 focus:ring-emerald-400">
                <option value="">{{ __('All Statuses') }}</option>
                @foreach(['draft', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'cancelled'] as $status)
                    <option value="{{ $status }}" {{ request('status') === $status ? 'selected' : '' }}>
                        {{ __(ucwords(str_replace('_', ' ', $status))) }}
                    </option>
                @endforeach
            </select>

            <!-- Type Filter -->
            <select name="type"
                    onchange="this.form.submit()"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-emerald-400 focus:ring-emerald-400">
                <option value="">{{ __('All Types') }}</option>
                @foreach(['standard', 'deposit', 'final', 'credit_note'] as $type)
                    <option value="{{ $type }}" {{ request('type') === $type ? 'selected' : '' }}>
                        {{ __(ucwords(str_replace('_', ' ', $type))) }}
                    </option>
                @endforeach
            </select>

            <!-- Search Input -->
            <div class="flex-1">
                <input type="text"
                       name="search"
                       value="{{ request('search') }}"
                       placeholder="{{ __('Search by title, number, or client...') }}"
                       class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-emerald-400 focus:ring-emerald-400">
            </div>

            <!-- Submit -->
            <button type="submit"
                    class="inline-flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-emerald-700 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {{ __('Search') }}
            </button>

            @if(request()->hasAny(['status', 'type', 'search']))
                <a href="{{ route('admin.invoices.index') }}"
                   class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    {{ __('Clear') }}
                </a>
            @endif
        </div>
    </form>

    <!-- Table -->
    @if($invoices->count() > 0)
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('#Number') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Title') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Client') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Type') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Total') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Amount Due') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Due Date') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($invoices as $invoice)
                            @php
                                $color = \App\Helpers\StatusHelper::invoiceStatusColor($invoice->status);
                                $isOverdue = $invoice->due_date && $invoice->due_date->isPast() && !in_array($invoice->status, ['paid', 'cancelled', 'refunded']);
                            @endphp
                            <tr class="{{ $isOverdue ? 'bg-red-50' : '' }} hover:bg-emerald-50/40 transition-colors border-l-4 {{ $isOverdue ? 'border-l-red-400' : 'border-l-transparent hover:border-l-emerald-400' }}">
                                <td class="px-4 py-3 font-medium text-gray-900">
                                    <a href="{{ route('admin.invoices.show', $invoice) }}" class="text-emerald-600 hover:text-emerald-700">
                                        {{ $invoice->invoice_number }}
                                    </a>
                                </td>
                                <td class="px-4 py-3 text-gray-700">{{ $invoice->title }}</td>
                                <td class="px-4 py-3 text-gray-600">{{ $invoice->client_name }}</td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                                        {{ __(ucfirst($invoice->type ?? 'standard')) }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-{{ $color }}-100 text-{{ $color }}-700">
                                        {{ __(\App\Helpers\StatusHelper::formatStatus($invoice->status)) }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 font-medium text-gray-900 text-right">&euro;{{ number_format($invoice->total, 2, ',', '.') }}</td>
                                <td class="px-4 py-3 text-right {{ $invoice->amount_due > 0 ? 'font-medium text-red-600' : 'text-gray-600' }}">
                                    &euro;{{ number_format($invoice->amount_due ?? $invoice->total, 2, ',', '.') }}
                                </td>
                                <td class="px-4 py-3 text-xs {{ $isOverdue ? 'text-red-600 font-medium' : 'text-gray-500' }}">
                                    {{ $invoice->due_date?->format('d/m/Y') ?? '-' }}
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="{{ route('admin.invoices.show', $invoice) }}"
                                           class="text-gray-500 hover:text-emerald-600 transition-colors"
                                           title="{{ __('View') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </a>
                                        <a href="{{ route('admin.invoices.edit', $invoice) }}"
                                           class="text-gray-500 hover:text-blue-600 transition-colors"
                                           title="{{ __('Edit') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                        </a>
                                        @if($invoice->status === 'draft')
                                            <form method="POST" action="{{ route('admin.invoices.destroy', $invoice) }}"
                                                  onsubmit="return confirm('{{ __('Are you sure you want to delete this invoice?') }}')"
                                                  class="inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit"
                                                        class="text-gray-500 hover:text-red-600 transition-colors"
                                                        title="{{ __('Delete') }}">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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

            @if($invoices->hasPages())
                <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    {{ $invoices->links() }}
                </div>
            @endif
        </div>
    @else
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-emerald-400 p-12 text-center">
            <svg class="w-12 h-12 text-emerald-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/></svg>
            <h3 class="text-lg font-medium text-gray-900 mb-1">{{ __('No invoices yet') }}</h3>
            <p class="text-gray-500 mb-6">{{ __('Create your first invoice to get started.') }}</p>
            <a href="{{ route('admin.invoices.create') }}"
               class="inline-flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-emerald-700 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                {{ __('New Invoice') }}
            </a>
        </div>
    @endif
@endsection
