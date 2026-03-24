@extends('layouts.admin')

@section('title', __('Clients'))

@section('content')
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Clients') }}</h1>
        <a href="{{ route('admin.clients.create') }}"
           class="inline-flex items-center gap-2 bg-teal-300 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold hover:bg-teal-400 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            {{ __('Add Client') }}
        </a>
    </div>
    <p class="text-sm text-gray-500 -mt-4 mb-6">{{ __('Your client database. View all clients, their projects and invoices.') }}</p>

    <!-- Filters -->
    <form method="GET" action="{{ route('admin.clients.index') }}" class="mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search Input -->
            <div class="flex-1">
                <input type="text"
                       name="search"
                       value="{{ request('search') }}"
                       placeholder="{{ __('Search by name, email or company...') }}"
                       class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
            </div>

            <!-- Submit -->
            <button type="submit"
                    class="inline-flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {{ __('Search') }}
            </button>

            @if(request()->hasAny(['search']))
                <a href="{{ route('admin.clients.index') }}"
                   class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    {{ __('Clear') }}
                </a>
            @endif
        </div>
    </form>

    <!-- Table -->
    @if($clients->count() > 0)
        <x-admin.card>
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Name') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Email') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Company') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Phone') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Projects') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Invoices') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($clients as $client)
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 font-medium text-gray-900">
                                    {{ $client->name }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    {{ $client->email }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    {{ $client->company_name ?? '-' }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    {{ $client->phone ?? '-' }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-medium">
                                        {{ $client->projects_count }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                        {{ $client->invoices_count }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="{{ route('admin.clients.show', $client) }}"
                                           class="text-gray-500 hover:text-teal-600 transition-colors"
                                           title="{{ __('View') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </a>
                                        <a href="{{ route('admin.clients.edit', $client) }}"
                                           class="text-gray-500 hover:text-blue-600 transition-colors"
                                           title="{{ __('Edit') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                        </a>
                                        <form method="POST" action="{{ route('admin.clients.destroy', $client) }}"
                                              onsubmit="return confirm('{{ __('Are you sure you want to delete this client?') }}')"
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
            @if($clients->hasPages())
                <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    {{ $clients->links() }}
                </div>
            @endif
        </x-admin.card>
    @else
        <!-- Empty State -->
        <x-admin.card>
            <x-admin.empty-state
                title="{{ __('No clients yet') }}"
                description="{{ __('No clients found. Add your first client to get started.') }}"
                :actionUrl="route('admin.clients.create')"
                actionLabel="{{ __('Add Client') }}"
            />
        </x-admin.card>
    @endif
@endsection
