import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

type TabKey = 'emails' | 'brochure' | 'document-templates';

interface Props {
    active: TabKey;
}

export default function AdminManagementTabs({ active }: Props) {
    const { t } = useTranslation();

    const tabs: { key: TabKey; href: string; label: string; icon: JSX.Element }[] = [
        {
            key: 'emails',
            href: '/admin/settings/email-templates',
            label: t('Emails'),
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
            ),
        },
        {
            key: 'brochure',
            href: '/admin/settings/brochure',
            label: t('Brochure'),
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            ),
        },
        {
            key: 'document-templates',
            href: '/admin/settings/document-templates',
            label: t('Modèles documents'),
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H6a2.25 2.25 0 00-2.25 2.25v7.5a2.25 2.25 0 002.25 2.25h9.75zM8.25 6.108V8.25m0 0H5.625c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V15M12 10.5h3" />
                </svg>
            ),
        },
    ];

    return (
        <div className="max-w-6xl mx-auto mb-6">
            <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('Gestion admin')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('Emails transactionnels, brochure commerciale et modèles de documents.')}</p>
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
                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-sm'
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
