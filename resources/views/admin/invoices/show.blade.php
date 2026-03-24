@extends('layouts.admin')

@section('title', __('Invoice') . ' ' . $invoice->invoice_number)

@section('content')
    @php
        $color = \App\Helpers\StatusHelper::invoiceStatusColor($invoice->status);
    @endphp

    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.invoices.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Invoices') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900">{{ $invoice->invoice_number }}</h1>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-{{ $color }}-100 text-{{ $color }}-700">
                {{ __(\App\Helpers\StatusHelper::formatStatus($invoice->status)) }}
            </span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                {{ __(ucfirst($invoice->type ?? 'standard')) }}
            </span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            @if($invoice->status === 'draft')
                <form method="POST" action="{{ route('admin.invoices.send', $invoice) }}" class="inline">
                    @csrf
                    <button type="submit" class="inline-flex items-center gap-2 bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-600 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                        {{ __('Send') }}
                    </button>
                </form>
            @endif

            <a href="{{ route('admin.invoices.pdf', $invoice) }}"
               class="inline-flex items-center gap-2 bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                {{ __('Download PDF') }}
            </a>

            @if(!in_array($invoice->status, ['paid', 'cancelled']))
                <button type="button"
                        onclick="document.getElementById('paymentModal').classList.remove('hidden')"
                        class="inline-flex items-center gap-2 bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-emerald-600 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    {{ __('Record Payment') }}
                </button>
            @endif

            <a href="{{ route('admin.invoices.edit', $invoice) }}"
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
                        <dd class="mt-1 text-sm text-gray-900">{{ $invoice->client_name }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Email') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            <a href="mailto:{{ $invoice->client_email }}" class="text-teal-600 hover:text-teal-700">{{ $invoice->client_email }}</a>
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Company') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $invoice->client_company ?? '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('VAT') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $invoice->client_vat ?? '-' }}</dd>
                    </div>
                </dl>
            </div>

            <!-- Line Items Table -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="p-6 pb-0">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ $invoice->title }}</h2>
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
                            @foreach($invoice->items as $item)
                                <tr>
                                    <td class="px-6 py-3 text-gray-900">
                                        {{ $item->description }}
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
                                <span class="font-medium text-gray-900">&euro;{{ number_format($invoice->subtotal, 2, ',', '.') }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-500">{{ __('Tax') }} ({{ $invoice->tax_rate }}%):</span>
                                <span class="text-gray-700">&euro;{{ number_format($invoice->tax_amount, 2, ',', '.') }}</span>
                            </div>
                            <div class="flex justify-between pt-2 border-t border-gray-300">
                                <span class="font-semibold text-gray-900">{{ __('Total') }}:</span>
                                <span class="font-bold text-gray-900 text-lg">&euro;{{ number_format($invoice->total, 2, ',', '.') }}</span>
                            </div>
                            <div class="flex justify-between text-emerald-600">
                                <span>{{ __('Amount Paid') }}:</span>
                                <span class="font-medium">&euro;{{ number_format($invoice->amount_paid ?? 0, 2, ',', '.') }}</span>
                            </div>
                            <div class="flex justify-between {{ ($invoice->amount_due ?? $invoice->total) > 0 ? 'text-red-600 font-semibold' : 'text-gray-700' }}">
                                <span>{{ __('Amount Due') }}:</span>
                                <span>&euro;{{ number_format($invoice->amount_due ?? $invoice->total, 2, ',', '.') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payments History -->
            @if($invoice->payments->count() > 0)
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Payment History') }}</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Date') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600 text-right">{{ __('Amount') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Method') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Reference') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Status') }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                @foreach($invoice->payments as $payment)
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-2 text-gray-900">{{ $payment->payment_date?->format('d/m/Y') }}</td>
                                        <td class="px-4 py-2 text-gray-900 text-right font-medium">&euro;{{ number_format($payment->amount, 2, ',', '.') }}</td>
                                        <td class="px-4 py-2 text-gray-600">{{ __(ucwords(str_replace('_', ' ', $payment->method ?? '-'))) }}</td>
                                        <td class="px-4 py-2 text-gray-600">{{ $payment->reference ?? '-' }}</td>
                                        <td class="px-4 py-2">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium {{ $payment->status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700' }}">
                                                {{ __(ucfirst($payment->status ?? 'pending')) }}
                                            </span>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            @endif

            <!-- Related Quote -->
            @if($invoice->quote)
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Related Quote') }}</h2>
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p class="text-sm font-medium text-gray-900">{{ $invoice->quote->quote_number }}</p>
                            <p class="text-xs text-gray-500 mt-0.5">{{ $invoice->quote->title }}</p>
                        </div>
                        <a href="{{ route('admin.quotes.show', $invoice->quote) }}"
                           class="text-sm font-medium text-teal-600 hover:text-teal-700">
                            {{ __('View Quote') }}
                        </a>
                    </div>
                </div>
            @endif
        </div>

        <!-- Right Column (1/3) -->
        <div class="space-y-6">
            <!-- Invoice Details -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Details') }}</h2>
                <dl class="space-y-3">
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Issue Date') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $invoice->issue_date?->format('d/m/Y') ?? '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Due Date') }}</dt>
                        @php
                            $isOverdue = $invoice->due_date && $invoice->due_date->isPast() && !in_array($invoice->status, ['paid', 'cancelled', 'refunded']);
                        @endphp
                        <dd class="mt-1 text-sm {{ $isOverdue ? 'text-red-600 font-medium' : 'text-gray-900' }}">
                            {{ $invoice->due_date?->format('d/m/Y') ?? '-' }}
                            @if($isOverdue) <span class="text-xs">({{ __('Overdue') }})</span> @endif
                        </dd>
                    </div>
                    @if($invoice->sent_at)
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Sent At') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $invoice->sent_at->format('d/m/Y H:i') }}</dd>
                        </div>
                    @endif
                    @if($invoice->paid_at)
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Paid At') }}</dt>
                            <dd class="mt-1 text-sm text-emerald-600 font-medium">{{ $invoice->paid_at->format('d/m/Y H:i') }}</dd>
                        </div>
                    @endif
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Created') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $invoice->created_at->format('d/m/Y H:i') }}</dd>
                    </div>
                </dl>
            </div>

            @if($invoice->payment_instructions)
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Payment Instructions') }}</h2>
                    <div class="text-sm text-gray-700">{!! nl2br(e($invoice->payment_instructions)) !!}</div>
                </div>
            @endif

            <!-- Timeline -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Timeline') }}</h2>

                @if($invoice->timelineEvents->count() > 0)
                    <div class="relative">
                        <div class="absolute left-3.5 top-2 bottom-2 w-px bg-gray-200"></div>
                        <div class="space-y-6">
                            @foreach($invoice->timelineEvents as $event)
                                <div class="relative flex gap-4">
                                    <div class="relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                                        @if($event->event_type === 'status_change') bg-teal-100 text-teal-600
                                        @else bg-gray-100 text-gray-500
                                        @endif">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
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

    <!-- Record Payment Modal -->
    <div id="paymentModal" class="hidden fixed inset-0 z-50 overflow-y-auto" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4">
            <div class="fixed inset-0 bg-black/50" onclick="document.getElementById('paymentModal').classList.add('hidden')"></div>
            <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 z-10">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">{{ __('Record Payment') }}</h3>
                    <button type="button" onclick="document.getElementById('paymentModal').classList.add('hidden')"
                            class="text-gray-400 hover:text-gray-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                <form method="POST" action="{{ route('admin.invoices.record-payment', $invoice) }}">
                    @csrf
                    <div class="space-y-4">
                        <div>
                            <label for="payment_amount" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Amount') }} <span class="text-red-500">*</span></label>
                            <input type="number" name="amount" id="payment_amount"
                                   value="{{ $invoice->amount_due ?? $invoice->total }}"
                                   step="0.01" min="0.01"
                                   class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                        </div>

                        <div>
                            <label for="payment_method" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Method') }}</label>
                            <select name="method" id="payment_method"
                                    class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                                <option value="bank_transfer">{{ __('Bank Transfer') }}</option>
                                <option value="cash">{{ __('Cash') }}</option>
                                <option value="card">{{ __('Card') }}</option>
                                <option value="paypal">{{ __('PayPal') }}</option>
                                <option value="other">{{ __('Other') }}</option>
                            </select>
                        </div>

                        <div>
                            <label for="payment_reference" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Reference') }}</label>
                            <input type="text" name="reference" id="payment_reference"
                                   placeholder="{{ __('Transaction reference...') }}"
                                   class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                        </div>

                        <div>
                            <label for="payment_date" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Payment Date') }}</label>
                            <input type="date" name="payment_date" id="payment_date"
                                   value="{{ now()->format('Y-m-d') }}"
                                   class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                        </div>

                        <div>
                            <label for="payment_notes" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Notes') }}</label>
                            <textarea name="notes" id="payment_notes" rows="2"
                                      class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300"
                                      placeholder="{{ __('Optional notes...') }}"></textarea>
                        </div>
                    </div>

                    <div class="mt-6 flex items-center justify-end gap-3">
                        <button type="button" onclick="document.getElementById('paymentModal').classList.add('hidden')"
                                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            {{ __('Cancel') }}
                        </button>
                        <button type="submit"
                                class="px-6 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                            {{ __('Record Payment') }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
