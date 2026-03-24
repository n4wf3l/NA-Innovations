@props(['color', 'label'])

@php
    $classes = match($color) {
        'violet' => 'bg-violet-100 text-violet-700',
        'blue' => 'bg-blue-100 text-blue-700',
        'indigo' => 'bg-indigo-100 text-indigo-700',
        'cyan' => 'bg-cyan-100 text-cyan-700',
        'amber' => 'bg-amber-100 text-amber-700',
        'emerald' => 'bg-emerald-100 text-emerald-700',
        'red' => 'bg-red-100 text-red-700',
        'gray' => 'bg-gray-100 text-gray-700',
        'teal' => 'bg-teal-100 text-teal-700',
        default => 'bg-gray-100 text-gray-700',
    };
@endphp

<span {{ $attributes->merge(['class' => "rounded-full px-2.5 py-0.5 text-xs font-medium {$classes}"]) }}>
    {{ $label }}
</span>
