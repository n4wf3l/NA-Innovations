@extends('layouts.admin')

@section('title', __('Quote') . ' ' . $quote->quote_number)

@section('content')
    @php
        $color = \App\Helpers\StatusHelper::quoteStatusColor($quote->status);
    @endphp

    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.quotes.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Quotes') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900">{{ $quote->quote_number }}</h1>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-{{ $color }}-100 text-{{ $color }}-700">
                {{ __(\App\Helpers\StatusHelper::formatStatus($quote->status)) }}
            </span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            @if($quote->status === 'draft')
                <form method="POST" action="{{ route('admin.quotes.send', $quote) }}" class="inline">
                    @csrf
                    <button type="submit" class="inline-flex items-center gap-2 bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-600 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                        {{ __('Send') }}
                    </button>
                </form>
            @endif

            <form method="POST" action="{{ route('admin.quotes.duplicate', $quote) }}" class="inline">
                @csrf
                <button type="submit" class="inline-flex items-center gap-2 bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    {{ __('Duplicate') }}
                </button>
            </form>

            <!-- Create Invoice Dropdown -->
            <div class="relative" x-data="{ open: false }">
                <button @click="open = !open" type="button"
                        class="inline-flex items-center gap-2 bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-emerald-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    {{ __('Create Invoice') }}
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>
                <div x-show="open" @click.outside="open = false" x-cloak
                     class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <form method="POST" action="{{ route('admin.quotes.create-invoice', $quote) }}">
                        @csrf
                        <input type="hidden" name="type" value="deposit">
                        <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            {{ __('Deposit Invoice') }}
                        </button>
                    </form>
                    <form method="POST" action="{{ route('admin.quotes.create-invoice', $quote) }}">
                        @csrf
                        <input type="hidden" name="type" value="final">
                        <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            {{ __('Final Invoice') }}
                        </button>
                    </form>
                </div>
            </div>

            <a href="{{ route('admin.quotes.pdf', $quote) }}"
               class="inline-flex items-center gap-2 bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                {{ __('Download PDF') }}
            </a>

            <a href="{{ route('admin.quotes.edit', $quote) }}"
               class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                {{ __('Edit') }}
            </a>
        </div>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column (2/3) -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Client Info Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Client Information') }}</h2>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Name') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $quote->client_name }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Email') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            <a href="mailto:{{ $quote->client_email }}" class="text-teal-600 hover:text-teal-700">{{ $quote->client_email }}</a>
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Company') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $quote->client_company ?? '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('VAT') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $quote->client_vat ?? '-' }}</dd>
                    </div>
                    @if($quote->client_address)
                        <div class="sm:col-span-2">
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Address') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">{!! nl2br(e($quote->client_address)) !!}</dd>
                        </div>
                    @endif
                </dl>
            </div>

            <!-- Quote Title & Content -->
            @if($quote->title)
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-2">{{ $quote->title }}</h2>
                    @if($quote->introduction)
                        <div class="text-sm text-gray-600 mb-4">{!! nl2br(e($quote->introduction)) !!}</div>
                    @endif
                    @if($quote->scope_of_work)
                        <h3 class="text-sm font-semibold text-gray-700 mb-1 mt-4">{{ __('Scope of Work') }}</h3>
                        <div class="text-sm text-gray-600 mb-4">{!! nl2br(e($quote->scope_of_work)) !!}</div>
                    @endif
                    @if($quote->exclusions)
                        <h3 class="text-sm font-semibold text-gray-700 mb-1 mt-4">{{ __('Exclusions') }}</h3>
                        <div class="text-sm text-gray-600">{!! nl2br(e($quote->exclusions)) !!}</div>
                    @endif
                </div>
            @endif

            <!-- Line Items Table -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="p-6 pb-0">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Line Items') }}</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 font-semibold text-gray-600">{{ __('Description') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600 text-center">{{ __('Qty') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Unit') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Unit Price') }}</th>
                                <th class="px-6 py-3 font-semibold text-gray-600 text-right">{{ __('Total') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            @foreach($quote->items as $item)
                                <tr class="{{ $item->is_optional ? 'bg-amber-50/50' : '' }}">
                                    <td class="px-6 py-3 text-gray-900">
                                        {{ $item->description }}
                                        @if($item->is_optional)
                                            <span class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">{{ __('Optional') }}</span>
                                        @endif
                                        @if($item->details)
                                            <p class="text-xs text-gray-500 mt-0.5">{{ $item->details }}</p>
                                        @endif
                                    </td>
                                    <td class="px-4 py-3 text-gray-600 text-center">{{ rtrim(rtrim(number_format($item->quantity, 2), '0'), '.') }}</td>
                                    <td class="px-4 py-3 text-gray-600">{{ $item->unit ?? '-' }}</td>
                                    <td class="px-4 py-3 text-gray-600 text-right">&euro;{{ number_format($item->unit_price, 2, ',', '.') }}</td>
                                    <td class="px-6 py-3 font-medium text-gray-900 text-right">&euro;{{ number_format($item->total, 2, ',', '.') }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <!-- Totals -->
                <div class="p-6 border-t border-gray-200 bg-gray-50">
                    <div class="flex justify-end">
                        <div class="w-72 space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-500">{{ __('Subtotal') }}:</span>
                                <span class="font-medium text-gray-900">&euro;{{ number_format($quote->subtotal, 2, ',', '.') }}</span>
                            </div>
                            @if($quote->discount_amount > 0)
                                <div class="flex justify-between text-red-600">
                                    <span>{{ __('Discount') }}:</span>
                                    <span>-&euro;{{ number_format($quote->discount_amount, 2, ',', '.') }}</span>
                                </div>
                            @endif
                            <div class="flex justify-between">
                                <span class="text-gray-500">{{ __('Tax') }} ({{ $quote->tax_rate }}%):</span>
                                <span class="text-gray-700">&euro;{{ number_format($quote->tax_amount, 2, ',', '.') }}</span>
                            </div>
                            <div class="flex justify-between pt-2 border-t border-gray-300">
                                <span class="font-semibold text-gray-900">{{ __('Total') }}:</span>
                                <span class="font-bold text-gray-900 text-lg">&euro;{{ number_format($quote->total, 2, ',', '.') }}</span>
                            </div>
                            @if($quote->deposit_percentage > 0)
                                <div class="flex justify-between text-teal-700">
                                    <span>{{ __('Deposit') }} ({{ $quote->deposit_percentage }}%):</span>
                                    <span class="font-medium">&euro;{{ number_format($quote->deposit_amount, 2, ',', '.') }}</span>
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Invoices -->
            @if($quote->invoices->count() > 0)
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Related Invoices') }}</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Invoice #') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Title') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Type') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600 text-right">{{ __('Total') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Status') }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                @foreach($quote->invoices as $invoice)
                                    @php
                                        $invColor = \App\Helpers\StatusHelper::invoiceStatusColor($invoice->status);
                                    @endphp
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-2 font-medium">
                                            <a href="{{ route('admin.invoices.show', $invoice) }}" class="text-teal-600 hover:text-teal-700">
                                                {{ $invoice->invoice_number }}
                                            </a>
                                        </td>
                                        <td class="px-4 py-2 text-gray-600">{{ $invoice->title }}</td>
                                        <td class="px-4 py-2 text-gray-600">{{ __(ucfirst($invoice->type ?? 'standard')) }}</td>
                                        <td class="px-4 py-2 text-gray-900 text-right font-medium">&euro;{{ number_format($invoice->total, 2, ',', '.') }}</td>
                                        <td class="px-4 py-2">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-{{ $invColor }}-100 text-{{ $invColor }}-700">
                                                {{ __(\App\Helpers\StatusHelper::formatStatus($invoice->status)) }}
                                            </span>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            @endif
        </div>

        <!-- Right Column (1/3) - Details & Timeline -->
        <div class="space-y-6">
            <!-- Quote Details -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Details') }}</h2>
                <dl class="space-y-3">
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Issue Date') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $quote->issue_date?->format('d/m/Y') ?? '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Valid Until') }}</dt>
                        <dd class="mt-1 text-sm {{ $quote->valid_until && $quote->valid_until->isPast() ? 'text-red-600 font-medium' : 'text-gray-900' }}">
                            {{ $quote->valid_until?->format('d/m/Y') ?? '-' }}
                        </dd>
                    </div>
                    @if($quote->sent_at)
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Sent At') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $quote->sent_at->format('d/m/Y H:i') }}</dd>
                        </div>
                    @endif
                    @if($quote->lead)
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Related Lead') }}</dt>
                            <dd class="mt-1 text-sm">
                                <a href="{{ route('admin.leads.show', $quote->lead) }}" class="text-teal-600 hover:text-teal-700">
                                    {{ $quote->lead->first_name }} {{ $quote->lead->last_name }}
                                </a>
                            </dd>
                        </div>
                    @endif
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Created') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $quote->created_at->format('d/m/Y H:i') }}</dd>
                    </div>
                </dl>
            </div>

            <!-- Timeline -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Timeline') }}</h2>

                @if($quote->timelineEvents->count() > 0)
                    <div class="relative">
                        <div class="absolute left-3.5 top-2 bottom-2 w-px bg-gray-200"></div>
                        <div class="space-y-6">
                            @foreach($quote->timelineEvents as $event)
                                <div class="relative flex gap-4">
                                    <div class="relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                                        @if($event->event_type === 'status_change') bg-teal-100 text-teal-600
                                        @else bg-gray-100 text-gray-500
                                        @endif">
                                        @if($event->event_type === 'status_change')
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
                                        @else
                                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        @endif
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-900">{{ $event->title }}</p>
                                        @if($event->description)
                                            <p class="text-xs text-gray-500 mt-0.5">{{ $event->description }}</p>
                                        @endif
                                        <p class="text-xs text-gray-400 mt-1">{{ $event->created_at->format('d/m/Y H:i') }}</p>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @else
                    <p class="text-sm text-gray-400 text-center py-4">{{ __('No timeline events yet.') }}</p>
                @endif
            </div>
        </div>
    </div>
@endsection
