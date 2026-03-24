@props(['title', 'actionUrl' => null, 'actionLabel' => null, 'description' => null])

<div class="flex justify-between items-center">
    <h1 class="text-2xl font-bold text-gray-900">{{ $title }}</h1>

    @if($actionUrl && $actionLabel)
        <a href="{{ $actionUrl }}" class="inline-flex items-center bg-teal-300 text-gray-900 rounded-lg px-4 py-2 hover:bg-teal-400 font-medium text-sm">
            {{ $actionLabel }}
        </a>
    @endif
</div>
@if($description)
    <p class="mt-1 text-sm text-gray-500">{{ $description }}</p>
@endif
