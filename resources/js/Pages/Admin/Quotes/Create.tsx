import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { User, Lead } from '@/types';
import { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    clients: User[];
    leads: Lead[];
}

interface LineItem {
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    is_optional: boolean;
}

export default function QuoteCreate({ clients, leads }: Props) {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [form, setForm] = useState({
        title: '', client_id: '', client_name: '', client_email: '', client_company: '',
        client_address: '', client_vat: '', lead_id: '', introduction: '', scope_of_work: '',
        exclusions: '', tax_rate: 21, deposit_percentage: 30, valid_until: '', terms_and_conditions: '', notes: '',
    });

    const [items, setItems] = useState<LineItem[]>([
        { description: '', quantity: 1, unit: 'unit', unit_price: 0, is_optional: false },
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

    const addItem = () => setItems([...items, { description: '', quantity: 1, unit: 'unit', unit_price: 0, is_optional: false }]);
    const removeItem = (i: number) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i));
    const updateItem = (i: number, field: keyof LineItem, val: any) => {
        const u = [...items]; u[i] = { ...u[i], [field]: val }; setItems(u);
    };

    const subtotal = useMemo(() => items.filter(i => !i.is_optional).reduce((s, i) => s + i.quantity * i.unit_price, 0), [items]);
    const tax = useMemo(() => subtotal * (form.tax_rate / 100), [subtotal, form.tax_rate]);
    const total = subtotal + tax;
    const deposit = total * (form.deposit_percentage / 100);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        router.post('/admin/quotes', { ...form, items } as any, { onFinish: () => setSubmitting(false) });
    };

    const canGoNext = step === 1 ? (form.client_name && form.client_email && form.title) : true;

    const input = 'w-full bg-gray-50 border-0 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-teal-400 transition-all';
    const label = 'block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2';

    return (
        <AdminLayout title={t("New Quote")} header={t("New Quote")}>
            <Head title={t("New Quote")} />

            {/* Progress stepper */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-between mb-2">
                    {[t('Client & Details'), t('Line Items'), t('Settings & Review')].map((s, i) => (
                        <button key={s} onClick={() => setStep(i + 1)} className="flex items-center space-x-2 group">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                step > i + 1 ? 'bg-teal-500 text-white' :
                                step === i + 1 ? 'bg-gray-900 text-white' :
                                'bg-gray-200 text-gray-400'
                            }`}>{step > i + 1 ? '✓' : i + 1}</div>
                            <span className={`text-sm font-medium hidden sm:inline ${step === i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
                        </button>
                    ))}
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
                </div>
            </div>

            <form onSubmit={submit} className="max-w-4xl mx-auto">

                {/* STEP 1: Client & Quote Details */}
                {step === 1 && (
                    <div className="space-y-6 animate-page-in">
                        {/* Client */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                                <h3 className="text-white font-bold text-sm">{t("Client")}</h3>
                                <p className="text-gray-400 text-xs mt-0.5">Who is this quote for?</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={label}>{t("Quick Select")}</label>
                                        <select value={form.client_id} onChange={e => handleClientSelect(e.target.value)} className={input}>
                                            <option value="">Type manually below</option>
                                            {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.company_name ? `— ${c.company_name}` : ''}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={label}>{t("Link to Lead")}</label>
                                        <select value={form.lead_id} onChange={e => set('lead_id', e.target.value)} className={input}>
                                            <option value="">{t("None")}</option>
                                            {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={label}>Name <span className="text-red-400">*</span></label>
                                        <input type="text" value={form.client_name} onChange={e => set('client_name', e.target.value)} className={input} placeholder="John Doe" required />
                                    </div>
                                    <div>
                                        <label className={label}>Email <span className="text-red-400">*</span></label>
                                        <input type="email" value={form.client_email} onChange={e => set('client_email', e.target.value)} className={input} placeholder="john@company.com" required />
                                    </div>
                                    <div>
                                        <label className={label}>{t("Company")}</label>
                                        <input type="text" value={form.client_company} onChange={e => set('client_company', e.target.value)} className={input} placeholder="Acme Inc." />
                                    </div>
                                    <div>
                                        <label className={label}>{t("VAT")}</label>
                                        <input type="text" value={form.client_vat} onChange={e => set('client_vat', e.target.value)} className={input} placeholder="BE0123.456.789" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quote details */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                                <h3 className="text-white font-bold text-sm">{t("Quote Details")}</h3>
                                <p className="text-amber-100 text-xs mt-0.5">Describe what you're proposing</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className={label}>Title <span className="text-red-400">*</span></label>
                                    <input type="text" value={form.title} onChange={e => set('title', e.target.value)} className={input} placeholder="e.g. E-commerce Platform Development" required />
                                </div>
                                <div>
                                    <label className={label}>{t("Introduction")}</label>
                                    <textarea value={form.introduction} onChange={e => set('introduction', e.target.value)} rows={3} className={input} placeholder="Following our meeting, we're pleased to propose..." />
                                </div>
                                <div>
                                    <label className={label}>{t("Scope of Work")}</label>
                                    <textarea value={form.scope_of_work} onChange={e => set('scope_of_work', e.target.value)} rows={4} className={input} placeholder="This proposal covers..." />
                                </div>
                                <div>
                                    <label className={label}>{t("Exclusions")}</label>
                                    <textarea value={form.exclusions} onChange={e => set('exclusions', e.target.value)} rows={2} className={input} placeholder="Not included: content writing, stock photos..." />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" onClick={() => canGoNext && setStep(2)} disabled={!canGoNext}
                                className="px-8 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl disabled:opacity-30 hover:bg-gray-800 transition-all">
                                Next: Line Items →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Line Items */}
                {step === 2 && (
                    <div className="space-y-6 animate-page-in">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-bold text-sm">{t("Line Items")}</h3>
                                    <p className="text-blue-200 text-xs mt-0.5">Add what you're charging for</p>
                                </div>
                                <button type="button" onClick={addItem} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-colors">
                                    + Add Row
                                </button>
                            </div>
                            <div className="p-6 space-y-3">
                                {items.map((item, i) => (
                                    <div key={i} className={`rounded-xl border p-4 transition-all ${item.is_optional ? 'border-dashed border-gray-300 bg-gray-50/50' : 'border-gray-100 bg-white'}`}>
                                        <div className="grid grid-cols-12 gap-3 items-end">
                                            <div className="col-span-12 sm:col-span-5">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">{t("Description")}</label>
                                                <input type="text" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)}
                                                    className="w-full bg-gray-50 border-0 rounded-lg px-3 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-400" placeholder="Development service..." required />
                                            </div>
                                            <div className="col-span-4 sm:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">{t("Qty")}</label>
                                                <input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-gray-50 border-0 rounded-lg px-3 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-400" min="0.01" step="0.01" />
                                            </div>
                                            <div className="col-span-4 sm:col-span-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">{t("Price")}</label>
                                                <input type="number" value={item.unit_price} onChange={e => updateItem(i, 'unit_price', parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-gray-50 border-0 rounded-lg px-3 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-400" min="0" step="0.01" />
                                            </div>
                                            <div className="col-span-4 sm:col-span-2 text-right">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">{t("Total")}</label>
                                                <p className="py-2.5 text-sm font-bold text-gray-900">{formatCurrency(item.quantity * item.unit_price)}</p>
                                            </div>
                                            <div className="col-span-12 sm:col-span-1 flex items-end justify-end space-x-2">
                                                <button type="button" onClick={() => updateItem(i, 'is_optional', !item.is_optional)}
                                                    className={`px-2 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${item.is_optional ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'}`}
                                                    title={t("Toggle optional")}>OPT</button>
                                                {items.length > 1 && (
                                                    <button type="button" onClick={() => removeItem(i)} className="p-1.5 text-gray-300 hover:text-red-500 transition-colors">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals bar */}
                            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <p className="text-xs text-gray-400">{items.length} item{items.length > 1 ? 's' : ''} · {items.filter(i => i.is_optional).length} optional</p>
                                    <div className="flex items-center space-x-6 text-sm">
                                        <span className="text-gray-500">Subtotal: <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span></span>
                                        <span className="text-gray-500">Tax: <span className="font-medium">{formatCurrency(tax)}</span></span>
                                        <span className="text-gray-900 font-black text-lg">{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button type="button" onClick={() => setStep(1)} className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">← Back</button>
                            <button type="button" onClick={() => setStep(3)} className="px-8 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all">
                                Next: Review →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: Settings & Review */}
                {step === 3 && (
                    <div className="space-y-6 animate-page-in">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Settings */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">{t("Settings")}</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={label}>{t("Tax Rate %")}</label>
                                            <input type="number" value={form.tax_rate} onChange={e => set('tax_rate', parseFloat(e.target.value) || 0)} className={input} />
                                        </div>
                                        <div>
                                            <label className={label}>{t("Deposit %")}</label>
                                            <input type="number" value={form.deposit_percentage} onChange={e => set('deposit_percentage', parseInt(e.target.value) || 0)} className={input} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={label}>{t("Valid Until")}</label>
                                        <input type="date" value={form.valid_until} onChange={e => set('valid_until', e.target.value)} className={input} />
                                    </div>
                                    <div>
                                        <label className={label}>Terms & Conditions</label>
                                        <textarea value={form.terms_and_conditions} onChange={e => set('terms_and_conditions', e.target.value)} rows={3} className={input} placeholder="Payment terms..." />
                                    </div>
                                    <div>
                                        <label className={label}>{t("Internal Notes")}</label>
                                        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className={input} placeholder="Not shown on quote..." />
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{t("Quote Summary")}</h3>
                                    <p className="text-lg font-bold">{form.title || 'Untitled Quote'}</p>
                                    <p className="text-gray-400 text-sm mt-1">{form.client_name} {form.client_company ? `· ${form.client_company}` : ''}</p>

                                    <div className="mt-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">{t("Subtotal")}</span>
                                            <span>{formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Tax ({form.tax_rate}%)</span>
                                            <span>{formatCurrency(tax)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-black border-t border-white/10 pt-3 mt-3">
                                            <span>{t("Total")}</span>
                                            <span className="text-teal-300">{formatCurrency(total)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-400">
                                            <span>Deposit ({form.deposit_percentage}%)</span>
                                            <span>{formatCurrency(deposit)}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 text-xs text-gray-500">{items.length} line item{items.length > 1 ? 's' : ''}</div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col space-y-3">
                                    <button type="submit" disabled={submitting}
                                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-black text-base rounded-xl shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center">
                                        {submitting ? (
                                            <><svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Creating...</>
                                        ) : 'Create Quote'}
                                    </button>
                                    <button type="button" onClick={() => setStep(2)} className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700">← Back to Line Items</button>
                                    <Link href="/admin/quotes" className="w-full py-3 text-sm font-medium text-gray-400 hover:text-gray-600 text-center">{t('Cancel')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </AdminLayout>
    );
}
