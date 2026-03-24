@extends('layouts.admin')

@section('title', __('Edit Service') . ' - ' . $service->name)

@section('content')
    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.services.show', $service) }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Service') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Edit Service') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ __('Update service details and pricing.') }}</p>
    </div>

    <!-- Form -->
    <form method="POST" action="{{ route('admin.services.update', $service) }}">
        @csrf
        @method('PUT')

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-5">
                    <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('Service Details') }}</h3>

                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Service Name') }} <span class="text-red-500">*</span></label>
                        <input type="text" name="name" id="name" value="{{ old('name', $service->name) }}"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                        @error('name') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                    </div>

                    <div>
                        <label for="type" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Type') }} <span class="text-red-500">*</span></label>
                        <select name="type" id="type"
                                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                            @foreach(['domain', 'hosting', 'ssl', 'email', 'saas', 'maintenance', 'support', 'other'] as $type)
                                <option value="{{ $type }}" {{ old('type', $service->type) === $type ? 'selected' : '' }}>
                                    {{ __(ucwords($type)) }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label for="provider" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Provider') }}</label>
                        <input type="text" name="provider" id="provider" value="{{ old('provider', $service->provider) }}"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                    </div>

                    <div>
                        <label for="client_id" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Client') }}</label>
                        <select name="client_id" id="client_id"
                                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                            <option value="">-- {{ __('None') }} --</option>
                            @foreach($clients as $client)
                                <option value="{{ $client->id }}" {{ old('client_id', $service->client_id) == $client->id ? 'selected' : '' }}>
                                    {{ $client->name }} {{ $client->company_name ? '(' . $client->company_name . ')' : '' }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label for="projet_id" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Project') }}</label>
                        <select name="projet_id" id="projet_id"
                                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                            <option value="">-- {{ __('None') }} --</option>
                            @foreach($projects as $project)
                                <option value="{{ $project->id }}" {{ old('projet_id', $service->projet_id) == $project->id ? 'selected' : '' }}>
                                    {{ $project->nom_societe }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Status') }}</label>
                        <select name="status" id="status"
                                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                            @foreach(['active', 'expiring_soon', 'expired', 'cancelled', 'suspended'] as $status)
                                <option value="{{ $status }}" {{ old('status', $service->status) === $status ? 'selected' : '' }}>
                                    {{ __(ucwords(str_replace('_', ' ', $status))) }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-5">
                    <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('Dates & Pricing') }}</h3>

                    <div>
                        <label for="purchase_date" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Purchase Date') }}</label>
                        <input type="date" name="purchase_date" id="purchase_date"
                               value="{{ old('purchase_date', $service->purchase_date?->format('Y-m-d')) }}"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                    </div>

                    <div>
                        <label for="expiry_date" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Expiry Date') }} <span class="text-red-500">*</span></label>
                        <input type="date" name="expiry_date" id="expiry_date"
                               value="{{ old('expiry_date', $service->expiry_date?->format('Y-m-d')) }}"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                        @error('expiry_date') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                    </div>

                    <div>
                        <label for="frequency" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Billing Frequency') }} <span class="text-red-500">*</span></label>
                        <select name="frequency" id="frequency"
                                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                            @foreach(['monthly' => __('Monthly'), 'quarterly' => __('Quarterly'), 'semi_annual' => __('Semi-Annual'), 'annual' => __('Annual'), 'biennial' => __('Biennial')] as $value => $label)
                                <option value="{{ $value }}" {{ old('frequency', $service->frequency) === $value ? 'selected' : '' }}>
                                    {{ $label }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <div>
                        <label for="real_cost" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Real Cost') }} (&euro;) <span class="text-red-500">*</span></label>
                        <input type="number" name="real_cost" id="real_cost" value="{{ old('real_cost', $service->real_cost) }}"
                               step="0.01" min="0"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                    </div>

                    <div>
                        <label for="billed_price" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Billed Price') }} (&euro;) <span class="text-red-500">*</span></label>
                        <input type="number" name="billed_price" id="billed_price" value="{{ old('billed_price', $service->billed_price) }}"
                               step="0.01" min="0"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                    </div>

                    <div>
                        <label for="payment_mode" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Payment Mode') }}</label>
                        <select name="payment_mode" id="payment_mode"
                                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                            <option value="manual" {{ old('payment_mode', $service->payment_mode) === 'manual' ? 'selected' : '' }}>{{ __('Manual') }}</option>
                            <option value="automatic" {{ old('payment_mode', $service->payment_mode) === 'automatic' ? 'selected' : '' }}>{{ __('Automatic') }}</option>
                            <option value="client_direct" {{ old('payment_mode', $service->payment_mode) === 'client_direct' ? 'selected' : '' }}>{{ __('Client Direct') }}</option>
                        </select>
                    </div>

                    <div class="flex items-center gap-2">
                        <input type="checkbox" name="auto_renew" id="auto_renew" value="1"
                               {{ old('auto_renew', $service->auto_renew) ? 'checked' : '' }}
                               class="rounded border-gray-300 text-teal-500 focus:ring-teal-300">
                        <label for="auto_renew" class="text-sm font-medium text-gray-700">{{ __('Auto-renew') }}</label>
                    </div>
                </div>
            </div>

            <!-- Full Width -->
            <div class="mt-6 space-y-5">
                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Description') }}</label>
                    <textarea name="description" id="description" rows="3"
                              class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">{{ old('description', $service->description) }}</textarea>
                </div>

                <div>
                    <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Notes') }}</label>
                    <textarea name="notes" id="notes" rows="2"
                              class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">{{ old('notes', $service->notes) }}</textarea>
                </div>
            </div>
        </div>

        <!-- Submit -->
        <div class="flex items-center justify-end gap-3">
            <a href="{{ route('admin.services.show', $service) }}"
               class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                {{ __('Cancel') }}
            </a>
            <button type="submit"
                    class="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 transition-colors">
                {{ __('Update Service') }}
            </button>
        </div>
    </form>
@endsection
