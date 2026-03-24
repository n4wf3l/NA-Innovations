@extends('layouts.admin')

@section('title', __('News & Blog'))
@section('header', __('News & Blog'))

@section('content')
    <!-- Page Header -->
    <x-admin.page-header title="{{ __('News & Blog') }}" :actionUrl="route('admin.posts.create')" actionLabel="{{ __('Create Post') }}" description="{{ __('Manage your news articles and blog posts displayed on the public website.') }}" />

    <!-- Table -->
    @if($posts->count() > 0)
        <x-admin.card class="mt-6">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Photo') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Title') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Subject') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Date') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($posts as $post)
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3">
                                    @if($post->photo)
                                        <img src="{{ Storage::url($post->photo) }}" alt="{{ $post->title }}" class="w-12 h-12 object-cover rounded-lg">
                                    @else
                                        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 15.75V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-2.25"/>
                                            </svg>
                                        </div>
                                    @endif
                                </td>
                                <td class="px-4 py-3 font-medium text-gray-900">{{ $post->title }}</td>
                                <td class="px-4 py-3 text-gray-600">{{ $post->subject }}</td>
                                <td class="px-4 py-3 text-gray-600">{{ $post->created_at->format('M d, Y') }}</td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="{{ route('admin.posts.edit', $post) }}"
                                           class="text-gray-500 hover:text-blue-600 transition-colors"
                                           title="{{ __('Edit') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                        </a>
                                        <form method="POST" action="{{ route('admin.posts.destroy', $post) }}"
                                              onsubmit="return confirm('{{ __('Are you sure you want to delete this post?') }}')"
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
            @if($posts->hasPages())
                <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    {{ $posts->links() }}
                </div>
            @endif
        </x-admin.card>
    @else
        <!-- Empty State -->
        <x-admin.card class="mt-6">
            <x-admin.empty-state
                title="{{ __('No posts yet') }}"
                description="{{ __('No blog posts found. Create your first post to get started.') }}"
                :actionUrl="route('admin.posts.create')"
                actionLabel="{{ __('Create Post') }}"
            />
        </x-admin.card>
    @endif
@endsection
