@extends('layouts.admin')

@section('title', __('Leads'))

@section('content')
<div x-data="{ view: 'table' }">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Leads') }}</h1>
        <a href="{{ route('admin.leads.create') }}"
           class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            {{ __('Add Lead') }}
        </a>
    </div>
    <p class="text-sm text-gray-500 -mt-4 mb-6">{{ __('Manage your sales pipeline. Track prospects from first contact to closed deal.') }}</p>

    <!-- View Toggle -->
    <div class="flex items-center space-x-2 mb-6">
        <button @click="view = 'table'" :class="view === 'table' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300'" class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            {{ __('Table') }}
        </button>
        <button @click="view = 'kanban'" :class="view === 'kanban' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-300'" class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"/></svg>
            {{ __('Kanban') }}
        </button>
    </div>

    <!-- ==================== TABLE VIEW ==================== -->
    <div x-show="view === 'table'">
        <!-- Filters -->
        <form method="GET" action="{{ route('admin.leads.index') }}" class="mb-6">
            <div class="flex flex-col sm:flex-row gap-3">
                <!-- Status Filter -->
                <select name="status"
                        onchange="this.form.submit()"
                        class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                    <option value="">{{ __('All Statuses') }}</option>
                    @foreach(['new', 'contacted', 'brief_pending', 'brief_completed', 'call_scheduled', 'qualified', 'not_qualified', 'quote_draft', 'quote_sent', 'won', 'lost'] as $status)
                        <option value="{{ $status }}" {{ request('status') === $status ? 'selected' : '' }}>
                            {{ ucwords(str_replace('_', ' ', $status)) }}
                        </option>
                    @endforeach
                </select>

                <!-- Source Filter -->
                <select name="source"
                        onchange="this.form.submit()"
                        class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                    <option value="">{{ __('All Sources') }}</option>
                    @foreach(['referral', 'organic', 'website_contact', 'social_media', 'word_of_mouth', 'advertising', 'other'] as $source)
                        <option value="{{ $source }}" {{ request('source') === $source ? 'selected' : '' }}>
                            {{ ucwords(str_replace('_', ' ', $source)) }}
                        </option>
                    @endforeach
                </select>

                <!-- Search Input -->
                <div class="flex-1">
                    <input type="text"
                           name="search"
                           value="{{ request('search') }}"
                           placeholder="{{ __('Search by name or email...') }}"
                           class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                </div>

                <!-- Submit -->
                <button type="submit"
                        class="inline-flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    {{ __('Search') }}
                </button>

                @if(request()->hasAny(['status', 'source', 'search']))
                    <a href="{{ route('admin.leads.index') }}"
                       class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        {{ __('Clear') }}
                    </a>
                @endif
            </div>
        </form>

        <!-- Table -->
        @if($leads->count() > 0)
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Name') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Email') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Company') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Source') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Budget') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Partner') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Created') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            @foreach($leads as $lead)
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-4 py-3 font-medium text-gray-900">
                                        {{ $lead->first_name }} {{ $lead->last_name }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ $lead->email }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ $lead->company_name ?? '-' }}
                                    </td>
                                    <td class="px-4 py-3">
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
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $statusColors[$lead->status] ?? 'bg-gray-100 text-gray-700' }}">
                                            {{ ucwords(str_replace('_', ' ', $lead->status)) }}
                                        </span>
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ ucwords(str_replace('_', ' ', $lead->source)) }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        @if($lead->estimated_budget)
                                            &euro;{{ number_format($lead->estimated_budget, 2, ',', '.') }}
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ $lead->referralPartner?->user?->name ?? '-' }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-500 text-xs">
                                        {{ $lead->created_at->format('d/m/Y') }}
                                    </td>
                                    <td class="px-4 py-3">
                                        <div class="flex items-center justify-end gap-2">
                                            <a href="{{ route('admin.leads.show', $lead) }}"
                                               class="text-gray-500 hover:text-teal-600 transition-colors"
                                               title="{{ __('View') }}">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                            </a>
                                            <a href="{{ route('admin.leads.edit', $lead) }}"
                                               class="text-gray-500 hover:text-blue-600 transition-colors"
                                               title="{{ __('Edit') }}">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                            </a>
                                            <form method="POST" action="{{ route('admin.leads.destroy', $lead) }}"
                                                  onsubmit="return confirm('{{ __('Are you sure you want to delete this lead?') }}')"
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
                @if($leads->hasPages())
                    <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        {{ $leads->links() }}
                    </div>
                @endif
            </div>
        @else
            <!-- Empty State -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <h3 class="text-lg font-medium text-gray-900 mb-1">{{ __('No leads yet') }}</h3>
                <p class="text-gray-500 mb-6">{{ __('No leads yet. Add your first lead to get started.') }}</p>
                <a href="{{ route('admin.leads.create') }}"
                   class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    {{ __('Add Lead') }}
                </a>
            </div>
        @endif
    </div>

    <!-- ==================== KANBAN VIEW ==================== -->
    <div x-show="view === 'kanban'" x-cloak>
        @php
            $kanbanStatuses = [
                'new' => ['label' => __('New'), 'color' => 'border-violet-500', 'bg' => 'bg-violet-500'],
                'contacted' => ['label' => __('Contacted'), 'color' => 'border-blue-500', 'bg' => 'bg-blue-500'],
                'qualified' => ['label' => __('Qualified'), 'color' => 'border-cyan-500', 'bg' => 'bg-cyan-500'],
                'quote_sent' => ['label' => __('Quote Sent'), 'color' => 'border-amber-500', 'bg' => 'bg-amber-500'],
                'won' => ['label' => __('Won'), 'color' => 'border-emerald-500', 'bg' => 'bg-emerald-500'],
                'lost' => ['label' => __('Lost'), 'color' => 'border-red-500', 'bg' => 'bg-red-500'],
            ];
        @endphp

        <div class="flex overflow-x-auto space-x-4 pb-4">
            @foreach($kanbanStatuses as $statusKey => $statusMeta)
                @php
                    $columnLeads = $kanbanLeads->get($statusKey, collect());
                @endphp
                <div class="min-w-[280px] w-[280px] flex-shrink-0">
                    <!-- Column Header -->
                    <div class="border-t-4 {{ $statusMeta['color'] }} bg-white rounded-t-lg px-3 py-2 flex items-center justify-between">
                        <h3 class="text-sm font-semibold text-gray-700">{{ $statusMeta['label'] }}</h3>
                        <span class="kanban-count inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full {{ $statusMeta['bg'] }} text-white">
                            {{ $columnLeads->count() }}
                        </span>
                    </div>

                    <!-- Column Body (sortable container) -->
                    <div class="kanban-column bg-gray-100 rounded-b-lg p-3 space-y-3 min-h-[200px]" data-status="{{ $statusKey }}">
                        @foreach($columnLeads as $lead)
                            <div class="kanban-card bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-grab hover:shadow-md transition-shadow" data-id="{{ $lead->id }}">
                                <a href="{{ route('admin.leads.show', $lead) }}" class="block">
                                    <p class="text-sm font-semibold text-gray-900">{{ $lead->first_name }} {{ $lead->last_name }}</p>
                                    @if($lead->company_name)
                                        <p class="text-xs text-gray-500 mt-1">{{ $lead->company_name }}</p>
                                    @endif
                                    <div class="flex items-center justify-between mt-2">
                                        <div class="text-xs text-gray-400">
                                            @if($lead->estimated_budget)
                                                <span class="font-medium text-gray-600">&euro;{{ number_format($lead->estimated_budget, 0, ',', '.') }}</span>
                                            @endif
                                        </div>
                                        <span class="text-xs text-gray-400">{{ $lead->updated_at->format('d/m') }}</span>
                                    </div>
                                    @if($lead->referralPartner?->user?->name)
                                        <p class="text-xs text-teal-600 mt-1">{{ $lead->referralPartner->user->name }}</p>
                                    @endif
                                </a>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    initLeadsKanban();
});
document.addEventListener('turbo:load', function() {
    initLeadsKanban();
});

function initLeadsKanban() {
    document.querySelectorAll('.kanban-column').forEach(function(col) {
        if (col._sortable) col._sortable.destroy();
        col._sortable = new Sortable(col, {
            group: 'leads',
            animation: 150,
            ghostClass: 'opacity-50',
            dragClass: 'shadow-lg',
            onEnd: function(evt) {
                var leadId = evt.item.dataset.id;
                var newStatus = evt.to.dataset.status;

                fetch('/admin/leads/' + leadId + '/status', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                }).then(function(r) {
                    if (!r.ok) {
                        window.location.reload();
                    }
                    updateLeadColumnCounts();
                });
            }
        });
    });
}

function updateLeadColumnCounts() {
    document.querySelectorAll('.kanban-column').forEach(function(col) {
        var count = col.querySelectorAll('.kanban-card').length;
        var badge = col.parentElement.querySelector('.kanban-count');
        if (badge) badge.textContent = count;
    });
}
</script>
@endsection
