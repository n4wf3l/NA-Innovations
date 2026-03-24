@extends('layouts.admin')

@section('title', __('Projects'))

@section('content')
@php
    $totalProjects = \App\Models\Projet::count();
    $inProgress = \App\Models\Projet::where('status', 'in_progress')->count();
    $completed = \App\Models\Projet::where('status', 'completed')->count();
    $totalBudget = \App\Models\Projet::sum('budget');
@endphp

<div x-data="{ view: '{{ request('view', 'table') }}' }">
    {{-- Module Banner --}}
    <div class="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div class="relative z-10">
            <p class="text-indigo-200 text-sm mb-1">{{ __('Business') }} / {{ __('Projects') }}</p>
            <h2 class="font-display text-2xl text-white tracking-wide">{{ __('Projects') }}</h2>
            <p class="text-indigo-200 text-sm mt-1">{{ __('Track all your projects. Drag and drop in Kanban view to update statuses.') }}</p>
        </div>
        {{-- Background icon --}}
        <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/>
        </svg>
        {{-- Action button --}}
        <div class="absolute right-6 bottom-6">
            <a href="{{ route('admin.projects.create') }}" class="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium rounded-lg transition">
                + {{ __('Add Project') }}
            </a>
        </div>
    </div>

    {{-- KPI Cards --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-indigo-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Total Projects') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $totalProjects }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-indigo-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('In Progress') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $inProgress }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-indigo-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Completed') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ $completed }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-xl p-4 border border-gray-200 border-l-4 border-l-indigo-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{{ __('Total Budget') }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">&euro;{{ number_format($totalBudget, 0, ',', '.') }}</p>
                </div>
                <div class="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
        </div>
    </div>

    <!-- View Toggle -->
    <div class="flex items-center space-x-2 mb-6">
        <button @click="view = 'table'" :class="view === 'table' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'" class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
            {{ __('Table') }}
        </button>
        <button @click="view = 'kanban'" :class="view === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300'" class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors">
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
                        class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:ring-indigo-400">
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
                        class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:ring-indigo-400">
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
                           class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:ring-indigo-400">
                </div>

                <!-- Submit -->
                <button type="submit"
                        class="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition-colors">
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
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                                <tr class="hover:bg-indigo-50/40 transition-colors border-l-4 border-l-transparent hover:border-l-indigo-400">
                                    <td class="px-4 py-3 font-medium text-gray-900">
                                        {{ $project->nom_societe }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-600">
                                        @if($project->client)
                                            <a href="{{ route('admin.clients.show', $project->client) }}" class="text-indigo-600 hover:text-indigo-700">
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
                                               class="text-gray-500 hover:text-indigo-600 transition-colors"
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
            </div>
        @else
            <!-- Empty State -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-indigo-400 p-12 text-center">
                <svg class="w-12 h-12 text-indigo-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                <h3 class="text-lg font-medium text-gray-900 mb-1">{{ __('No projects yet') }}</h3>
                <p class="text-gray-500 mb-6">{{ __('No projects found. Add your first project to get started.') }}</p>
                <a href="{{ route('admin.projects.create') }}"
                   class="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    {{ __('Add Project') }}
                </a>
            </div>
        @endif
    </div>

    <!-- ==================== KANBAN VIEW ==================== -->
    <div x-show="view === 'kanban'" x-cloak>
        <!-- Developer Filter -->
        <div class="mb-4">
            <select @change="window.location.href = '?developer_id=' + $event.target.value + '&view=kanban'"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:ring-indigo-400">
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
                                        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 {{ $project->developer ? 'bg-indigo-300 text-gray-900' : 'bg-gray-300 text-gray-600' }}" title="{{ $project->developer ? $project->developer->name : __('Unassigned') }}">
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
                                        <p class="text-xs text-indigo-600 mt-1">{{ $project->type_site }}</p>
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
