@extends('layouts.admin')

@section('title', __('Create Post'))
@section('header', __('Create Post'))

@section('content')
    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.posts.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Posts') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Create Post') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ __('Write a new article. Add a photo to make it stand out in the news feed.') }}</p>
    </div>

    <!-- Form -->
    <form method="POST" action="{{ route('admin.posts.store') }}" enctype="multipart/form-data">
        @csrf

        <x-admin.card>
            <div class="p-6 space-y-5">
                <x-admin.input name="title" label="{{ __('Title') }}" :required="true" placeholder="{{ __('Post title') }}" />

                <x-admin.input name="subject" label="{{ __('Subject') }}" :required="true" placeholder="{{ __('Post subject') }}" />

                <x-admin.textarea name="description" label="{{ __('Description') }}" :required="true" :rows="6" placeholder="{{ __('Write your post content here...') }}" />

                <!-- Photo Upload -->
                <div x-data="{ preview: null }">
                    <label for="photo" class="block text-sm font-medium text-gray-700">{{ __('Photo') }}</label>
                    <div class="mt-1">
                        <input type="file"
                               name="photo"
                               id="photo"
                               accept="image/*"
                               @change="const file = $event.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (e) => preview = e.target.result; reader.readAsDataURL(file); } else { preview = null; }"
                               class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100">
                    </div>
                    @error('photo')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror

                    <!-- Preview -->
                    <template x-if="preview">
                        <div class="mt-3">
                            <img :src="preview" alt="Preview" class="w-32 h-32 object-cover rounded-lg border border-gray-200">
                        </div>
                    </template>
                </div>

                <!-- Submit -->
                <div class="flex items-center justify-end gap-3 pt-4">
                    <a href="{{ route('admin.posts.index') }}"
                       class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        {{ __('Cancel') }}
                    </a>
                    <button type="submit"
                            class="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 transition-colors">
                        {{ __('Create Post') }}
                    </button>
                </div>
            </div>
        </x-admin.card>
    </form>
@endsection
