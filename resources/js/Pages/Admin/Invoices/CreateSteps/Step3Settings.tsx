import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import LocalePicker from '@/Components/ui/LocalePicker';

interface Props {
    form: {
        locale: string;
        payment_instructions: string;
        notes: string;
        title: string;
        client_name: string;
        client_company: string;
        type: string;
        tax_rate: number;
        issue_date: string;
        due_date: string;
    };
    set: (key: string, val: any) => void;
    subtotal: number;
    tax: number;
    total: number;
    items: any[];
    submitting: boolean;
    input: string;
    label: string;
    goToStep: (target: number) => void;
    ErrorBanner: React.ComponentType;
}

export default function Step3Settings({
    form, set, subtotal, tax, total, items, submitting,
    input, label, goToStep, ErrorBanner,
}: Props) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 animate-page-in">
            <ErrorBanner />
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
                        <button type="button" onClick={() => goToStep(2)} className="w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{'\u2190'} {t("Back to")} {t("Line Items")}</button>
                        <Link href="/admin/invoices" className="w-full py-3 text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-center">{t('Cancel')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
