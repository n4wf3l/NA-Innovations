import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { User, Invoice } from '@/types';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface InvoiceItem {
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
}

interface Props {
    invoice: Invoice & {
        client_company?: string;
        client_address?: string;
        client_vat?: string;
        tax_rate?: number;
        payment_instructions?: string;
        notes?: string;
        items?: { id: number; description: string; quantity: number; unit: string; unit_price: number; total: number; sort_order: number }[];
    };
    clients: User[];
}

const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-teal-400 focus:ring-teal-400';

function toDateInput(val: string | null | undefined): string {
    if (!val) return '';
    return val.substring(0, 10);
}

export default function InvoiceEdit({ invoice, clients }: Props) {
    const { t } = useTranslation();
    const initialItems: InvoiceItem[] = (invoice.items && invoice.items.length > 0)
        ? invoice.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit || 'unit',
            unit_price: item.unit_price,
        }))
        : [{ description: '', quantity: 1, unit: 'unit', unit_price: 0 }];

    const [items, setItems] = useState<InvoiceItem[]>(initialItems);

    const { data, setData, put, processing, errors } = useForm({
        title: invoice.title || '',
        client_id: invoice.client?.id ? String(invoice.client.id) : '',
        client_name: invoice.client_name || '',
        client_email: invoice.client_email || '',
        client_company: invoice.client_company || '',
        client_address: invoice.client_address || '',
        client_vat: invoice.client_vat || '',
        type: invoice.type || 'standard',
        tax_rate: invoice.tax_rate ?? 21,
        issue_date: toDateInput(invoice.issue_date),
        due_date: toDateInput(invoice.due_date),
        payment_instructions: invoice.payment_instructions || '',
        notes: invoice.notes || '',
        items: initialItems,
    });

    const handleClientSelect = (clientId: string) => {
        setData('client_id', clientId);
        if (clientId) {
            const client = clients.find(c => c.id === Number(clientId));
            if (client) {
                setData(prev => ({
                    ...prev,
                    client_id: clientId,
                    client_name: client.name,
                    client_email: client.email,
                    client_company: client.company_name || '',
                    client_address: [client.address, client.city, client.postal_code, client.country].filter(Boolean).join(', '),
                    client_vat: client.vat_number || '',
                }));
            }
        }
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unit: 'unit', unit_price: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
    };

    const subtotal = useMemo(() => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    }, [items]);

    const taxAmount = useMemo(() => subtotal * (data.tax_rate / 100), [subtotal, data.tax_rate]);
    const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

    const invoiceTypes = [
        { value: 'standard', label: 'Standard' },
        { value: 'deposit', label: 'Deposit' },
        { value: 'final', label: 'Final' },
        { value: 'credit_note', label: 'Credit Note' },
    ];

    return (
        <AdminLayout title={t("Edit Invoice")} header={t("Edit Invoice")}>
            <Head title={t("Edit Invoice")} />

            <div className="mb-6">
                <Link href={`/admin/invoices/${invoice.id}`} className="text-sm text-gray-500 hover:text-gray-700">&larr; {t("Back to Invoice")}</Link>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); router.put(`/admin/invoices/${invoice.id}`, { ...data, items } as any); }} className="space-y-6 max-w-5xl">
                {/* Client Selection */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Client Information")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Select Existing Client")}</label>
                            <select value={data.client_id} onChange={e => handleClientSelect(e.target.value)} className={inputClass}>
                                <option value="">{t("-- Manual entry --")}</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Invoice Type")}</label>
                            <select value={data.type} onChange={e => setData('type', e.target.value)} className={inputClass}>
                                {invoiceTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Client Name")} *</label>
                            <input type="text" value={data.client_name} onChange={e => setData('client_name', e.target.value)} className={inputClass} required />
                            {errors.client_name && <p className="mt-1 text-sm text-red-600">{errors.client_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Client Email")} *</label>
                            <input type="email" value={data.client_email} onChange={e => setData('client_email', e.target.value)} className={inputClass} required />
                            {errors.client_email && <p className="mt-1 text-sm text-red-600">{errors.client_email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Company")}</label>
                            <input type="text" value={data.client_company} onChange={e => setData('client_company', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("VAT Number")}</label>
                            <input type="text" value={data.client_vat} onChange={e => setData('client_vat', e.target.value)} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Address")}</label>
                            <input type="text" value={data.client_address} onChange={e => setData('client_address', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Invoice Details")}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Title")} *</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className={inputClass} required />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("Issue Date")} *</label>
                                <input type="date" value={data.issue_date} onChange={e => setData('issue_date', e.target.value)} className={inputClass} required />
                                {errors.issue_date && <p className="mt-1 text-sm text-red-600">{errors.issue_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("Due Date")} *</label>
                                <input type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} className={inputClass} required />
                                {errors.due_date && <p className="mt-1 text-sm text-red-600">{errors.due_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("Tax Rate (%)")}</label>
                                <input type="number" value={data.tax_rate} onChange={e => setData('tax_rate', parseFloat(e.target.value) || 0)} className={inputClass} min="0" max="100" step="0.01" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t("Line Items")}</h3>
                        <button type="button" onClick={addItem} className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Add Item
                        </button>
                    </div>
                    {errors.items && <p className="mb-3 text-sm text-red-600">{errors.items}</p>}

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-2 px-2 font-medium text-gray-500 w-2/5">Description</th>
                                    <th className="text-left py-2 px-2 font-medium text-gray-500 w-20">Qty</th>
                                    <th className="text-left py-2 px-2 font-medium text-gray-500 w-24">Unit</th>
                                    <th className="text-left py-2 px-2 font-medium text-gray-500 w-28">Unit Price</th>
                                    <th className="text-right py-2 px-2 font-medium text-gray-500 w-28">Total</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-50">
                                        <td className="py-2 px-2">
                                            <input type="text" value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal-400 focus:ring-teal-400" required />
                                        </td>
                                        <td className="py-2 px-2">
                                            <input type="number" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal-400 focus:ring-teal-400" min="0.01" step="0.01" required />
                                        </td>
                                        <td className="py-2 px-2">
                                            <select value={item.unit} onChange={e => updateItem(index, 'unit', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal-400 focus:ring-teal-400">
                                                <option value="unit">{t("Unit")}</option>
                                                <option value="hour">{t("Hour")}</option>
                                                <option value="day">{t("Day")}</option>
                                                <option value="month">{t("Month")}</option>
                                                <option value="piece">{t("Piece")}</option>
                                                <option value="lot">{t("Lot")}</option>
                                            </select>
                                        </td>
                                        <td className="py-2 px-2">
                                            <input type="number" value={item.unit_price} onChange={e => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-teal-400 focus:ring-teal-400" min="0" step="0.01" required />
                                        </td>
                                        <td className="py-2 px-2 text-right font-medium text-gray-900">
                                            {(item.quantity * item.unit_price).toFixed(2)}
                                        </td>
                                        <td className="py-2 px-2">
                                            {items.length > 1 && (
                                                <button type="button" onClick={() => removeItem(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals & Payment */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Payment Instructions")}</h3>
                        <div className="space-y-4">
                            <textarea value={data.payment_instructions} onChange={e => setData('payment_instructions', e.target.value)} rows={4} className={inputClass} placeholder={t("Bank account details, payment methods accepted...")} />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t("Internal Notes")}</label>
                                <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Totals")}</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">{t("Subtotal")}</span>
                                <span className="font-medium text-gray-900">{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Tax ({data.tax_rate}%)</span>
                                <span className="font-medium text-gray-900">{taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
                                <span className="font-semibold text-gray-900">{t("Total")}</span>
                                <span className="font-bold text-lg text-gray-900">{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/invoices/${invoice.id}`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        Update Invoice
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
