@extends('layouts.admin')

@section('title', __('Ticker Messages'))
@section('header', __('Ticker Messages'))

@section('content')
    {{-- Module Banner --}}
    <div class="bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl p-6 mb-6 relative overflow-hidden">
        <div class="relative z-10">
            <p class="text-teal-200 text-sm mb-1">{{ __('Content') }} / {{ __('Messages') }}</p>
            <h2 class="font-display text-2xl text-white tracking-wide">{{ __('Ticker Messages') }}</h2>
            <p class="text-teal-200 text-sm mt-1">{{ __('Manage the scrolling ticker messages displayed on your homepage.') }}</p>
        </div>
        {{-- Background icon --}}
        <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
        </svg>
    </div>

    <!-- Existing Messages -->
    @if($messages->count() > 0)
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div class="divide-y divide-gray-100">
                @foreach($messages as $message)
                    <div class="p-4 flex items-start justify-between gap-4 hover:bg-teal-50/30 transition-colors">
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
                                          class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-400 focus:ring-teal-400 sm:text-sm"
                                >{{ $message->content }}</textarea>
                            </div>

                            <!-- Update Button -->
                            <button type="submit"
                                    class="flex-shrink-0 px-3 py-2 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
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
        </div>
    @else
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 border-t-teal-400 p-12 text-center mb-6">
            <svg class="w-12 h-12 text-teal-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>
            <h3 class="text-lg font-medium text-gray-900 mb-1">{{ __('No messages yet') }}</h3>
            <p class="text-gray-500">{{ __('No ticker messages found. Add your first message below.') }}</p>
        </div>
    @endif

    <!-- Add New Message -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-400 focus:ring-teal-400 sm:text-sm"
                        >{{ old('content') }}</textarea>
                        @error('content')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="flex justify-end">
                        <button type="submit"
                                class="px-6 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                            {{ __('Add Message') }}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection
