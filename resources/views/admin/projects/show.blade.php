@extends('layouts.admin')

@section('title', $project->nom_societe)

@section('content')
    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.projects.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Projects') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900">{{ $project->nom_societe }}</h1>
            @if($project->status)
                <x-admin.badge :color="\App\Helpers\StatusHelper::projectStatusColor($project->status)" :label="\App\Helpers\StatusHelper::formatStatus($project->status)" />
            @endif
        </div>
        <a href="{{ route('admin.projects.edit', $project) }}"
           class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            {{ __('Edit Project') }}
        </a>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column (2/3) -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Project Information Card -->
            <x-admin.card>
                <div class="p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Project Information') }}</h2>
                    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Client') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                @if($project->client)
                                    <a href="{{ route('admin.clients.show', $project->client) }}" class="text-teal-600 hover:text-teal-700">
                                        {{ $project->client->name }}
                                    </a>
                                @else
                                    <span class="text-gray-400">{{ __('No client assigned') }}</span>
                                @endif
                            </dd>
                        </div>
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Developer') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                @if($project->developer)
                                    <div class="flex items-center gap-2">
                                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-300 text-xs font-bold text-gray-900">
                                            {{ strtoupper(substr($project->developer->name, 0, 1)) }}
                                        </span>
                                        {{ $project->developer->name }}
                                    </div>
                                @else
                                    <span class="text-gray-400">{{ __('Unassigned') }}</span>
                                @endif
                            </dd>
                        </div>
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Referral Partner') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                @if($project->lead && $project->lead->referralPartner && $project->lead->referralPartner->user)
                                    <a href="{{ route('admin.partners.show', $project->lead->referralPartner) }}" class="text-teal-600 hover:text-teal-700">
                                        {{ $project->lead->referralPartner->user->name }}
                                    </a>
                                @else
                                    <span class="text-gray-400">-</span>
                                @endif
                            </dd>
                        </div>
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Company Type') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $project->type_societe ?? '-' }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Site Type') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $project->type_site ?? '-' }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Location') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $project->lieu ?? '-' }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Budget') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                @if($project->budget)
                                    &euro;{{ number_format($project->budget, 2, ',', '.') }}
                                @else
                                    <span class="text-gray-400">-</span>
                                @endif
                            </dd>
                        </div>
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Total Billed') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                @if($project->total_billed)
                                    &euro;{{ number_format($project->total_billed, 2, ',', '.') }}
                                @else
                                    <span class="text-gray-400">&euro;0,00</span>
                                @endif
                            </dd>
                        </div>
                    </dl>
                </div>
            </x-admin.card>

            <!-- Dates Card -->
            <x-admin.card>
                <div class="p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Dates') }}</h2>
                    <dl class="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Start Date') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $project->start_date ? $project->start_date->format('d/m/Y') : '-' }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('End Date') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ $project->end_date ? $project->end_date->format('d/m/Y') : '-' }}</dd>
                        </div>
                        <div>
                            <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Deadline') }}</dt>
                            <dd class="mt-1 text-sm text-gray-900">
                                @if($project->deadline)
                                    <span class="{{ $project->deadline->isPast() ? 'text-red-600 font-medium' : '' }}">
                                        {{ $project->deadline->format('d/m/Y') }}
                                    </span>
                                @else
                                    -
                                @endif
                            </dd>
                        </div>
                    </dl>
                </div>
            </x-admin.card>

            <!-- Description -->
            @if($project->description)
                <x-admin.card>
                    <div class="p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Description') }}</h2>
                        <div class="text-sm text-gray-700 leading-relaxed">
                            {!! nl2br(e($project->description)) !!}
                        </div>
                    </div>
                </x-admin.card>
            @endif

            <!-- Related Quotes -->
            @if($project->quotes->count() > 0)
                <x-admin.card>
                    <div class="p-6">
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
                                    @foreach($project->quotes as $quote)
                                        <tr class="hover:bg-gray-50">
                                            <td class="px-4 py-2 font-medium text-gray-900">{{ $quote->quote_number ?? '-' }}</td>
                                            <td class="px-4 py-2 text-gray-600">{{ $quote->title ?? '-' }}</td>
                                            <td class="px-4 py-2 text-gray-600">&euro;{{ number_format($quote->total ?? 0, 2, ',', '.') }}</td>
                                            <td class="px-4 py-2">
                                                @if($quote->status)
                                                    <x-admin.badge :color="\App\Helpers\StatusHelper::quoteStatusColor($quote->status)" :label="\App\Helpers\StatusHelper::formatStatus($quote->status)" />
                                                @endif
                                            </td>
                                            <td class="px-4 py-2 text-gray-500 text-xs">{{ $quote->created_at->format('d/m/Y') }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </x-admin.card>
            @endif

            <!-- Related Invoices -->
            @if($project->invoices->count() > 0)
                <x-admin.card>
                    <div class="p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Invoices') }}</h2>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <thead class="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Invoice #') }}</th>
                                        <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Total') }}</th>
                                        <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Status') }}</th>
                                        <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Due Date') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    @foreach($project->invoices as $invoice)
                                        <tr class="hover:bg-gray-50">
                                            <td class="px-4 py-2 font-medium text-gray-900">{{ $invoice->invoice_number ?? '-' }}</td>
                                            <td class="px-4 py-2 text-gray-600">&euro;{{ number_format($invoice->total ?? 0, 2, ',', '.') }}</td>
                                            <td class="px-4 py-2">
                                                @if($invoice->status)
                                                    <x-admin.badge :color="\App\Helpers\StatusHelper::invoiceStatusColor($invoice->status)" :label="\App\Helpers\StatusHelper::formatStatus($invoice->status)" />
                                                @endif
                                            </td>
                                            <td class="px-4 py-2 text-gray-500 text-xs">{{ $invoice->due_date ? $invoice->due_date->format('d/m/Y') : '-' }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </x-admin.card>
            @endif

            <!-- Recurring Services -->
            @if($project->recurringServices->count() > 0)
                <x-admin.card>
                    <div class="p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Recurring Services') }}</h2>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left">
                                <thead class="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Service') }}</th>
                                        <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Price') }}</th>
                                        <th class="px-4 py-2 font-semibold text-gray-600">{{ __('Status') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    @foreach($project->recurringServices as $service)
                                        <tr class="hover:bg-gray-50">
                                            <td class="px-4 py-2 font-medium text-gray-900">{{ $service->name ?? $service->service_name ?? '-' }}</td>
                                            <td class="px-4 py-2 text-gray-600">&euro;{{ number_format($service->price ?? 0, 2, ',', '.') }}</td>
                                            <td class="px-4 py-2">
                                                @if($service->status)
                                                    <x-admin.badge :color="\App\Helpers\StatusHelper::serviceStatusColor($service->status)" :label="\App\Helpers\StatusHelper::formatStatus($service->status)" />
                                                @endif
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </x-admin.card>
            @endif
        </div>

        <!-- Right Column (1/3) - Timeline -->
        <div class="space-y-6">
            <x-admin.card>
                <div class="p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Timeline') }}</h2>

                    @if($project->timelineEvents->count() > 0)
                        <div class="relative">
                            <!-- Timeline line -->
                            <div class="absolute left-3.5 top-2 bottom-2 w-px bg-gray-200"></div>

                            <div class="space-y-6">
                                @foreach($project->timelineEvents as $event)
                                    <div class="relative flex gap-4">
                                        <!-- Icon -->
                                        <div class="relative z-10 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center
                                            @if($event->event_type === 'status_change') bg-teal-100 text-teal-600
                                            @elseif($event->event_type === 'project_created') bg-violet-100 text-violet-600
                                            @else bg-gray-100 text-gray-500
                                            @endif">
                                            @if($event->event_type === 'status_change')
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
                                            @elseif($event->event_type === 'project_created')
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
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
            </x-admin.card>

            <!-- Notes -->
            @if($project->notes->count() > 0)
                <x-admin.card>
                    <div class="p-6">
                        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Notes') }}</h2>
                        <div class="space-y-3">
                            @foreach($project->notes as $note)
                                <div class="p-4 bg-gray-50 rounded-lg">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-xs font-medium text-gray-500">{{ $note->user?->name ?? 'System' }}</span>
                                        <span class="text-xs text-gray-400">{{ $note->created_at->format('d/m/Y H:i') }}</span>
                                    </div>
                                    <p class="text-sm text-gray-700">{!! nl2br(e($note->content)) !!}</p>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </x-admin.card>
            @endif
        </div>
    </div>
@endsection
