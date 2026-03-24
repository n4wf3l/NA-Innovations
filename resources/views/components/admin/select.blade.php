@props(['name', 'label', 'options' => [], 'selected' => '', 'required' => false, 'placeholder' => 'Select...'])

<div>
    <label for="{{ $name }}" class="block text-sm font-medium text-gray-700">
        {{ $label }}
        @if($required)
            <span class="text-red-500">*</span>
        @endif
    </label>

    <select
        name="{{ $name }}"
        id="{{ $name }}"
        {{ $required ? 'required' : '' }}
        {{ $attributes->merge(['class' => 'mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-300 focus:ring-teal-300 sm:text-sm']) }}
    >
        <option value="">{{ $placeholder }}</option>
        @foreach($options as $key => $label)
            <option value="{{ $key }}" {{ old($name, $selected) == $key ? 'selected' : '' }}>
                {{ $label }}
            </option>
        @endforeach
    </select>

    @error($name)
        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
    @enderror
</div>
