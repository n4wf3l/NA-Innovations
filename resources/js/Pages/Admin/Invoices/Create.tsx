import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { User } from '@/types';
import { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '@/Components/ui/SearchableSelect';
import LocalePicker from '@/Components/ui/LocalePicker';

interface Props {
    clients: User[];
}

interface LineItem {
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
}

export default function InvoiceCreate({ clients }: Props) {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const defaultDue = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const [form, setForm] = useState({
        title: '', client_id: '', client_name: '', client_email: '', client_company: '',
        client_address: '', client_vat: '', type: 'standard', tax_rate: 21,
        issue_date: today, due_date: defaultDue, payment_instructions: '', notes: '', locale: 'fr',
    });

    const [items, setItems] = useState<LineItem[]>([
        { description: '', quantity: 1, unit: 'unit', unit_price: 0 },
    ]);

    const set = (key: string, val: any) => setForm(prev => ({ ...prev, [key]: val }));

    const handleClientSelect = (id: string) => {
        set('client_id', id);
        const c = clients.find(c => c.id === Number(id));
        if (c) {
            setForm(prev => ({ ...prev, client_id: id, client_name: c.name, client_email: c.email,
                client_company: c.company_name || '', client_vat: c.vat_number || '',
                client_address: [c.address, c.city, c.postal_code, c.country].filter(Boolean).join(', ') }));
        }
    };

    const addItem = () => setItems([...items, { description: '', quantity: 1, unit: 'unit', unit_price: 0 }]);
    const removeItem = (i: number) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof LineItem, val: any) => {
        const u = [...items]; u[i] = { ...u[i], [field]: val }; setItems(u);
    };

    const subtotal = useMemo(() => items.reduce((s, i) => s + i.quantity * i.unit_price, 0), [items]);
    const tax = useMemo(() => subtotal * (form.tax_rate / 100), [subtotal, form.tax_rate]);
    const total = subtotal + tax;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        router.post('/admin/invoices', { ...form, items, locale: form.locale } as any, { onFinish: () => setSubmitting(false) });
    };

    const canGoNext = step === 1 ? (form.client_name && form.client_email && form.title) : true;

    const input = 'w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-400 transition-all';
    const label = 'block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2';

    const invoiceTypes = [
        { value: 'standard', label: 'Standard' },
        { value: 'deposit', label: t('Deposit') },
        { value: 'final', label: t('Final Invoice') },
        { value: 'credit_note', label: t('credit_note') },
    ];

    return (
        <AdminLayout title={t("New Invoice")} header={t("New Invoice")}>
            <Head title={t("New Invoice")} />

            {/* Progress stepper */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-2">
                    {[t('Client & Details'), t('Line Items'), t('Settings & Review')].map((s, i) => (
                        <button key={s} onClick={() => setStep(i + 1)} className="flex items-center space-x-2 group">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                step > i + 1 ? 'bg-blue-500 text-white' :
                                step === i + 1 ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' :
                                'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                            }`}>{step > i + 1 ? '✓' : i + 1}</div>
                            <span className={`text-sm font-medium hidden sm:inline ${step === i + 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{s}</span>
                        </button>
                    ))}
                </div>
                <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
                </div>
            </div>

            <form onSubmit={submit} className="max-w-4xl mx-auto">

                {/* STEP 1 */}
                {step === 1 && (
                    <div className="space-y-6 animate-page-in">
                        {/* Client */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                                <h3 className="text-white font-bold text-sm">{t("Client")}</h3>
                                <p className="text-gray-400 text-xs mt-0.5">{t("Who is this invoice for?")}</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={label}>{t("Quick Select")}</label>
                                        <SearchableSelect
                                            value={form.client_id}
                                            onChange={handleClientSelect}
                                            placeholder={t("-- Manual entry --")}
                                            searchPlaceholder={t("Search clients...")}
                                            options={[
                                                { value: '', label: t("-- Manual entry --") },
                                                ...clients.map(c => ({
                                                    value: String(c.id),
                                                    label: c.name,
                                                    sublabel: c.company_name || undefined,
                                                    icon: <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0"><span className="text-[10px] font-bold text-white">{c.name.split(' ').map((w: string) => w[0]).join('').slice(0,2)}</span></div>,
                                                })),
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <label className={label}>{t("Invoice Type")}</label>
                                        <select value={form.type} onChange={e => set('type', e.target.value)} className={input}>
                                            {invoiceTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={label}>{t("Name")} <span className="text-red-400">*</span></label>
                                        <input type="text" value={form.client_name} onChange={e => set('client_name', e.target.value)} className={input} placeholder="John Doe" required />
                                    </div>
                                    <div>
                                        <label className={label}>{t("Email")} <span className="text-red-400">*</span></label>
                                        <input type="email" value={form.client_email} onChange={e => set('client_email', e.target.value)} className={input} placeholder="john@company.com" required />
                                    </div>
                                    <div>
                                        <label className={label}>{t("Company")}</label>
                                        <input type="text" value={form.client_company} onChange={e => set('client_company', e.target.value)} className={input} />
                                    </div>
                                    <div>
                                        <label className={label}>{t("VAT")}</label>
                                        <input type="text" value={form.client_vat} onChange={e => set('client_vat', e.target.value)} className={input} placeholder="BE0123.456.789" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice details */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                                <h3 className="text-white font-bold text-sm">{t("Invoice Details")}</h3>
                                <p className="text-blue-200 text-xs mt-0.5">{t("Fill in the invoice information")}</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className={label}>{t("Title")} <span className="text-red-400">*</span></label>
                                    <input type="text" value={form.title} onChange={e => set('title', e.target.value)} className={input} placeholder="e.g. Website Development - Final Invoice" required />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className={label}>{t("Issue Date")} <span className="text-red-400">*</span></label>
                                        <input type="date" value={form.issue_date} onChange={e => set('issue_date', e.target.value)} className={input} required />
                                    </div>
                                    <div>
                                        <label className={label}>{t("Due Date")} <span className="text-red-400">*</span></label>
                                        <input type="date" value={form.due_date} onChange={e => set('due_date', e.target.value)} className={input} required />
                                    </div>
                                    <div>
                                        <label className={label}>{t("Tax Rate %")}</label>
                                        <input type="number" value={form.tax_rate} onChange={e => set('tax_rate', parseFloat(e.target.value) || 0)} className={input} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" onClick={() => canGoNext && setStep(2)} disabled={!canGoNext}
                                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-xl disabled:opacity-30 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
                                {t("Next")}: {t("Line Items")} →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className="space-y-6 animate-page-in">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-bold text-sm">{t("Line Items")}</h3>
                                    <p className="text-emerald-200 text-xs mt-0.5">{t("Add what you're charging for")}</p>
                                </div>
                                <button type="button" onClick={addItem} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-colors">
                                    + {t("Add Item")}
                                </button>
                            </div>
                            <div className="p-6 space-y-3">
                                {items.map((item, i) => (
                                    <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                                        <div className="grid grid-cols-12 gap-3 items-end">
                                            <div className="col-span-12 sm:col-span-5">
                                                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t("Description")}</label>
                                                <input type="text" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-emerald-400" placeholder={t("Item description")} required />
                                            </div>
                                            <div className="col-span-3 sm:col-span-1">
                                                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t("Qty")}</label>
                                                <input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-emerald-400" min="0.01" step="0.01" />
                                            </div>
                                            <div className="col-span-4 sm:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t("Unit")}</label>
                                                <select value={item.unit} onChange={e => updateItem(i, 'unit', e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-400">
                                                    <option value="unit">{t("Unit")}</option>
                                                    <option value="hour">{t("Hour")}</option>
                                                    <option value="day">{t("Day")}</option>
                                                    <option value="month">{t("Month")}</option>
                                                    <option value="piece">{t("Piece")}</option>
                                                    <option value="lot">{t("Lot")}</option>
                                                </select>
                                            </div>
                                            <div className="col-span-5 sm:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t("Price")}</label>
                                                <input type="number" value={item.unit_price} onChange={e => updateItem(i, 'unit_price', parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-emerald-400" min="0" step="0.01" />
                                            </div>
                                            <div className="col-span-12 sm:col-span-2 flex items-end justify-between sm:justify-end gap-2">
                                                <p className="py-2.5 text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(item.quantity * item.unit_price)}</p>
                                                {items.length > 1 && (
                                                    <button type="button" onClick={() => removeItem(i)} className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 px-6 py-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{items.length} item{items.length > 1 ? 's' : ''}</p>
                                    <div className="flex items-center space-x-6 text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">{t("Subtotal")}: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span></span>
                                        <span className="text-gray-500 dark:text-gray-400">{t("Tax")}: <span className="font-medium">{formatCurrency(tax)}</span></span>
                                        <span className="text-gray-900 dark:text-white font-black text-lg">{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button type="button" onClick={() => setStep(1)} className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">← {t("Back")}</button>
                            <button type="button" onClick={() => setStep(3)} className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
                                {t("Next")}: {t("Settings & Review")} →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className="space-y-6 animate-page-in">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Payment & Notes */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{t("Payment Instructions")}</h3>
                                <div className="space-y-4">
                                    <LocalePicker value={form.locale} onChange={val => set('locale', val)} label={t("Document & Email Language")} />
                                    <textarea value={form.payment_instructions} onChange={e => set('payment_instructions', e.target.value)} rows={4} className={input} placeholder={t("Bank account details, payment methods accepted...")} />
                                    <div>
                                        <label className={label}>{t("Internal Notes")}</label>
                                        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className={input} placeholder={t("Internal notes (not shown on invoice)...")} />
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t("Invoice")} — {t("Quote Summary")}</h3>
                                    <p className="text-lg font-bold">{form.title || t('Untitled')}</p>
                                    <p className="text-gray-400 text-sm mt-1">{form.client_name} {form.client_company ? `· ${form.client_company}` : ''}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">{form.type}</span>
                                        <span className="text-xs text-gray-500">{form.issue_date} → {form.due_date}</span>
                                    </div>

                                    <div className="mt-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">{t("Subtotal")}</span>
                                            <span>{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">{t("Tax")} ({form.tax_rate}%)</span>
                                            <span>{formatCurrency(tax)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-black border-t border-white/10 pt-3 mt-3">
                                            <span>{t("Total")}</span>
                                            <span className="text-blue-300">{formatCurrency(total)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 text-xs text-gray-500">{items.length} {t("Line Items").toLowerCase()}</div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col space-y-3">
                                    <button type="submit" disabled={submitting}
                                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center">
                                        {submitting ? (
                                            <><svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Creating...')}</>
                                        ) : t('Create Invoice')}
                                    </button>
                                    <button type="button" onClick={() => setStep(2)} className="w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">← {t("Back to")} {t("Line Items")}</button>
                                    <Link href="/admin/invoices" className="w-full py-3 text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-center">{t('Cancel')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </AdminLayout>
    );
}
