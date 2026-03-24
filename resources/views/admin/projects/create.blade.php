@extends('layouts.admin')

@section('title', __('Add Project'))

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
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Add Project') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ __('Start a new project. Only the project name and status are required — other details can be added later as the project progresses.') }}</p>
    </div>

    <!-- Form -->
    <form method="POST" action="{{ route('admin.projects.store') }}">
        @csrf

        <x-admin.card>
            <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Left Column -->
                    <div class="space-y-5">
                        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('Project Information') }}</h3>

                        <x-admin.input name="nom_societe" label="{{ __('Project Name') }}" :required="true" placeholder="{{ __('Company or project name') }}" />
                        <x-admin.input name="type_societe" label="{{ __('Company Type') }}" placeholder="{{ __('e.g. SRL, SA, ASBL...') }}" />
                        <x-admin.input name="type_site" label="{{ __('Site Type') }}" placeholder="{{ __('e.g. E-commerce, Vitrine, SaaS...') }}" />
                        <x-admin.input name="lieu" label="{{ __('Location') }}" placeholder="{{ __('e.g. Brussels, Belgium') }}" />

                        <x-admin.select
                            name="client_id"
                            label="{{ __('Client') }}"
                            :options="$clients->pluck('name', 'id')->toArray()"
                            placeholder="{{ __('-- Select Client --') }}"
                        />

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Assigned Developer') }}</label>
                            <select name="developer_id" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-300 focus:ring-teal-300 sm:text-sm">
                                <option value="">{{ __('Unassigned') }}</option>
                                @foreach($developers as $dev)
                                    <option value="{{ $dev->id }}" {{ old('developer_id') == $dev->id ? 'selected' : '' }}>
                                        {{ $dev->name }} ({{ ucfirst($dev->role) }})
                                    </option>
                                @endforeach
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Referral Lead') }}</label>
                            <select name="lead_id" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-300 focus:ring-teal-300 sm:text-sm">
                                <option value="">{{ __('No referral') }}</option>
                                @foreach($leads as $lead)
                                    <option value="{{ $lead->id }}" {{ old('lead_id') == $lead->id ? 'selected' : '' }}>
                                        {{ $lead->first_name }} {{ $lead->last_name }}
                                        @if($lead->referralPartner && $lead->referralPartner->user)
                                            ({{ __('Partner') }}: {{ $lead->referralPartner->user->name }})
                                        @endif
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-5">
                        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('Project Details') }}</h3>

                        <x-admin.select
                            name="status"
                            label="{{ __('Status') }}"
                            :required="true"
                            :options="[
                                'planning' => __('Planning'),
                                'in_progress' => __('In Progress'),
                                'review' => __('Review'),
                                'completed' => __('Completed'),
                                'on_hold' => __('On Hold'),
                                'cancelled' => __('Cancelled'),
                            ]"
                            selected="planning"
                            placeholder="{{ __('-- Select Status --') }}"
                        />

                        <x-admin.textarea name="description" label="{{ __('Description') }}" placeholder="{{ __('Describe the project scope and goals...') }}" />

                        <x-admin.input name="start_date" label="{{ __('Start Date') }}" type="date" />
                        <x-admin.input name="end_date" label="{{ __('End Date') }}" type="date" />
                        <x-admin.input name="deadline" label="{{ __('Deadline') }}" type="date" />

                        <div>
                            <label for="budget" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Budget') }} (&euro;)</label>
                            <input type="number"
                                   name="budget"
                                   id="budget"
                                   value="{{ old('budget') }}"
                                   step="0.01"
                                   min="0"
                                   placeholder="0.00"
                                   class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                            @error('budget')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="mt-6 flex items-center justify-end gap-3">
                    <a href="{{ route('admin.projects.index') }}"
                       class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        {{ __('Cancel') }}
                    </a>
                    <button type="submit"
                            class="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 transition-colors">
                        {{ __('Create Project') }}
                    </button>
                </div>
            </div>
        </x-admin.card>
    </form>
@endsection
