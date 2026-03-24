@extends('layouts.admin')

@section('title', $client->name)

@section('content')
    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.clients.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Clients') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $client->name }}</h1>
            @if($client->company_name)
                <p class="text-sm text-gray-500 mt-1">{{ $client->company_name }}</p>
            @endif
        </div>
        <a href="{{ route('admin.clients.edit', $client) }}"
           class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            {{ __('Edit Client') }}
        </a>
    </div>

    <!-- Client Info Card -->
    <x-admin.card class="mb-6">
        <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Client Information') }}</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Email') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                        <a href="mailto:{{ $client->email }}" class="text-teal-600 hover:text-teal-700">{{ $client->email }}</a>
                    </dd>
                </div>
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Phone') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                        @if($client->phone)
                            <a href="tel:{{ $client->phone }}" class="text-teal-600 hover:text-teal-700">{{ $client->phone }}</a>
                        @else
                            <span class="text-gray-400">-</span>
                        @endif
                    </dd>
                </div>
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Company') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ $client->company_name ?? '-' }}</dd>
                </div>
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('VAT Number') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ $client->vat_number ?? '-' }}</dd>
                </div>
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Address') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">
                        @if($client->address || $client->city || $client->postal_code || $client->country)
                            {{ $client->address }}<br>
                            {{ $client->postal_code }} {{ $client->city }}<br>
                            {{ $client->country }}
                        @else
                            <span class="text-gray-400">-</span>
                        @endif
                    </dd>
                </div>
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Client Since') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ $client->created_at->format('d/m/Y') }}</dd>
                </div>
            </dl>
        </div>
    </x-admin.card>

    <!-- Tabs / Sections -->
    <div x-data="{ activeTab: 'projects' }" class="space-y-6">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200">
            <nav class="flex space-x-8">
                <button @click="activeTab = 'projects'"
                        :class="activeTab === 'projects' ? 'border-teal-300 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                        class="py-3 px-1 border-b-2 font-medium text-sm transition-colors">
                    {{ __('Projects') }} ({{ $client->projects->count() }})
                </button>
                <button @click="activeTab = 'quotes'"
                        :class="activeTab === 'quotes' ? 'border-teal-300 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                        class="py-3 px-1 border-b-2 font-medium text-sm transition-colors">
                    {{ __('Quotes') }} ({{ $client->quotes->count() }})
                </button>
                <button @click="activeTab = 'invoices'"
                        :class="activeTab === 'invoices' ? 'border-teal-300 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                        class="py-3 px-1 border-b-2 font-medium text-sm transition-colors">
                    {{ __('Invoices') }} ({{ $client->invoices->count() }})
                </button>
                <button @click="activeTab = 'services'"
                        :class="activeTab === 'services' ? 'border-teal-300 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                        class="py-3 px-1 border-b-2 font-medium text-sm transition-colors">
                    {{ __('Services') }} ({{ $client->recurringServices->count() }})
                </button>
            </nav>
        </div>

        <!-- Projects Tab -->
        <div x-show="activeTab === 'projects'" x-cloak>
            @if($client->projects->count() > 0)
                <x-admin.card>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Project Name') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Type') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Budget') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Start Date') }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                @foreach($client->projects as $project)
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-3 font-medium text-gray-900">
                                            <a href="{{ route('admin.projects.show', $project) }}" class="text-teal-600 hover:text-teal-700">
                                                {{ $project->nom_societe }}
                                            </a>
                                        </td>
                                        <td class="px-4 py-3 text-gray-600">{{ $project->type_site ?? '-' }}</td>
                                        <td class="px-4 py-3">
                                            @if($project->status)
                                                <x-admin.badge :color="\App\Helpers\StatusHelper::projectStatusColor($project->status)" :label="\App\Helpers\StatusHelper::formatStatus($project->status)" />
                                            @else
                                                <span class="text-gray-400">-</span>
                                            @endif
                                        </td>
                                        <td class="px-4 py-3 text-gray-600">
                                            @if($project->budget)
                                                &euro;{{ number_format($project->budget, 2, ',', '.') }}
                                            @else
                                                -
                                            @endif
                                        </td>
                                        <td class="px-4 py-3 text-gray-500 text-xs">
                                            {{ $project->start_date ? $project->start_date->format('d/m/Y') : '-' }}
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </x-admin.card>
            @else
                <x-admin.card>
                    <x-admin.empty-state
                        title="{{ __('No projects') }}"
                        description="{{ __('This client has no projects yet.') }}"
                    />
                </x-admin.card>
            @endif
        </div>

        <!-- Quotes Tab -->
        <div x-show="activeTab === 'quotes'" x-cloak>
            @if($client->quotes->count() > 0)
                <x-admin.card>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Quote #') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Title') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Total') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Date') }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                @foreach($client->quotes as $quote)
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-3 font-medium text-gray-900">{{ $quote->quote_number ?? '-' }}</td>
                                        <td class="px-4 py-3 text-gray-600">{{ $quote->title ?? '-' }}</td>
                                        <td class="px-4 py-3 text-gray-600">
                                            @if($quote->total)
                                                &euro;{{ number_format($quote->total, 2, ',', '.') }}
                                            @else
                                                -
                                            @endif
                                        </td>
                                        <td class="px-4 py-3">
                                            @if($quote->status)
                                                <x-admin.badge :color="\App\Helpers\StatusHelper::quoteStatusColor($quote->status)" :label="\App\Helpers\StatusHelper::formatStatus($quote->status)" />
                                            @else
                                                <span class="text-gray-400">-</span>
                                            @endif
                                        </td>
                                        <td class="px-4 py-3 text-gray-500 text-xs">{{ $quote->created_at->format('d/m/Y') }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </x-admin.card>
            @else
                <x-admin.card>
                    <x-admin.empty-state
                        title="{{ __('No quotes') }}"
                        description="{{ __('This client has no quotes yet.') }}"
                    />
                </x-admin.card>
            @endif
        </div>

        <!-- Invoices Tab -->
        <div x-show="activeTab === 'invoices'" x-cloak>
            @if($client->invoices->count() > 0)
                <x-admin.card>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Invoice #') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Total') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Due Date') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Created') }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                @foreach($client->invoices as $invoice)
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-3 font-medium text-gray-900">{{ $invoice->invoice_number ?? '-' }}</td>
                                        <td class="px-4 py-3 text-gray-600">
                                            @if($invoice->total)
                                                &euro;{{ number_format($invoice->total, 2, ',', '.') }}
                                            @else
                                                -
                                            @endif
                                        </td>
                                        <td class="px-4 py-3">
                                            @if($invoice->status)
                                                <x-admin.badge :color="\App\Helpers\StatusHelper::invoiceStatusColor($invoice->status)" :label="\App\Helpers\StatusHelper::formatStatus($invoice->status)" />
                                            @else
                                                <span class="text-gray-400">-</span>
                                            @endif
                                        </td>
                                        <td class="px-4 py-3 text-gray-500 text-xs">
                                            {{ $invoice->due_date ? $invoice->due_date->format('d/m/Y') : '-' }}
                                        </td>
                                        <td class="px-4 py-3 text-gray-500 text-xs">{{ $invoice->created_at->format('d/m/Y') }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </x-admin.card>
            @else
                <x-admin.card>
                    <x-admin.empty-state
                        title="{{ __('No invoices') }}"
                        description="{{ __('This client has no invoices yet.') }}"
                    />
                </x-admin.card>
            @endif
        </div>

        <!-- Services Tab -->
        <div x-show="activeTab === 'services'" x-cloak>
            @if($client->recurringServices->count() > 0)
                <x-admin.card>
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Service') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Price') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Frequency') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                                    <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Next Renewal') }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                @foreach($client->recurringServices as $service)
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-4 py-3 font-medium text-gray-900">{{ $service->name ?? $service->service_name ?? '-' }}</td>
                                        <td class="px-4 py-3 text-gray-600">
                                            @if($service->price)
                                                &euro;{{ number_format($service->price, 2, ',', '.') }}
                                            @else
                                                -
                                            @endif
                                        </td>
                                        <td class="px-4 py-3 text-gray-600">{{ ucfirst($service->frequency ?? $service->billing_cycle ?? '-') }}</td>
                                        <td class="px-4 py-3">
                                            @if($service->status)
                                                <x-admin.badge :color="\App\Helpers\StatusHelper::serviceStatusColor($service->status)" :label="\App\Helpers\StatusHelper::formatStatus($service->status)" />
                                            @else
                                                <span class="text-gray-400">-</span>
                                            @endif
                                        </td>
                                        <td class="px-4 py-3 text-gray-500 text-xs">
                                            {{ $service->next_renewal_date ? $service->next_renewal_date->format('d/m/Y') : '-' }}
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </x-admin.card>
            @else
                <x-admin.card>
                    <x-admin.empty-state
                        title="{{ __('No recurring services') }}"
                        description="{{ __('This client has no recurring services yet.') }}"
                    />
                </x-admin.card>
            @endif
        </div>
    </div>
@endsection
