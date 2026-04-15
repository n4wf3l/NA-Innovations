import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

type TabKey = 'commission-rates' | 'prospecting-email-templates' | 'partner-faqs';

interface Props {
    active: TabKey;
}

export default function PartnerSettingsTabs({ active }: Props) {
    const { t } = useTranslation();

    const tabs: { key: TabKey; href: string; label: string; icon: JSX.Element }[] = [
        {
            key: 'commission-rates',
            href: '/admin/settings/commission-rates',
            label: t('Taux de commission'),
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0l-4.725 2.885a.562.562 0 01-.84-.61l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            ),
        },
        {
            key: 'prospecting-email-templates',
            href: '/admin/settings/prospecting-email-templates',
            label: t('Templates de prospection'),
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
            ),
        },
        {
            key: 'partner-faqs',
            href: '/admin/settings/partner-faqs',
            label: t('FAQ partenaires'),
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="mb-6">
            <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('Gestion partenaires')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('Commissions, templates de prospection et FAQ des partenaires.')}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-1.5 flex gap-1 overflow-x-auto">
                {tabs.map(tab => {
                    const isActive = tab.key === active;
                    return (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            preserveScroll={false}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                                isActive
                                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
