@extends('layouts.admin')

@section('title', __('Projects'))

@section('content')
<div x-data="{ view: '{{ request('view', 'table') }}' }">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Projects') }}</h1>
        <a href="{{ route('admin.projects.create') }}"
           class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            {{ __('Add Project') }}
        </a>
    </div>
    <p class="text-sm text-gray-500 -mt-4 mb-6">{{ __('Track all your projects. Drag and drop in Kanban view to update statuses.') }}</p>

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
        <form method="GET" action="{{ route('admin.projects.index') }}" class="mb-6">
            <div class="flex flex-col sm:flex-row gap-3">
                <!-- Status Filter -->
                <select name="status"
                        onchange="this.form.submit()"
                        class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                    <option value="">{{ __('All Statuses') }}</option>
                    @foreach(['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'] as $status)
                        <option value="{{ $status }}" {{ request('status') === $status ? 'selected' : '' }}>
                            {{ ucwords(str_replace('_', ' ', $status)) }}
                        </option>
                    @endforeach
                </select>

                <!-- Client Filter -->
                <select name="client_id"
                        onchange="this.form.submit()"
                        class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                    <option value="">{{ __('All Clients') }}</option>
                    @foreach($clients as $client)
                        <option value="{{ $client->id }}" {{ request('client_id') == $client->id ? 'selected' : '' }}>
                            {{ $client->name }}
                        </option>
                    @endforeach
                </select>

                <!-- Search Input -->
                <div class="flex-1">
                    <input type="text"
                           name="search"
                           value="{{ request('search') }}"
                           placeholder="{{ __('Search by project name...') }}"
                           class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                </div>

                <!-- Submit -->
                <button type="submit"
                        class="inline-flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    {{ __('Search') }}
                </button>

                @if(request()->hasAny(['status', 'client_id', 'search']))
                    <a href="{{ route('admin.projects.index') }}"
                       class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        {{ __('Clear') }}
                    </a>
                @endif
            </div>
        </form>

        <!-- Table -->
        @if($projects->count() > 0)
            <x-admin.card>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Name') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Client') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Type') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Budget') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Start Date') }}</th>
                                <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Actions') }}</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            @foreach($projects as $project)
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-4 py-3 font-medium text-gray-900">
                                        {{ $project->nom_societe }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        @if($project->client)
                                            <a href="{{ route('admin.clients.show', $project->client) }}" class="text-teal-600 hover:text-teal-700">
                                                {{ $project->client->name }}
                                            </a>
                                        @else
                                            <span class="text-gray-400">-</span>
                                        @endif
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        {{ $project->type_site ?? '-' }}
                                    </td>
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
                                    <td class="px-4 py-3">
                                        <div class="flex items-center justify-end gap-2">
                                            <a href="{{ route('admin.projects.show', $project) }}"
                                               class="text-gray-500 hover:text-teal-600 transition-colors"
                                               title="{{ __('View') }}">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                            </a>
                                            <a href="{{ route('admin.projects.edit', $project) }}"
                                               class="text-gray-500 hover:text-blue-600 transition-colors"
                                               title="{{ __('Edit') }}">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                            </a>
                                            <form method="POST" action="{{ route('admin.projects.destroy', $project) }}"
                                                  onsubmit="return confirm('{{ __('Are you sure you want to delete this project?') }}')"
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
                @if($projects->hasPages())
                    <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                        {{ $projects->links() }}
                    </div>
                @endif
            </x-admin.card>
        @else
            <!-- Empty State -->
            <x-admin.card>
                <x-admin.empty-state
                    title="{{ __('No projects yet') }}"
                    description="{{ __('No projects found. Add your first project to get started.') }}"
                    :actionUrl="route('admin.projects.create')"
                    actionLabel="{{ __('Add Project') }}"
                />
            </x-admin.card>
        @endif
    </div>

    <!-- ==================== KANBAN VIEW ==================== -->
    <div x-show="view === 'kanban'" x-cloak>
        <!-- Developer Filter -->
        <div class="mb-4">
            <select @change="window.location.href = '?developer_id=' + $event.target.value + '&view=kanban'"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                <option value="">{{ __('All Developers') }}</option>
                @foreach($developers as $dev)
                    <option value="{{ $dev->id }}" {{ request('developer_id') == $dev->id ? 'selected' : '' }}>{{ $dev->name }}</option>
                @endforeach
            </select>
        </div>

        @php
            $kanbanStatuses = [
                'planning' => ['label' => __('Planning'), 'color' => 'border-violet-500', 'bg' => 'bg-violet-500'],
                'in_progress' => ['label' => __('In Progress'), 'color' => 'border-blue-500', 'bg' => 'bg-blue-500'],
                'review' => ['label' => __('Review'), 'color' => 'border-amber-500', 'bg' => 'bg-amber-500'],
                'completed' => ['label' => __('Completed'), 'color' => 'border-emerald-500', 'bg' => 'bg-emerald-500'],
                'on_hold' => ['label' => __('On Hold'), 'color' => 'border-gray-500', 'bg' => 'bg-gray-500'],
                'cancelled' => ['label' => __('Cancelled'), 'color' => 'border-red-500', 'bg' => 'bg-red-500'],
            ];
        @endphp

        <div class="flex overflow-x-auto space-x-4 pb-4">
            @foreach($kanbanStatuses as $statusKey => $statusMeta)
                @php
                    $columnProjects = $kanbanProjects->get($statusKey, collect());
                @endphp
                <div class="min-w-[280px] w-[280px] flex-shrink-0">
                    <!-- Column Header -->
                    <div class="border-t-4 {{ $statusMeta['color'] }} bg-white rounded-t-lg px-3 py-2 flex items-center justify-between">
                        <h3 class="text-sm font-semibold text-gray-700">{{ $statusMeta['label'] }}</h3>
                        <span class="project-kanban-count inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full {{ $statusMeta['bg'] }} text-white">
                            {{ $columnProjects->count() }}
                        </span>
                    </div>

                    <!-- Column Body (sortable container) -->
                    <div class="project-kanban-column bg-gray-100 rounded-b-lg p-3 space-y-3 min-h-[200px]" data-status="{{ $statusKey }}">
                        @foreach($columnProjects as $project)
                            <div class="project-kanban-card bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-grab hover:shadow-md transition-shadow" data-id="{{ $project->id }}">
                                <a href="{{ route('admin.projects.show', $project) }}" class="block">
                                    <div class="flex items-start justify-between">
                                        <p class="text-sm font-semibold text-gray-900">{{ $project->nom_societe }}</p>
                                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 {{ $project->developer ? 'bg-teal-300 text-gray-900' : 'bg-gray-300 text-gray-600' }}" title="{{ $project->developer ? $project->developer->name : __('Unassigned') }}">
                                            {{ $project->developer ? strtoupper(substr($project->developer->name, 0, 1)) : '?' }}
                                        </span>
                                    </div>
                                    @if($project->client)
                                        <p class="text-xs text-gray-500 mt-1">{{ $project->client->name }}</p>
                                    @endif
                                    @if($project->lead && $project->lead->referralPartner && $project->lead->referralPartner->user)
                                        <p class="text-xs text-violet-500 mt-0.5">{{ __('Partner') }}: {{ $project->lead->referralPartner->user->name }}</p>
                                    @endif
                                    <div class="flex items-center justify-between mt-2">
                                        <div class="text-xs text-gray-400">
                                            @if($project->budget)
                                                <span class="font-medium text-gray-600">&euro;{{ number_format($project->budget, 0, ',', '.') }}</span>
                                            @endif
                                        </div>
                                        <span class="text-xs text-gray-400">{{ $project->updated_at->format('d/m') }}</span>
                                    </div>
                                    @if($project->type_site)
                                        <p class="text-xs text-teal-600 mt-1">{{ $project->type_site }}</p>
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
    initProjectsKanban();
});
document.addEventListener('turbo:load', function() {
    initProjectsKanban();
});

function initProjectsKanban() {
    document.querySelectorAll('.project-kanban-column').forEach(function(col) {
        if (col._sortable) col._sortable.destroy();
        col._sortable = new Sortable(col, {
            group: 'projects',
            animation: 150,
            ghostClass: 'opacity-50',
            dragClass: 'shadow-lg',
            onEnd: function(evt) {
                var projectId = evt.item.dataset.id;
                var newStatus = evt.to.dataset.status;

                fetch('/admin/projects/' + projectId + '/status', {
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
                    updateProjectColumnCounts();
                });
            }
        });
    });
}

function updateProjectColumnCounts() {
    document.querySelectorAll('.project-kanban-column').forEach(function(col) {
        var count = col.querySelectorAll('.project-kanban-card').length;
        var badge = col.parentElement.querySelector('.project-kanban-count');
        if (badge) badge.textContent = count;
    });
}
</script>
@endsection
