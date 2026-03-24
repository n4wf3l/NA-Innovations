@extends('layouts.admin')

@section('title', __('Commission Details'))

@section('content')
    @php
        $color = \App\Helpers\StatusHelper::commissionStatusColor($commission->status);
    @endphp

    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.commissions.index') }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Commissions') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900">{{ __('Commission Details') }}</h1>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-{{ $color }}-100 text-{{ $color }}-700">
                {{ __(\App\Helpers\StatusHelper::formatStatus($commission->status)) }}
            </span>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            @if($commission->status === 'estimated')
                <form method="POST" action="{{ route('admin.commissions.confirm', $commission) }}" class="inline">
                    @csrf
                    @method('PATCH')
                    <button type="submit" class="inline-flex items-center gap-2 bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-600 transition-colors">
                        {{ __('Confirm') }}
                    </button>
                </form>
            @endif

            @if($commission->status === 'confirmed')
                <form method="POST" action="{{ route('admin.commissions.schedule', $commission) }}" class="inline"
                      x-data="{ date: '' }">
                    @csrf
                    @method('PATCH')
                    <div class="inline-flex items-center gap-2">
                        <input type="date" name="scheduled_payment_date" x-model="date"
                               class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                        <button type="submit" :disabled="!date"
                                class="inline-flex items-center gap-2 bg-amber-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50">
                            {{ __('Schedule') }}
                        </button>
                    </div>
                </form>
            @endif

            @if(in_array($commission->status, ['confirmed', 'scheduled']))
                <form method="POST" action="{{ route('admin.commissions.pay', $commission) }}" class="inline">
                    @csrf
                    @method('PATCH')
                    <input type="hidden" name="paid_date" value="{{ now()->format('Y-m-d') }}">
                    <button type="submit" class="inline-flex items-center gap-2 bg-emerald-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-emerald-600 transition-colors">
                        {{ __('Mark as Paid') }}
                    </button>
                </form>
            @endif

            @if(!in_array($commission->status, ['paid', 'cancelled']))
                <form method="POST" action="{{ route('admin.commissions.destroy', $commission) }}"
                      onsubmit="return confirm('{{ __('Cancel this commission?') }}')" class="inline">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="inline-flex items-center gap-2 bg-red-100 text-red-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-red-200 transition-colors">
                        {{ __('Cancel') }}
                    </button>
                </form>
            @endif
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Commission Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Commission Information') }}</h2>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Base Amount') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">&euro;{{ number_format($commission->base_amount, 2, ',', '.') }}</dd>
                </div>
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Commission Rate') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ $commission->commission_rate }}%</dd>
                </div>
                <div class="sm:col-span-2">
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Commission Amount') }}</dt>
                    <dd class="mt-1 text-2xl font-bold text-gray-900">&euro;{{ number_format($commission->commission_amount, 2, ',', '.') }}</dd>
                </div>
                @if($commission->scheduled_payment_date)
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Scheduled Payment') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $commission->scheduled_payment_date->format('d/m/Y') }}</dd>
                    </div>
                @endif
                @if($commission->paid_date)
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Paid Date') }}</dt>
                        <dd class="mt-1 text-sm text-emerald-600 font-medium">{{ $commission->paid_date->format('d/m/Y') }}</dd>
                    </div>
                @endif
                @if($commission->payment_reference)
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Payment Reference') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $commission->payment_reference }}</dd>
                    </div>
                @endif
                <div>
                    <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Created') }}</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ $commission->created_at->format('d/m/Y H:i') }}</dd>
                </div>
            </dl>
        </div>

        <!-- Partner Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Partner Information') }}</h2>
            @if($commission->referralPartner)
                <dl class="space-y-3">
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Partner Name') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $commission->referralPartner->user?->name ?? '-' }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Email') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $commission->referralPartner->user?->email ?? '-' }}</dd>
                    </div>
                </dl>
            @else
                <p class="text-sm text-gray-400">{{ __('No partner information available.') }}</p>
            @endif
        </div>

        <!-- Lead Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Lead Information') }}</h2>
            @if($commission->lead)
                <dl class="space-y-3">
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Lead Name') }}</dt>
                        <dd class="mt-1 text-sm">
                            <a href="{{ route('admin.leads.show', $commission->lead) }}" class="text-teal-600 hover:text-teal-700">
                                {{ $commission->lead->first_name }} {{ $commission->lead->last_name }}
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Company') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ $commission->lead->company_name ?? '-' }}</dd>
                    </div>
                </dl>
            @else
                <p class="text-sm text-gray-400">{{ __('No lead information available.') }}</p>
            @endif
        </div>

        <!-- Invoice Info -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Invoice Information') }}</h2>
            @if($commission->invoice)
                <dl class="space-y-3">
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Invoice Number') }}</dt>
                        <dd class="mt-1 text-sm">
                            <a href="{{ route('admin.invoices.show', $commission->invoice) }}" class="text-teal-600 hover:text-teal-700">
                                {{ $commission->invoice->invoice_number }}
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Invoice Total') }}</dt>
                        <dd class="mt-1 text-sm text-gray-900">&euro;{{ number_format($commission->invoice->total, 2, ',', '.') }}</dd>
                    </div>
                    <div>
                        <dt class="text-xs font-medium text-gray-500 uppercase tracking-wider">{{ __('Invoice Status') }}</dt>
                        @php
                            $invColor = \App\Helpers\StatusHelper::invoiceStatusColor($commission->invoice->status);
                        @endphp
                        <dd class="mt-1">
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-{{ $invColor }}-100 text-{{ $invColor }}-700">
                                {{ __(\App\Helpers\StatusHelper::formatStatus($commission->invoice->status)) }}
                            </span>
                        </dd>
                    </div>
                </dl>
            @else
                <p class="text-sm text-gray-400">{{ __('No invoice information available.') }}</p>
            @endif
        </div>
    </div>

    <!-- Status Timeline -->
    <div class="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ __('Status Progress') }}</h2>
        <div class="flex items-center justify-between">
            @foreach(['estimated', 'confirmed', 'scheduled', 'paid'] as $step)
                @php
                    $stepIndex = array_search($step, ['estimated', 'confirmed', 'scheduled', 'paid']);
                    $currentIndex = array_search($commission->status, ['estimated', 'confirmed', 'scheduled', 'paid']);
                    $isActive = $currentIndex !== false && $stepIndex <= $currentIndex;
                    $isCurrent = $commission->status === $step;
                @endphp
                <div class="flex flex-col items-center {{ $step !== 'paid' ? 'flex-1' : '' }}">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                        {{ $isActive ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500' }}
                        {{ $isCurrent ? 'ring-2 ring-teal-300 ring-offset-2' : '' }}">
                        {{ $stepIndex + 1 }}
                    </div>
                    <span class="mt-2 text-xs font-medium {{ $isActive ? 'text-teal-700' : 'text-gray-400' }}">
                        {{ __(ucfirst($step)) }}
                    </span>
                </div>
                @if($step !== 'paid')
                    <div class="flex-1 h-0.5 mx-2 {{ $isActive && $stepIndex < ($currentIndex ?? -1) ? 'bg-teal-400' : 'bg-gray-200' }}"></div>
                @endif
            @endforeach
        </div>
        @if($commission->status === 'cancelled')
            <div class="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-700 text-center">
                {{ __('This commission has been cancelled.') }}
            </div>
        @endif
    </div>
@endsection
