@extends('layouts.admin')

@section('title', __('Add Lead'))

@section('content')
    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.leads.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Leads') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Add Lead') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ __('Add a new prospect to your pipeline. Fill in their contact details and assign a status.') }}</p>
    </div>

    <!-- Form -->
    <form method="POST" action="{{ route('admin.leads.store') }}">
        @csrf

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-5">
                    <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('Contact Information') }}</h3>

                    <!-- First Name -->
                    <div>
                        <label for="first_name" class="block text-sm font-medium text-gray-700 mb-1">{{ __('First Name') }} <span class="text-red-500">*</span></label>
                        <input type="text"
                               name="first_name"
                               id="first_name"
                               value="{{ old('first_name') }}"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300"
                               required>
                        @error('first_name')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Last Name -->
                    <div>
                        <label for="last_name" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Last Name') }} <span class="text-red-500">*</span></label>
                        <input type="text"
                               name="last_name"
                               id="last_name"
                               value="{{ old('last_name') }}"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300"
                               required>
                        @error('last_name')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Email') }} <span class="text-red-500">*</span></label>
                        <input type="email"
                               name="email"
                               id="email"
                               value="{{ old('email') }}"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300"
                               required>
                        @error('email')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Phone -->
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Phone') }}</label>
                        <input type="text"
                               name="phone"
                               id="phone"
                               value="{{ old('phone') }}"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                        @error('phone')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Company Name -->
                    <div>
                        <label for="company_name" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Company Name') }}</label>
                        <input type="text"
                               name="company_name"
                               id="company_name"
                               value="{{ old('company_name') }}"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                        @error('company_name')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-5">
                    <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('Lead Details') }}</h3>

                    <!-- Status -->
                    <div>
                        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Status') }} <span class="text-red-500">*</span></label>
                        <select name="status"
                                id="status"
                                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300"
                                required>
                            @foreach(['new', 'contacted', 'brief_pending', 'brief_completed', 'call_scheduled', 'qualified', 'not_qualified', 'quote_draft', 'quote_sent', 'won', 'lost'] as $status)
                                <option value="{{ $status }}" {{ old('status', 'new') === $status ? 'selected' : '' }}>
                                    {{ ucwords(str_replace('_', ' ', $status)) }}
                                </option>
                            @endforeach
                        </select>
                        @error('status')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Source -->
                    <div>
                        <label for="source" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Source') }} <span class="text-red-500">*</span></label>
                        <select name="source"
                                id="source"
                                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300"
                                required>
                            @foreach(['referral', 'organic', 'website_contact', 'social_media', 'word_of_mouth', 'advertising', 'other'] as $source)
                                <option value="{{ $source }}" {{ old('source', 'organic') === $source ? 'selected' : '' }}>
                                    {{ ucwords(str_replace('_', ' ', $source)) }}
                                </option>
                            @endforeach
                        </select>
                        @error('source')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Referral Partner -->
                    <div>
                        <label for="referral_partner_id" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Referral Partner') }}</label>
                        <select name="referral_partner_id"
                                id="referral_partner_id"
                                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                            <option value="">-- {{ __('None') }} --</option>
                            @foreach($partners as $partner)
                                <option value="{{ $partner->id }}" {{ old('referral_partner_id') == $partner->id ? 'selected' : '' }}>
                                    {{ $partner->user->name ?? 'Partner #' . $partner->id }} ({{ $partner->referral_code }})
                                </option>
                            @endforeach
                        </select>
                        @error('referral_partner_id')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Service Interest -->
                    <div>
                        <label for="service_interest" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Service Interest') }}</label>
                        <input type="text"
                               name="service_interest"
                               id="service_interest"
                               value="{{ old('service_interest') }}"
                               placeholder="{{ __('e.g. Web Development, SEO, Branding...') }}"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                        @error('service_interest')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    <!-- Estimated Budget -->
                    <div>
                        <label for="estimated_budget" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Estimated Budget') }} (&euro;)</label>
                        <input type="number"
                               name="estimated_budget"
                               id="estimated_budget"
                               value="{{ old('estimated_budget') }}"
                               step="0.01"
                               min="0"
                               placeholder="0.00"
                               class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                        @error('estimated_budget')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                </div>
            </div>

            <!-- Full Width: Notes -->
            <div class="mt-6">
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Notes') }}</label>
                <textarea name="notes"
                          id="notes"
                          rows="4"
                          class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300"
                          placeholder="{{ __('Any additional notes about this lead...') }}">{{ old('notes') }}</textarea>
                @error('notes')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Submit -->
            <div class="mt-6 flex items-center justify-end gap-3">
                <a href="{{ route('admin.leads.index') }}"
                   class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    {{ __('Cancel') }}
                </a>
                <button type="submit"
                        class="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 transition-colors">
                    {{ __('Create Lead') }}
                </button>
            </div>
        </div>
    </form>
@endsection
