@extends('layouts.admin')

@section('title', __('Edit Invoice') . ' - ' . $invoice->invoice_number)

@section('content')
    <!-- Back Link -->
    <div class="mb-6">
        <a href="{{ route('admin.invoices.show', $invoice) }}"
           class="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            {{ __('Back to Invoice') }}
        </a>
    </div>

    <!-- Page Header -->
    <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">{{ __('Edit Invoice') }} {{ $invoice->invoice_number }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ __('Update invoice details. Only draft invoices can be modified.') }}</p>
    </div>

    <!-- Form -->
    <form method="POST" action="{{ route('admin.invoices.update', $invoice) }}" x-data="invoiceForm()">
        @csrf
        @method('PUT')

        <!-- Client Information -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">{{ __('Client Information') }}</h3>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <label for="client_id" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Existing Client') }}</label>
                    <select name="client_id" id="client_id" x-on:change="fillClientInfo($event.target)"
                            class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                        <option value="">-- {{ __('Manual entry') }} --</option>
                        @foreach($clients as $client)
                            <option value="{{ $client->id }}"
                                    data-name="{{ $client->name }}"
                                    data-email="{{ $client->email }}"
                                    data-company="{{ $client->company_name }}"
                                    data-address="{{ $client->address }}"
                                    data-vat="{{ $client->vat_number }}"
                                    {{ old('client_id', $invoice->client_id) == $client->id ? 'selected' : '' }}>
                                {{ $client->name }} {{ $client->company_name ? '(' . $client->company_name . ')' : '' }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label for="type" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Invoice Type') }}</label>
                    <select name="type" id="type"
                            class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                        @foreach(['standard', 'deposit', 'final', 'credit_note'] as $type)
                            <option value="{{ $type }}" {{ old('type', $invoice->type ?? 'standard') === $type ? 'selected' : '' }}>
                                {{ __(ucwords(str_replace('_', ' ', $type))) }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label for="client_name" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Client Name') }} <span class="text-red-500">*</span></label>
                    <input type="text" name="client_name" id="client_name" x-model="clientName"
                           class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                    @error('client_name') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label for="client_email" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Client Email') }} <span class="text-red-500">*</span></label>
                    <input type="email" name="client_email" id="client_email" x-model="clientEmail"
                           class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                    @error('client_email') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label for="client_company" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Company') }}</label>
                    <input type="text" name="client_company" id="client_company" x-model="clientCompany"
                           class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                </div>

                <div>
                    <label for="client_vat" class="block text-sm font-medium text-gray-700 mb-1">{{ __('VAT Number') }}</label>
                    <input type="text" name="client_vat" id="client_vat" x-model="clientVat"
                           class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                </div>
            </div>

            <div class="mt-5">
                <label for="client_address" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Address') }}</label>
                <textarea name="client_address" id="client_address" rows="2" x-model="clientAddress"
                          class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300"></textarea>
            </div>
        </div>

        <!-- Invoice Details -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">{{ __('Invoice Details') }}</h3>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-3">
                    <label for="title" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Title') }} <span class="text-red-500">*</span></label>
                    <input type="text" name="title" id="title" value="{{ old('title', $invoice->title) }}"
                           class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                    @error('title') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label for="tax_rate" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Tax Rate') }} (%)</label>
                    <input type="number" name="tax_rate" id="tax_rate" x-model.number="taxRate"
                           step="0.01" min="0" max="100"
                           class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">
                </div>

                <div>
                    <label for="issue_date" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Issue Date') }} <span class="text-red-500">*</span></label>
                    <input type="date" name="issue_date" id="issue_date"
                           value="{{ old('issue_date', $invoice->issue_date?->format('Y-m-d')) }}"
                           class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                    @error('issue_date') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>

                <div>
                    <label for="due_date" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Due Date') }} <span class="text-red-500">*</span></label>
                    <input type="date" name="due_date" id="due_date"
                           value="{{ old('due_date', $invoice->due_date?->format('Y-m-d')) }}"
                           class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                    @error('due_date') <p class="mt-1 text-sm text-red-600">{{ $message }}</p> @enderror
                </div>
            </div>
        </div>

        <!-- Line Items -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div class="flex items-center justify-between mb-5">
                <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">{{ __('Line Items') }}</h3>
                <button type="button" @click="addItem()"
                        class="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    {{ __('Add Item') }}
                </button>
            </div>

            @error('items') <p class="mb-3 text-sm text-red-600">{{ $message }}</p> @enderror

            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th class="px-3 py-2 text-left font-semibold text-gray-600 w-2/5">{{ __('Description') }}</th>
                            <th class="px-3 py-2 text-left font-semibold text-gray-600 w-20">{{ __('Qty') }}</th>
                            <th class="px-3 py-2 text-left font-semibold text-gray-600 w-24">{{ __('Unit') }}</th>
                            <th class="px-3 py-2 text-right font-semibold text-gray-600 w-28">{{ __('Unit Price') }}</th>
                            <th class="px-3 py-2 text-right font-semibold text-gray-600 w-28">{{ __('Total') }}</th>
                            <th class="px-3 py-2 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template x-for="(item, index) in items" :key="index">
                            <tr class="border-b border-gray-100">
                                <td class="px-3 py-2">
                                    <input type="text" :name="'items[' + index + '][description]'" x-model="item.description"
                                           class="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-teal-300 focus:ring-teal-300"
                                           placeholder="{{ __('Item description') }}" required>
                                </td>
                                <td class="px-3 py-2">
                                    <input type="number" :name="'items[' + index + '][quantity]'" x-model.number="item.quantity"
                                           step="0.01" min="0.01"
                                           class="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-teal-300 focus:ring-teal-300" required>
                                </td>
                                <td class="px-3 py-2">
                                    <input type="text" :name="'items[' + index + '][unit]'" x-model="item.unit"
                                           class="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-teal-300 focus:ring-teal-300"
                                           placeholder="{{ __('unit') }}">
                                </td>
                                <td class="px-3 py-2">
                                    <input type="number" :name="'items[' + index + '][unit_price]'" x-model.number="item.unit_price"
                                           step="0.01" min="0"
                                           class="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm text-right focus:border-teal-300 focus:ring-teal-300" required>
                                </td>
                                <td class="px-3 py-2 text-right font-medium text-gray-700">
                                    <span x-text="formatCurrency(item.quantity * item.unit_price)"></span>
                                </td>
                                <td class="px-3 py-2">
                                    <button type="button" @click="removeItem(index)" x-show="items.length > 1"
                                            class="text-gray-400 hover:text-red-500 transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                    </button>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <div class="mt-4 flex justify-end">
                <div class="w-72 space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-500">{{ __('Subtotal') }}:</span>
                        <span class="font-medium text-gray-900" x-text="formatCurrency(subtotal)"></span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-500">{{ __('Tax') }} (<span x-text="taxRate"></span>%):</span>
                        <span class="text-gray-700" x-text="formatCurrency(taxAmount)"></span>
                    </div>
                    <div class="flex justify-between pt-2 border-t border-gray-200">
                        <span class="font-semibold text-gray-900">{{ __('Total') }}:</span>
                        <span class="font-bold text-gray-900 text-base" x-text="formatCurrency(total)"></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment & Notes -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">{{ __('Payment & Notes') }}</h3>

            <div>
                <label for="payment_instructions" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Payment Instructions') }}</label>
                <textarea name="payment_instructions" id="payment_instructions" rows="3"
                          class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">{{ old('payment_instructions', $invoice->payment_instructions) }}</textarea>
            </div>

            <div class="mt-5">
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">{{ __('Notes') }}</label>
                <textarea name="notes" id="notes" rows="2"
                          class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-teal-300 focus:ring-teal-300">{{ old('notes', $invoice->notes) }}</textarea>
            </div>
        </div>

        <!-- Submit -->
        <div class="flex items-center justify-end gap-3">
            <a href="{{ route('admin.invoices.show', $invoice) }}"
               class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                {{ __('Cancel') }}
            </a>
            <button type="submit"
                    class="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 transition-colors">
                {{ __('Update Invoice') }}
            </button>
        </div>
    </form>

    <script>
        function invoiceForm() {
            return {
                clientName: @json(old('client_name', $invoice->client_name)),
                clientEmail: @json(old('client_email', $invoice->client_email)),
                clientCompany: @json(old('client_company', $invoice->client_company ?? '')),
                clientAddress: @json(old('client_address', $invoice->client_address ?? '')),
                clientVat: @json(old('client_vat', $invoice->client_vat ?? '')),
                taxRate: {{ old('tax_rate', $invoice->tax_rate) }},
                items: @json($invoice->items->map(fn($item) => [
                    'description' => $item->description,
                    'quantity' => (float) $item->quantity,
                    'unit' => $item->unit ?? 'unit',
                    'unit_price' => (float) $item->unit_price,
                ])->values()),

                get subtotal() {
                    return this.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
                },
                get taxAmount() {
                    return this.subtotal * (this.taxRate / 100);
                },
                get total() {
                    return this.subtotal + this.taxAmount;
                },

                addItem() {
                    this.items.push({ description: '', quantity: 1, unit: 'unit', unit_price: 0 });
                },
                removeItem(index) {
                    if (this.items.length > 1) {
                        this.items.splice(index, 1);
                    }
                },
                formatCurrency(value) {
                    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value || 0);
                },
                fillClientInfo(select) {
                    const option = select.options[select.selectedIndex];
                    if (option.value) {
                        this.clientName = option.dataset.name || '';
                        this.clientEmail = option.dataset.email || '';
                        this.clientCompany = option.dataset.company || '';
                        this.clientAddress = option.dataset.address || '';
                        this.clientVat = option.dataset.vat || '';
                    }
                }
            }
        }
    </script>
@endsection
