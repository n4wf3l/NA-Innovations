@extends('layouts.admin')

@section('title', __('Commissions'))

@section('content')
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Commissions') }}</h1>
    </div>
    <p class="text-sm text-gray-500 -mt-4 mb-6">{{ __('Track referral partner commissions. Confirm, schedule, and record payments for earned commissions.') }}</p>

    <!-- Filters -->
    <form method="GET" action="{{ route('admin.commissions.index') }}" class="mb-6">
        <div class="flex flex-col sm:flex-row gap-3">
            <!-- Status Filter -->
            <select name="status"
                    onchange="this.form.submit()"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                <option value="">{{ __('All Statuses') }}</option>
                @foreach(['estimated', 'confirmed', 'scheduled', 'paid', 'cancelled'] as $status)
                    <option value="{{ $status }}" {{ request('status') === $status ? 'selected' : '' }}>
                        {{ __(ucwords($status)) }}
                    </option>
                @endforeach
            </select>

            <!-- Partner Filter -->
            <select name="partner_id"
                    onchange="this.form.submit()"
                    class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                <option value="">{{ __('All Partners') }}</option>
                @foreach($partners as $partner)
                    <option value="{{ $partner->id }}" {{ request('partner_id') == $partner->id ? 'selected' : '' }}>
                        {{ $partner->user?->name ?? 'Partner #' . $partner->id }}
                    </option>
                @endforeach
            </select>

            <!-- Search -->
            <div class="flex-1">
                <input type="text" name="search" value="{{ request('search') }}"
                       placeholder="{{ __('Search by partner or lead name...') }}"
                       class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
            </div>

            <button type="submit"
                    class="inline-flex items-center gap-2 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {{ __('Search') }}
            </button>

            @if(request()->hasAny(['status', 'partner_id', 'search']))
                <a href="{{ route('admin.commissions.index') }}"
                   class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    {{ __('Clear') }}
                </a>
            @endif
        </div>
    </form>

    <!-- Table -->
    @if($commissions->count() > 0)
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Partner') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Lead') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Invoice #') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Base Amount') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-center">{{ __('Rate') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Commission') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600">{{ __('Status') }}</th>
                            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{{ __('Actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach($commissions as $commission)
                            @php
                                $color = \App\Helpers\StatusHelper::commissionStatusColor($commission->status);
                            @endphp
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-3 font-medium text-gray-900">
                                    {{ $commission->referralPartner?->user?->name ?? '-' }}
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    @if($commission->lead)
                                        <a href="{{ route('admin.leads.show', $commission->lead) }}" class="text-teal-600 hover:text-teal-700">
                                            {{ $commission->lead->first_name }} {{ $commission->lead->last_name }}
                                        </a>
                                    @else
                                        -
                                    @endif
                                </td>
                                <td class="px-4 py-3 text-gray-600">
                                    @if($commission->invoice)
                                        <a href="{{ route('admin.invoices.show', $commission->invoice) }}" class="text-teal-600 hover:text-teal-700">
                                            {{ $commission->invoice->invoice_number }}
                                        </a>
                                    @else
                                        -
                                    @endif
                                </td>
                                <td class="px-4 py-3 text-gray-600 text-right">&euro;{{ number_format($commission->base_amount, 2, ',', '.') }}</td>
                                <td class="px-4 py-3 text-gray-600 text-center">{{ $commission->commission_rate }}%</td>
                                <td class="px-4 py-3 font-medium text-gray-900 text-right">&euro;{{ number_format($commission->commission_amount, 2, ',', '.') }}</td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-{{ $color }}-100 text-{{ $color }}-700">
                                        {{ __(\App\Helpers\StatusHelper::formatStatus($commission->status)) }}
                                    </span>
                                </td>
                                <td class="px-4 py-3">
                                    <div class="flex items-center justify-end gap-2">
                                        <a href="{{ route('admin.commissions.show', $commission) }}"
                                           class="text-gray-500 hover:text-teal-600 transition-colors"
                                           title="{{ __('View') }}">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        </a>

                                        @if($commission->status === 'estimated')
                                            <form method="POST" action="{{ route('admin.commissions.confirm', $commission) }}" class="inline">
                                                @csrf
                                                @method('PATCH')
                                                <button type="submit"
                                                        class="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                                        title="{{ __('Confirm') }}">
                                                    {{ __('Confirm') }}
                                                </button>
                                            </form>
                                        @endif

                                        @if($commission->status === 'confirmed')
                                            <form method="POST" action="{{ route('admin.commissions.schedule', $commission) }}" class="inline"
                                                  x-data x-on:submit.prevent="
                                                    const date = prompt('{{ __('Enter scheduled payment date (YYYY-MM-DD):') }}');
                                                    if (date) {
                                                        const input = document.createElement('input');
                                                        input.type = 'hidden';
                                                        input.name = 'scheduled_payment_date';
                                                        input.value = date;
                                                        $el.appendChild(input);
                                                        $el.submit();
                                                    }
                                                  ">
                                                @csrf
                                                @method('PATCH')
                                                <button type="submit"
                                                        class="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                                                        title="{{ __('Schedule') }}">
                                                    {{ __('Schedule') }}
                                                </button>
                                            </form>
                                        @endif

                                        @if(in_array($commission->status, ['confirmed', 'scheduled']))
                                            <form method="POST" action="{{ route('admin.commissions.pay', $commission) }}" class="inline">
                                                @csrf
                                                @method('PATCH')
                                                <button type="submit"
                                                        class="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                                                        title="{{ __('Mark Paid') }}">
                                                    {{ __('Pay') }}
                                                </button>
                                            </form>
                                        @endif

                                        @if(!in_array($commission->status, ['paid', 'cancelled']))
                                            <form method="POST" action="{{ route('admin.commissions.destroy', $commission) }}"
                                                  onsubmit="return confirm('{{ __('Cancel this commission?') }}')"
                                                  class="inline">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit"
                                                        class="text-gray-500 hover:text-red-600 transition-colors"
                                                        title="{{ __('Cancel') }}">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                                </button>
                                            </form>
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            @if($commissions->hasPages())
                <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    {{ $commissions->links() }}
                </div>
            @endif
        </div>
    @else
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/></svg>
            <h3 class="text-lg font-medium text-gray-900 mb-1">{{ __('No commissions yet') }}</h3>
            <p class="text-gray-500">{{ __('Commissions will appear here when payments are recorded for referred leads.') }}</p>
        </div>
    @endif
@endsection
