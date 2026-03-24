@extends('layouts.admin')

@section('title', __('Ticker Messages'))
@section('header', __('Ticker Messages'))

@section('content')
    <!-- Page Header -->
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Ticker Messages') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ __('Manage the scrolling ticker messages displayed on your homepage.') }}</p>
    </div>

    <!-- Existing Messages -->
    @if($messages->count() > 0)
        <x-admin.card class="mb-6">
            <div class="divide-y divide-gray-100">
                @foreach($messages as $message)
                    <div class="p-4 flex items-start justify-between gap-4">
                        <form method="POST" action="{{ route('admin.messages.update', $message) }}" class="flex-1 flex items-start gap-4">
                            @csrf
                            @method('PUT')

                            <!-- Enabled Toggle -->
                            <label class="flex items-center mt-2 cursor-pointer flex-shrink-0">
                                <input type="hidden" name="enabled" value="0">
                                <input type="checkbox"
                                       name="enabled"
                                       value="1"
                                       {{ $message->enabled ? 'checked' : '' }}
                                       class="rounded border-gray-300 text-teal-600 shadow-sm focus:ring-teal-300">
                            </label>

                            <!-- Content -->
                            <div class="flex-1">
                                <textarea name="content"
                                          rows="2"
                                          class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-300 focus:ring-teal-300 sm:text-sm"
                                >{{ $message->content }}</textarea>
                            </div>

                            <!-- Update Button -->
                            <button type="submit"
                                    class="flex-shrink-0 px-3 py-2 text-xs font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 transition-colors">
                                {{ __('Update') }}
                            </button>
                        </form>

                        <!-- Delete Button -->
                        <form method="POST" action="{{ route('admin.messages.destroy', $message) }}"
                              onsubmit="return confirm('{{ __('Are you sure you want to delete this message?') }}')"
                              class="flex-shrink-0">
                            @csrf
                            @method('DELETE')
                            <button type="submit"
                                    class="text-gray-400 hover:text-red-600 transition-colors mt-2"
                                    title="{{ __('Delete') }}">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </form>
                    </div>
                @endforeach
            </div>
        </x-admin.card>
    @else
        <x-admin.card class="mb-6">
            <x-admin.empty-state
                title="{{ __('No messages yet') }}"
                description="{{ __('No ticker messages found. Add your first message below.') }}"
            />
        </x-admin.card>
    @endif

    <!-- Add New Message -->
    <x-admin.card>
        <div class="p-6">
            <h2 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{{ __('Add New Message') }}</h2>

            <form method="POST" action="{{ route('admin.messages.store') }}">
                @csrf

                <div class="space-y-4">
                    <div>
                        <label for="content" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Message Content') }}</label>
                        <textarea name="content"
                                  id="content"
                                  rows="3"
                                  required
                                  placeholder="{{ __('Enter your ticker message...') }}"
                                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-300 focus:ring-teal-300 sm:text-sm"
                        >{{ old('content') }}</textarea>
                        @error('content')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="flex justify-end">
                        <button type="submit"
                                class="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 transition-colors">
                            {{ __('Add Message') }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </x-admin.card>
@endsection
