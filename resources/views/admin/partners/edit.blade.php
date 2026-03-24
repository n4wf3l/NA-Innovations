@extends('layouts.admin')

@section('title', __('Edit Partner'))

@section('content')
    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.partners.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Partners') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Edit Referral Partner') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ __('Update partner details and commission rate.') }}</p>
    </div>

    <!-- Form -->
    <form method="POST" action="{{ route('admin.partners.update', $partner) }}">
        @csrf
        @method('PUT')

        <x-admin.card>
            <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Left Column -->
                    <div class="space-y-5">
                        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('User Account') }}</h3>

                        <x-admin.input name="name" label="{{ __('Name') }}" :required="true" :value="$partner->user->name ?? ''" placeholder="{{ __('Full name') }}" />
                        <x-admin.input name="email" label="{{ __('Email') }}" type="email" :required="true" :value="$partner->user->email ?? ''" placeholder="email@example.com" />

                        <!-- Active Status -->
                        <div>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="hidden" name="is_active" value="0">
                                <input type="checkbox"
                                       name="is_active"
                                       value="1"
                                       {{ old('is_active', $partner->is_active) ? 'checked' : '' }}
                                       class="rounded border-gray-300 text-teal-600 shadow-sm focus:ring-teal-300">
                                <span class="text-sm font-medium text-gray-700">{{ __('Active Partner') }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-5">
                        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('Partner Details') }}</h3>

                        <div>
                            <label for="default_commission_rate" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Commission Rate') }} (%)</label>
                            <input type="number"
                                   name="default_commission_rate"
                                   id="default_commission_rate"
                                   value="{{ old('default_commission_rate', $partner->default_commission_rate) }}"
                                   step="0.01"
                                   min="0"
                                   max="100"
                                   placeholder="10.00"
                                   class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                            @error('default_commission_rate')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <x-admin.select
                            name="payment_method"
                            label="{{ __('Payment Method') }}"
                            :options="[
                                'bank_transfer' => __('Bank Transfer'),
                                'paypal' => 'PayPal',
                            ]"
                            :selected="$partner->payment_method"
                            placeholder="{{ __('-- Select Method --') }}"
                        />

                        <x-admin.input name="bank_iban" label="{{ __('Bank IBAN') }}" :value="$partner->bank_iban" placeholder="BE68 5390 0754 7034" />
                        <x-admin.input name="paypal_email" label="{{ __('PayPal Email') }}" type="email" :value="$partner->paypal_email" placeholder="paypal@example.com" />

                        <!-- Referral Code (read-only) -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">{{ __('Referral Code') }}</label>
                            <div class="flex items-center gap-2">
                                <code class="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-gray-700">{{ $partner->referral_code }}</code>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Full Width: Notes -->
                <div class="mt-6">
                    <x-admin.textarea name="notes" label="{{ __('Notes') }}" :value="$partner->notes" placeholder="{{ __('Any additional notes about this partner...') }}" />
                </div>

                <!-- Submit -->
                <div class="mt-6 flex items-center justify-end gap-3">
                    <a href="{{ route('admin.partners.index') }}"
                       class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        {{ __('Cancel') }}
                    </a>
                    <button type="submit"
                            class="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 transition-colors">
                        {{ __('Update Partner') }}
                    </button>
                </div>
            </div>
        </x-admin.card>
    </form>
@endsection
