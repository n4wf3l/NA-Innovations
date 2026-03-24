@props(['name', 'label', 'type' => 'text', 'value' => '', 'required' => false, 'placeholder' => ''])

<div>
    <label for="{{ $name }}" class="block text-sm font-medium text-gray-700">
        {{ $label }}
        @if($required)
            <span class="text-red-500">*</span>
        @endif
    </label>

    <input
        type="{{ $type }}"
        name="{{ $name }}"
        id="{{ $name }}"
        value="{{ old($name, $value) }}"
        placeholder="{{ $placeholder }}"
        {{ $required ? 'required' : '' }}
        {{ $attributes->merge(['class' => 'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-300 focus:ring-teal-300 sm:text-sm']) }}
    />

    @error($name)
        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
    @enderror
</div>
