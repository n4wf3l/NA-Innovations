import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PartnerSettingsTabs from '@/Components/Admin/PartnerSettingsTabs';

interface RateItem {
    value: string;
    label: string;
    commission_rate: number;
}

interface Props {
    rates: RateItem[];
}

function getBarColor(rate: number): { bg: string; text: string; border: string } {
    if (rate >= 15) return { bg: 'bg-green-500', text: 'text-green-700 dark:text-green-400', border: 'border-green-200 dark:border-green-800' };
    if (rate >= 10) return { bg: 'bg-teal-500', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800' };
    if (rate >= 8) return { bg: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' };
    return { bg: 'bg-red-500', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-800' };
}

export default function CommissionRates({ rates: initialRates }: Props) {
    const { t } = useTranslation();
    const [rates, setRates] = useState(initialRates);
    const [processing, setProcessing] = useState(false);

    const updateRate = (index: number, newRate: number) => {
        setRates(prev => prev.map((item, i) => i === index ? { ...item, commission_rate: newRate } : item));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.put('/admin/settings/commission-rates', {
            rates: rates.map(r => ({ type: r.value, rate: r.commission_rate })),
        }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title={t('Gestion partenaires')} header={t('Gestion partenaires')}>
            <Head title={t('Taux de commission')} />

            <div className="space-y-6">
                <PartnerSettingsTabs active="commission-rates" />
            <div className="space-y-8">

                {/* Banner */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 sm:p-10 text-white shadow-lg">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                        {t('Taux de commission par type de projet')}
                    </h1>
                    <p className="text-violet-100 text-lg leading-relaxed max-w-2xl">
                        {t('Ces taux s\'appliquent automatiquement lors du calcul des commissions des partenaires.')}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {rates.map((item, index) => {
                            const color = getBarColor(item.commission_rate);
                            const barWidth = Math.min((item.commission_rate / 20) * 100, 100);

                            return (
                                <div
                                    key={item.value}
                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 sm:p-6"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        {/* Label */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {t(item.label)}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {item.value}
                                            </p>
                                        </div>

                                        {/* Input */}
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.5"
                                                value={item.commission_rate}
                                                onChange={(e) => updateRate(index, parseFloat(e.target.value) || 0)}
                                                className="w-20 text-right px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-semibold focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                            />
                                            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">%</span>
                                        </div>
                                    </div>

                                    {/* Visual bar */}
                                    <div className="mt-4">
                                        <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${color.bg} rounded-full transition-all duration-300`}
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1.5">
                                            <span className={`text-xs font-medium ${color.text}`}>
                                                {item.commission_rate}%
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                max 20%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Submit button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                        >
                            {processing && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {t('Enregistrer')}
                        </button>
                    </div>
                </form>

            </div>
            </div>
        </AdminLayout>
    );
}
