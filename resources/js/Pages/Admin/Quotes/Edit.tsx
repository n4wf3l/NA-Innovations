import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { User, Lead, Quote, QuoteItem } from '@/types';
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '@/Components/ui/SearchableSelect';
import { useConfirm } from '@/hooks/useConfirm';

interface Props {
    quote: Quote & {
        client_address?: string;
        client_vat?: string;
        introduction?: string;
        scope_of_work?: string;
        exclusions?: string;
        tax_rate?: number;
        deposit_percentage?: number;
        terms_and_conditions?: string;
        notes?: string;
    };
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

const inputClass = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-teal-400 focus:ring-teal-400';

function toDateInput(val: string | null | undefined): string {
    if (!val) return '';
    return val.substring(0, 10);
}

export default function QuoteEdit({ quote, clients, leads }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const initialItems: LineItem[] = (quote.items && quote.items.length > 0)
        ? quote.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit || 'unit',
            unit_price: item.unit_price,
            is_optional: item.is_optional || false,
        }))
        : [{ description: '', quantity: 1, unit: 'unit', unit_price: 0, is_optional: false }];

    const [items, setItems] = useState<LineItem[]>(initialItems);

    const { data, setData, put, processing, errors } = useForm({
        title: quote.title || '',
        client_id: quote.client_id ? String(quote.client_id) : '',
        client_name: quote.client_name || '',
        client_email: quote.client_email || '',
        client_company: quote.client_company || '',
        client_address: quote.client_address || '',
        client_vat: quote.client_vat || '',
        lead_id: quote.lead_id ? String(quote.lead_id) : '',
        introduction: quote.introduction || '',
        scope_of_work: quote.scope_of_work || '',
        exclusions: quote.exclusions || '',
        tax_rate: quote.tax_rate ?? 21,
        deposit_percentage: quote.deposit_percentage ?? 30,
        valid_until: toDateInput(quote.valid_until),
        terms_and_conditions: quote.terms_and_conditions || '',
        notes: quote.notes || '',
        items: initialItems,
    });

    // FieldError inline component
    const FieldError = ({ name }: { name: string }) => {
        const pageErrors = (usePage().props as any).errors as Record<string, string> || {};
        const error = validationErrors[name] || pageErrors[name];
        if (!error) return null;
        return <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            {error}
        </p>;
    };

    const pageErrors = (usePage().props as any).errors as Record<string, string> || {};
    const hasFieldError = (name: string) => !!(validationErrors[name] || pageErrors[name]);
    const errorRing = (name: string) => hasFieldError(name) ? 'ring-2 ring-red-400 border-red-300' : '';

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
                setValidationErrors(prev => {
                    const next = { ...prev };
                    delete next['client_name'];
                    delete next['client_email'];
                    return next;
                });
            }
        }
    };

    const setField = (key: string, val: any) => {
        setData(key as any, val);
        setValidationErrors(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unit: 'unit', unit_price: 0, is_optional: false }]);
    };

    const removeItem = (index: number) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const updateItem = (index: number, field: keyof LineItem, value: string | number | boolean) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        setItems(updated);
        setValidationErrors(prev => {
            const next = { ...prev };
            delete next[`items.${index}.${field}`];
            return next;
        });
    };

    const subtotal = useMemo(() => {
        return items.filter(i => !i.is_optional).reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    }, [items]);

    const taxAmount = useMemo(() => subtotal * (data.tax_rate / 100), [subtotal, data.tax_rate]);
    const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);
    const depositAmount = useMemo(() => total * (data.deposit_percentage / 100), [total, data.deposit_percentage]);

    // Validation
    const validate = (): boolean => {
        const errs: Record<string, string> = {};

        if (!data.client_name.trim()) errs.client_name = t('Ce champ est requis');
        if (!data.client_email.trim()) {
            errs.client_email = t('Ce champ est requis');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.client_email)) {
            errs.client_email = t('Adresse e-mail invalide');
        }
        if (!data.title.trim()) errs.title = t('Ce champ est requis');

        items.forEach((item, i) => {
            if (!item.description.trim()) errs[`items.${i}.description`] = t('La description est requise');
            if (item.quantity <= 0) errs[`items.${i}.quantity`] = t('La quantité doit être supérieure à 0');
            if (item.unit_price < 0) errs[`items.${i}.unit_price`] = t('Le prix ne peut pas être négatif');
        });

        setValidationErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // Confirmation if total is 0
        if (total === 0) {
            const ok = await confirm({
                title: t('Total à 0 €'),
                message: t('Le total du devis est de 0 €. Voulez-vous continuer ?'),
                confirmText: t('Continuer'),
                variant: 'warning',
            });
            if (!ok) return;
        }

        router.put(`/admin/quotes/${quote.id}`, { ...data, items } as any, {
            onError: (serverErrors) => {
                // Map server errors so FieldError picks them up
                const mapped: Record<string, string> = {};
                Object.entries(serverErrors).forEach(([key, msg]) => {
                    mapped[key] = msg;
                });
                setValidationErrors(prev => ({ ...prev, ...mapped }));
            },
        });
    };

    const ErrorBanner = () => {
        const allErrors = { ...validationErrors, ...pageErrors };
        return Object.keys(allErrors).length > 0 ? (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                <div>
                    <p className="text-sm font-bold text-red-800 dark:text-red-300">{t('Veuillez corriger les erreurs ci-dessous')}</p>
                </div>
            </div>
        ) : null;
    };

    return (
        <AdminLayout title={t("Edit Quote")} header={t("Edit Quote")}>
            <Head title={t("Edit Quote")} />

            <div className="mb-6">
                <Link href={`/admin/quotes/${quote.id}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Quote")}</Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
                <ErrorBanner />

                {/* Client Selection */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Client Information")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Select Existing Client")}</label>
                            <SearchableSelect
                                value={data.client_id}
                                onChange={(val) => handleClientSelect(val)}
                                placeholder={t("-- Manual entry --")}
                                options={clients.map(c => ({ value: String(c.id), label: `${c.name}${c.company_name ? ` (${c.company_name})` : ''}` }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Link to Lead")}</label>
                            <SearchableSelect
                                value={data.lead_id}
                                onChange={(val) => setField('lead_id', val)}
                                placeholder={t("None")}
                                options={leads.map(l => ({ value: String(l.id), label: `${l.first_name} ${l.last_name}${l.company_name ? ` (${l.company_name})` : ''}` }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Client Name")} *</label>
                            <input type="text" value={data.client_name} onChange={e => setField('client_name', e.target.value)} className={`${inputClass} ${errorRing('client_name')}`} />
                            <FieldError name="client_name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Client Email")} *</label>
                            <input type="email" value={data.client_email} onChange={e => setField('client_email', e.target.value)} className={`${inputClass} ${errorRing('client_email')}`} />
                            <FieldError name="client_email" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Company")}</label>
                            <input type="text" value={data.client_company} onChange={e => setField('client_company', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("VAT Number")}</label>
                            <input type="text" value={data.client_vat} onChange={e => setField('client_vat', e.target.value)} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Address")}</label>
                            <input type="text" value={data.client_address} onChange={e => setField('client_address', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Quote Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Quote Details")}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Title")} *</label>
                            <input type="text" value={data.title} onChange={e => setField('title', e.target.value)} className={`${inputClass} ${errorRing('title')}`} />
                            <FieldError name="title" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Introduction")}</label>
                            <textarea value={data.introduction} onChange={e => setField('introduction', e.target.value)} rows={3} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Scope of Work")}</label>
                            <textarea value={data.scope_of_work} onChange={e => setField('scope_of_work', e.target.value)} rows={4} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Exclusions")}</label>
                            <textarea value={data.exclusions} onChange={e => setField('exclusions', e.target.value)} rows={2} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{t("Line Items")}</h3>
                        <button type="button" onClick={addItem} className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            {t("Add Item")}
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400 w-2/5">{t("Description")}</th>
                                    <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400 w-20">{t("Qty")}</th>
                                    <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400 w-24">{t("Unit")}</th>
                                    <th className="text-left py-2 px-2 font-medium text-gray-500 dark:text-gray-400 w-28">{t("Unit Price")}</th>
                                    <th className="text-right py-2 px-2 font-medium text-gray-500 dark:text-gray-400 w-28">{t("Total")}</th>
                                    <th className="text-center py-2 px-2 font-medium text-gray-500 dark:text-gray-400 w-16">Opt.</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-50 dark:border-gray-700">
                                        <td className="py-2 px-2">
                                            <input type="text" value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} className={`w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-400 focus:ring-teal-400 ${errorRing(`items.${index}.description`)}`} />
                                            <FieldError name={`items.${index}.description`} />
                                        </td>
                                        <td className="py-2 px-2">
                                            <input type="number" value={item.quantity} onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)} className={`w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-400 focus:ring-teal-400 ${errorRing(`items.${index}.quantity`)}`} min="0.01" step="0.01" />
                                            <FieldError name={`items.${index}.quantity`} />
                                        </td>
                                        <td className="py-2 px-2">
                                            <SearchableSelect
                                                value={item.unit}
                                                onChange={(val) => updateItem(index, 'unit', val)}
                                                options={[
                                                    { value: 'unit', label: t("Unit") },
                                                    { value: 'hour', label: t("Hour") },
                                                    { value: 'day', label: t("Day") },
                                                    { value: 'month', label: t("Month") },
                                                    { value: 'piece', label: t("Piece") },
                                                    { value: 'lot', label: t("Lot") },
                                                ]}
                                            />
                                        </td>
                                        <td className="py-2 px-2">
                                            <input type="number" value={item.unit_price} onChange={e => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)} className={`w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-400 focus:ring-teal-400 ${errorRing(`items.${index}.unit_price`)}`} min="0" step="0.01" />
                                            <FieldError name={`items.${index}.unit_price`} />
                                        </td>
                                        <td className="py-2 px-2 text-right font-medium text-gray-900 dark:text-white">
                                            {(item.quantity * item.unit_price).toFixed(2)}
                                        </td>
                                        <td className="py-2 px-2 text-center">
                                            <input type="checkbox" checked={item.is_optional} onChange={e => updateItem(index, 'is_optional', e.target.checked)} className="rounded border-gray-300 text-teal-500 focus:ring-teal-400" />
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

                {/* Settings & Totals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Settings")}</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Tax Rate (%)")}</label>
                                    <input type="number" value={data.tax_rate} onChange={e => setField('tax_rate', parseFloat(e.target.value) || 0)} className={inputClass} min="0" max="100" step="0.01" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Deposit (%)")}</label>
                                    <input type="number" value={data.deposit_percentage} onChange={e => setField('deposit_percentage', parseInt(e.target.value) || 0)} className={inputClass} min="0" max="100" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Valid Until")}</label>
                                <input type="date" value={data.valid_until} onChange={e => setField('valid_until', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Totals")}</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t("Subtotal")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t("Tax")} ({data.tax_rate}%)</span>
                                <span className="font-medium text-gray-900 dark:text-white">{taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
                                <span className="font-semibold text-gray-900 dark:text-white">{t("Total")}</span>
                                <span className="font-bold text-lg text-gray-900 dark:text-white">{total.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3">
                                <span className="text-gray-500 dark:text-gray-400">{t("Deposit")} ({data.deposit_percentage}%)</span>
                                <span className="font-medium text-teal-600">{depositAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms & Notes */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Terms & Notes")}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Terms and Conditions")}</label>
                            <textarea value={data.terms_and_conditions} onChange={e => setField('terms_and_conditions', e.target.value)} rows={4} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Internal Notes")}</label>
                            <textarea value={data.notes} onChange={e => setField('notes', e.target.value)} rows={2} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/quotes/${quote.id}`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        {t("Update Quote")}
                    </button>
                </div>
            </form>
            <ConfirmDialog />
        </AdminLayout>
    );
}
