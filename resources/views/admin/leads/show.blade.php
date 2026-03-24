@extends('layouts.admin')

@section('title', $lead->first_name . ' ' . $lead->last_name)

@section('content')
    @php
        $statusColors = [
            'new' => 'bg-violet-100 text-violet-700',
            'contacted' => 'bg-blue-100 text-blue-700',
            'brief_pending' => 'bg-indigo-100 text-indigo-700',
            'brief_completed' => 'bg-indigo-100 text-indigo-700',
            'qualified' => 'bg-cyan-100 text-cyan-700',
            'call_scheduled' => 'bg-cyan-100 text-cyan-700',
            'not_qualified' => 'bg-gray-100 text-gray-700',
            'quote_draft' => 'bg-amber-100 text-amber-700',
            'quote_sent' => 'bg-amber-100 text-amber-700',
            'won' => 'bg-emerald-100 text-emerald-700',
            'lost' => 'bg-red-100 text-red-700',
        ];
    @endphp

    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.leads.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Leads') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900">{{ $lead->first_name }} {{ $lead->last_name }}</h1>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $statusColors[$lead->status] ?? 'bg-gray-100 text-gray-700' }}">
                {{ ucwords(str_replace('_', ' ', $lead->status)) }}
            </span>
        </div>
        <a href="{{ route('admin.leads.edit', $lead) }}"
           class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            {{ __('Edit Lead') }}
        </a>
    </div>
    <p class="text-sm text-gray-500 -mt-4 mb-6">{{ ucwords(str_replace('_', ' ', $lead->source)) }} &middot; {{ ucwords(str_replace('_', ' ', $lead->status)) }}</p>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column (2/3) -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Contact Information Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Contact Information') }}</h2>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Email') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            <a href="mailto:{{ $lead->email }}" class="text-teal-600 hover:text-teal-700">{{ $lead->email }}</a>
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Phone') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            @if($lead->phone)
                                <a href="tel:{{ $lead->phone }}" class="text-teal-600 hover:text-teal-700">{{ $lead->phone }}</a>
                            @else
                                <span class="text-gray-400">-</span>
                            @endif
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Company') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $lead->company_name ?? '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Address') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            @if($lead->address || $lead->city || $lead->postal_code || $lead->country)
                                {{ $lead->address }}<br>
                                {{ $lead->postal_code }} {{ $lead->city }}<br>
                                {{ $lead->country }}
                            @else
                                <span class="text-gray-400">-</span>
                            @endif
                        </dd>
                    </div>
                </dl>
            </div>

            <!-- Lead Details Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Lead Details') }}</h2>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Source') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ ucwords(str_replace('_', ' ', $lead->source)) }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Estimated Budget') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">
                            @if($lead->estimated_budget)
                                &euro;{{ number_format($lead->estimated_budget, 2, ',', '.') }}
                            @else
                                <span class="text-gray-400">-</span>
                            @endif
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Referral Partner') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $lead->referralPartner?->user?->name ?? '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Service Interest') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $lead->service_interest ?? '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Created') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $lead->created_at->format('d/m/Y H:i') }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Last Updated') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $lead->updated_at->format('d/m/Y H:i') }}</dd>
                    </div>
                </dl>
            </div>

            <!-- Notes Section -->
            @if($lead->notes || $lead->notes()->count() > 0)
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Notes') }}</h2>

                    @if($lead->notes)
                        <div class="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 mb-4">
                            {!! nl2br(e($lead->notes)) !!}
                        </div>
                    @endif

                    @if($lead->notes()->count() > 0)
                        <div class="space-y-3">
                            @foreach($lead->notes as $note)
                                <div class="p-4 bg-gray-50 rounded-lg">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-xs font-medium text-gray-500">{{ $note->user?->name ?? 'System' }}</span>
                                        <span class="text-xs text-gray-400">{{ $note->created_at->format('d/m/Y H:i') }}</span>
                                    </div>
                                    <p class="text-sm text-gray-700">{!! nl2br(e($note->content)) !!}</p>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
            @endif

            <!-- Related Quotes -->
            @if($lead->quotes->count() > 0)
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Quotes') }}</h2>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Quote #') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Title') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Total') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Status') }}</th>
                                    <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Date') }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                @foreach($lead->quotes as $quote)
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-2 font-medium text-gray-900">{{ $quote->quote_number }}</td>
                                        <td class="px-4 py-2 text-gray-600">{{ $quote->title ?? '-' }}</td>
                                        <td class="px-4 py-2 text-gray-600">&euro;{{ number_format($quote->total, 2, ',', '.') }}</td>
                                        <td class="px-4 py-2">
                                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                {{ ucwords(str_replace('_', ' ', $quote->status)) }}
                                            </span>
                                        </td>
                                        <td class="px-4 py-2 text-gray-500 text-xs">{{ $quote->created_at->format('d/m/Y') }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            @endif
        </div>

        <!-- Right Column (1/3) - Timeline -->
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Timeline') }}</h2>

                @if($lead->timelineEvents->count() > 0)
                    <div class="relative">
                        <!-- Timeline line -->
                        <div class="absolute left-3.5 top-2 bottom-2 w-px bg-gray-200"></div>

                        <div class="space-y-6">
                            @foreach($lead->timelineEvents as $event)
                                <div class="relative flex gap-4">
                                    <!-- Icon -->
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

                                    <!-- Content -->
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
