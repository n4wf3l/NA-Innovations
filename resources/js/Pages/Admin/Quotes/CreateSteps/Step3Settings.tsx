import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';
import SignaturePad from '@/Components/ui/SignaturePad';
import LocalePicker from '@/Components/ui/LocalePicker';

interface Props {
    form: {
        tax_rate: number;
        deposit_percentage: number;
        valid_until: string;
        locale: string;
        terms_and_conditions: string;
        notes: string;
        title: string;
        client_name: string;
        client_company: string;
    };
    set: (key: string, val: any) => void;
    subtotal: number;
    tax: number;
    total: number;
    deposit: number;
    items: any[];
    submitting: boolean;
    includeSignature: boolean;
    setIncludeSignature: (v: boolean) => void;
    signatureData: string | null;
    setSignatureData: (v: string | null) => void;
    savedSignature?: string | null;
    input: string;
    label: string;
    goToStep: (target: number) => void;
    ErrorBanner: React.ComponentType;
}

export default function Step3Settings({
    form, set, subtotal, tax, total, deposit, items, submitting,
    includeSignature, setIncludeSignature, signatureData, setSignatureData, savedSignature,
    input, label, goToStep, ErrorBanner,
}: Props) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 animate-page-in">
            <ErrorBanner />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Settings */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{t("Settings")}</h3>
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
                            <LocalePicker value={form.locale} onChange={val => set('locale', val)} label={t("Document & Email Language")} />
                        </div>
                        <div>
                            <label className={label}>{t("Terms & Conditions")}</label>
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
                        <p className="text-lg font-bold">{form.title || t('Untitled Quote')}</p>
                        <p className="text-gray-400 text-sm mt-1">{form.client_name} {form.client_company ? `· ${form.client_company}` : ''}</p>

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
                                <span className="text-teal-300">{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>{t("Deposit")} ({form.deposit_percentage}%)</span>
                                <span>{formatCurrency(deposit)}</span>
                            </div>
                        </div>

                        <div className="mt-4 text-xs text-gray-500">{items.length} {t("Line Items").toLowerCase()}</div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col space-y-3">
                        <button type="submit" disabled={submitting}
                            className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-black text-base rounded-xl shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center">
                            {submitting ? (
                                <><svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Creating...')}</>
                            ) : t('Create Quote')}
                        </button>
                        <button type="button" onClick={() => goToStep(2)} className="w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{'\u2190'} {t("Back to")} {t("Line Items")}</button>
                        <Link href="/admin/quotes" className="w-full py-3 text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-center">{t('Cancel')}</Link>
                    </div>
                </div>
            </div>

            {/* Signature section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t('Signature')}</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{t('Include your signature on the PDF document')}</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={includeSignature}
                            onChange={e => setIncludeSignature(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                    </label>
                </div>
                {includeSignature && (
                    <div className="p-6">
                        {savedSignature && !signatureData ? (
                            <div className="text-center py-4">
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{t('Your saved signature will be used')}</p>
                                <img src={savedSignature} alt="Signature" className="max-h-20 mx-auto mb-3 opacity-70" />
                                <button type="button" onClick={() => setSignatureData(null)} className="text-xs text-teal-500 hover:text-teal-600 font-medium">{t('Draw a new signature')}</button>
                            </div>
                        ) : (
                            <SignaturePad
                                value={signatureData}
                                onChange={setSignatureData}
                                height={160}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
