@extends('layouts.admin')

@section('title', __('Dashboard'))
@section('header', __('Dashboard'))

@section('content')
    <p class="text-sm text-gray-500 mb-6">{{ __('Overview of your business activity. Track revenue, projects, leads, and alerts at a glance.') }}</p>

    {{-- Stats cards --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <x-admin.stat-card :label="__('Revenue (MTD)')" :value="'EUR ' . number_format($revenueMonth, 2, ',', '.')">
            <x-slot:icon>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </x-slot:icon>
        </x-admin.stat-card>

        <x-admin.stat-card :label="__('Active Projects')" :value="$activeProjects">
            <x-slot:icon>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/>
                </svg>
            </x-slot:icon>
        </x-admin.stat-card>

        <x-admin.stat-card :label="__('Open Leads')" :value="$openLeads">
            <x-slot:icon>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
                </svg>
            </x-slot:icon>
        </x-admin.stat-card>

        <x-admin.stat-card :label="__('Pending Invoices')" :value="'EUR ' . number_format($pendingInvoices, 2, ',', '.')">
            <x-slot:icon>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
                </svg>
            </x-slot:icon>
        </x-admin.stat-card>
    </div>

    {{-- Quick Actions --}}
    <div class="mb-8">
        <x-admin.card>
            <div class="p-4 flex flex-wrap gap-3">
                <a href="{{ route('admin.leads.create') }}" class="inline-flex items-center gap-2 px-4 py-2 bg-teal-300 text-gray-900 text-sm font-medium rounded-lg hover:bg-teal-400 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    {{ __('New Lead') }}
                </a>
                <a href="{{ route('admin.quotes.create') }}" class="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    {{ __('New Quote') }}
                </a>
                <a href="{{ route('admin.invoices.create') }}" class="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    {{ __('New Invoice') }}
                </a>
                <a href="{{ route('admin.clients.create') }}" class="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                    {{ __('New Client') }}
                </a>
            </div>
        </x-admin.card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {{-- Recent Leads --}}
        <x-admin.card>
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">{{ __('Recent Leads') }}</h3>
                    <a href="{{ route('admin.leads.index') }}" class="text-sm text-teal-600 hover:text-teal-700">{{ __('View all') }}</a>
                </div>
                @if($recentLeads->count())
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b border-gray-100">
                                    <th class="text-left py-2 text-xs font-medium text-gray-500 uppercase">{{ __('Name') }}</th>
                                    <th class="text-left py-2 text-xs font-medium text-gray-500 uppercase">{{ __('Status') }}</th>
                                    <th class="text-left py-2 text-xs font-medium text-gray-500 uppercase">{{ __('Source') }}</th>
                                    <th class="text-right py-2 text-xs font-medium text-gray-500 uppercase">{{ __('Date') }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                @foreach($recentLeads as $lead)
                                    <tr class="hover:bg-gray-50">
                                        <td class="py-2.5">
                                            <a href="{{ route('admin.leads.show', $lead) }}" class="font-medium text-gray-900 hover:text-teal-600">
                                                {{ $lead->first_name }} {{ $lead->last_name }}
                                            </a>
                                        </td>
                                        <td class="py-2.5">
                                            <x-admin.badge
                                                :color="\App\Helpers\StatusHelper::leadStatusColor($lead->status)"
                                                :label="\App\Helpers\StatusHelper::formatStatus($lead->status)"
                                            />
                                        </td>
                                        <td class="py-2.5 text-gray-500">
                                            {{ \App\Helpers\StatusHelper::formatStatus($lead->source ?? '-') }}
                                        </td>
                                        <td class="py-2.5 text-right text-gray-500">
                                            {{ $lead->created_at->format('d M Y') }}
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @else
                    <p class="text-sm text-gray-500">{{ __('No leads yet.') }}</p>
                @endif
            </div>
        </x-admin.card>

        {{-- Alerts --}}
        <x-admin.card>
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Alerts') }}</h3>
                <div class="space-y-4">
                    {{-- Overdue Invoices --}}
                    @if($overdueInvoices->count())
                        <div>
                            <div class="flex items-center gap-2 mb-2">
                                <span class="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                                <span class="text-sm font-semibold text-red-700">{{ __('Overdue Invoices') }}</span>
                            </div>
                            <ul class="ml-4 space-y-1">
                                @foreach($overdueInvoices as $invoice)
                                    <li class="text-sm text-gray-700">
                                        <a href="{{ route('admin.invoices.show', $invoice) }}" class="hover:text-red-600">
                                            {{ $invoice->invoice_number }} &mdash; {{ $invoice->client_name }}
                                            <span class="text-red-600 font-medium">EUR {{ number_format($invoice->amount_due, 2, ',', '.') }}</span>
                                            @if($invoice->due_date)
                                                <span class="text-gray-400 text-xs">(due {{ $invoice->due_date->format('d/m/Y') }})</span>
                                            @endif
                                        </a>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    {{-- Expiring Services --}}
                    @if($expiringServices->count())
                        <div>
                            <div class="flex items-center gap-2 mb-2">
                                <span class="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                                <span class="text-sm font-semibold text-amber-700">{{ __('Services Expiring Soon') }}</span>
                            </div>
                            <ul class="ml-4 space-y-1">
                                @foreach($expiringServices as $service)
                                    <li class="text-sm text-gray-700">
                                        <a href="{{ route('admin.services.show', $service) }}" class="hover:text-amber-600">
                                            {{ $service->name }}
                                            @if($service->client)
                                                &mdash; {{ $service->client->name }}
                                            @endif
                                            @if($service->expiry_date)
                                                <span class="text-amber-600 text-xs font-medium">(expires {{ $service->expiry_date->format('d/m/Y') }})</span>
                                            @endif
                                        </a>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    {{-- Pending Commissions --}}
                    @if($pendingCommissions > 0)
                        <div>
                            <div class="flex items-center gap-2 mb-2">
                                <span class="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                <span class="text-sm font-semibold text-blue-700">{{ __('Commissions to Pay') }}</span>
                            </div>
                            <p class="ml-4 text-sm text-gray-700">
                                <a href="{{ route('admin.commissions.index') }}" class="hover:text-blue-600">
                                    {{ __(':amount in pending commissions', ['amount' => 'EUR ' . number_format($pendingCommissions, 2, ',', '.')]) }}
                                </a>
                            </p>
                        </div>
                    @endif

                    @if(!$overdueInvoices->count() && !$expiringServices->count() && $pendingCommissions <= 0)
                        <div class="flex items-center gap-2 text-sm text-gray-500">
                            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ __('All clear! No alerts at the moment.') }}
                        </div>
                    @endif
                </div>
            </div>
        </x-admin.card>
    </div>
@endsection
