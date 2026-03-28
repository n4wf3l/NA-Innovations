import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';

export interface LineItem {
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    is_optional: boolean;
}

interface Props {
    items: LineItem[];
    addItem: () => void;
    removeItem: (i: number) => void;
    updateItem: (i: number, field: keyof LineItem, val: any) => void;
    subtotal: number;
    tax: number;
    total: number;
    errorRing: (name: string) => string;
    FieldError: React.ComponentType<{ name: string }>;
    validateStep2: () => boolean;
    setStep: (step: number) => void;
    goToStep: (target: number) => void;
    ErrorBanner: React.ComponentType;
}

export default function Step2LineItems({
    items, addItem, removeItem, updateItem,
    subtotal, tax, total,
    errorRing, FieldError, validateStep2, setStep, goToStep, ErrorBanner,
}: Props) {
    const { t } = useTranslation();

    return (
        <div className="space-y-6 animate-page-in">
            <ErrorBanner />
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-sm">{t("Line Items")}</h3>
                        <p className="text-blue-200 text-xs mt-0.5">{t("Add what you're charging for")}</p>
                    </div>
                    <button type="button" onClick={addItem} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-colors">
                        + {t("Add Item")}
                    </button>
                </div>
                <div className="p-6 space-y-3">
                    {items.map((item, i) => (
                        <div key={i} className={`rounded-xl border p-4 transition-all ${item.is_optional ? 'border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/30' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                            <div className="grid grid-cols-12 gap-3 items-end">
                                <div className="col-span-12 sm:col-span-5">
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t("Description")}</label>
                                    <input type="text" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)}
                                        className={`w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-400 ${errorRing(`items.${i}.description`)}`} placeholder="Development service..." />
                                    <FieldError name={`items.${i}.description`} />
                                </div>
                                <div className="col-span-4 sm:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t("Qty")}</label>
                                    <input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)}
                                        className={`w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-400 ${errorRing(`items.${i}.quantity`)}`} min="0.01" step="0.01" />
                                    <FieldError name={`items.${i}.quantity`} />
                                </div>
                                <div className="col-span-4 sm:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t("Price")}</label>
                                    <input type="number" value={item.unit_price} onChange={e => updateItem(i, 'unit_price', parseFloat(e.target.value) || 0)}
                                        className={`w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-blue-400 ${errorRing(`items.${i}.unit_price`)}`} min="0" step="0.01" />
                                    <FieldError name={`items.${i}.unit_price`} />
                                </div>
                                <div className="col-span-4 sm:col-span-2 text-right">
                                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{t("Total")}</label>
                                    <p className="py-2.5 text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(item.quantity * item.unit_price)}</p>
                                </div>
                                <div className="col-span-12 sm:col-span-1 flex items-end justify-end space-x-2">
                                    <button type="button" onClick={() => updateItem(i, 'is_optional', !item.is_optional)}
                                        className={`px-2 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${item.is_optional ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}
                                        title={t("Toggle optional")}>OPT</button>
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

                {/* Totals bar */}
                <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="text-xs text-gray-400 dark:text-gray-500">{items.length} item{items.length > 1 ? 's' : ''} · {items.filter(i => i.is_optional).length} {t("Optional").toLowerCase()}</p>
                        <div className="flex items-center space-x-6 text-sm">
                            <span className="text-gray-500 dark:text-gray-400">{t("Subtotal")}: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span></span>
                            <span className="text-gray-500 dark:text-gray-400">{t("Tax")}: <span className="font-medium">{formatCurrency(tax)}</span></span>
                            <span className="text-gray-900 dark:text-white font-black text-lg">{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button type="button" onClick={() => goToStep(1)} className="px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{'\u2190'} {t("Back")}</button>
                <button type="button" onClick={() => { if (validateStep2()) setStep(3); }} className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
                    {t("Next")}: {t("Settings & Review")} →
                </button>
            </div>
        </div>
    );
}
