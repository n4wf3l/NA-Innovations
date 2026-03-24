@extends('layouts.admin')

@section('title', __('Add Client'))

@section('content')
    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.clients.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Clients') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Add Client') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ __('Register a new client. They will be able to access the client portal once created.') }}</p>
    </div>

    <!-- Form -->
    <form method="POST" action="{{ route('admin.clients.store') }}">
        @csrf

        <x-admin.card>
            <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Left Column -->
                    <div class="space-y-5">
                        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('Contact Information') }}</h3>

                        <x-admin.input name="name" label="{{ __('Name') }}" :required="true" placeholder="{{ __('Full name') }}" />
                        <x-admin.input name="email" label="{{ __('Email') }}" type="email" :required="true" placeholder="email@example.com" />
                        <x-admin.input name="phone" label="{{ __('Phone') }}" placeholder="+32 123 456 789" />
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-5">
                        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('Company Information') }}</h3>

                        <x-admin.input name="company_name" label="{{ __('Company Name') }}" placeholder="{{ __('Company Ltd.') }}" />
                        <x-admin.input name="vat_number" label="{{ __('VAT Number') }}" placeholder="BE0123456789" />
                    </div>
                </div>

                <!-- Full Width: Address -->
                <div class="mt-6 space-y-5">
                    <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('Address') }}</h3>

                    <x-admin.input name="address" label="{{ __('Address') }}" placeholder="{{ __('Street and number') }}" />

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <x-admin.input name="city" label="{{ __('City') }}" placeholder="{{ __('Brussels') }}" />
                        <x-admin.input name="postal_code" label="{{ __('Postal Code') }}" placeholder="1000" />
                        <x-admin.input name="country" label="{{ __('Country') }}" placeholder="{{ __('Belgium') }}" />
                    </div>
                </div>

                <!-- Submit -->
                <div class="mt-6 flex items-center justify-end gap-3">
                    <a href="{{ route('admin.clients.index') }}"
                       class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        {{ __('Cancel') }}
                    </a>
                    <button type="submit"
                            class="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 transition-colors">
                        {{ __('Create Client') }}
                    </button>
                </div>
            </div>
        </x-admin.card>
    </form>
@endsection
