import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { PaginatedData, Lead } from '@/types';
import { formatDate, formatProjectType } from '@/lib/utils';

interface Props {
    leads: PaginatedData<Lead>;
    commissionRate: number;
}

export default function PartnerLeadsIndex({ leads, commissionRate }: Props) {
    const { t } = useTranslation();
    const [view, setView] = useState<'list' | 'cards'>('cards');

    const myShare = (budget: number | null | undefined) => {
        if (!budget) return null;
        return budget * (commissionRate / 100);
    };

    return (
        <PartnerLayout title="My Leads">
            <Head title="My Leads" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-sm text-gray-400">
                        {t('Your commission rate')}: <span className="font-bold text-rose-500">{commissionRate}%</span>
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setView('cards')}
                        className={`p-2 rounded-lg transition-colors ${view === 'cards' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-600 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-600 hover:text-gray-600 dark:hover:text-gray-300'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {leads.data.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{t('No leads yet.')}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('Use the "Submit a Client" button to get started')}</p>
                </div>
            ) : (
                <>
                    {/* Cards View */}
                    {view === 'cards' && (
                        <div className="stagger-children grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {leads.data.map(lead => (
                                <Link
                                    key={lead.id}
                                    href={`/partner/leads/${lead.id}`}
                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 group"
                                >
                                    {/* Top: name + badge */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/30 group-hover:text-rose-500 transition-colors">
                                                {lead.first_name[0]}{lead.last_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm">{lead.first_name} {lead.last_name}</p>
                                                {lead.company_name && (
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{lead.company_name}</p>
                                                )}
                                            </div>
                                        </div>
                                        <Badge status={lead.status} />
                                    </div>

                                    {/* Contact links */}
                                    <div className="flex flex-wrap gap-3 mb-3">
                                        {lead.email && (
                                            <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-500 transition-colors">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                                {lead.email}
                                            </a>
                                        )}
                                        {lead.phone && (
                                            <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-500 transition-colors">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                                                {lead.phone}
                                            </a>
                                        )}
                                    </div>

                                    {/* Service */}
                                    {lead.service_interest && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-1">{formatProjectType(lead.service_interest)}</p>
                                    )}

                                    {/* "Hands-off" banner - shown only when the client has accepted
                                        and the project has moved forward (NA handles everything) */}
                                    {['signed', 'in_progress', 'won', 'paid'].includes(lead.status) && (
                                        <div className="mb-4 flex items-start gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl px-3 py-2.5">
                                            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                            </svg>
                                            <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
                                                <strong className="font-bold">{t('Vous n\'avez plus rien à faire.')}</strong> {t('NA Innovations gère tout. Vous serez payé automatiquement à la fin du projet.')}
                                            </p>
                                        </div>
                                    )}

                                    {/* Bottom: commission + date */}
                                    <div className="border-t border-gray-50 dark:border-gray-700 pt-3 flex items-end justify-between">
                                        <div>
                                            {myShare(lead.estimated_budget) ? (
                                                <>
                                                    <p className="text-xl font-black text-gray-900 dark:text-white">
                                                        <ProtectedAmount amount={myShare(lead.estimated_budget)!} />
                                                    </p>
                                                    <p className="text-[11px] text-gray-400">
                                                        {t('Your share')} ({commissionRate}% {t('of')} <ProtectedAmount amount={lead.estimated_budget!} />)
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-300">{t('No budget set')}</p>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400">{formatDate(lead.created_at)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* List View */}
                    {view === 'list' && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-700">
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Name')}</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Company')}</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Service')}</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Status')}</th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Your Share')}</th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Project Value')}</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t('Date')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                        {leads.data.map(lead => (
                                            <tr key={lead.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <Link href={`/partner/leads/${lead.id}`} className="flex items-center space-x-3 group">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/30 group-hover:text-rose-500 transition-colors">
                                                            {lead.first_name[0]}{lead.last_name[0]}
                                                        </div>
                                                        <span className="font-medium text-gray-900 dark:text-white group-hover:text-rose-600 transition-colors">
                                                            {lead.first_name} {lead.last_name}
                                                        </span>
                                                    </Link>
                                                </td>
                                                <td className="px-5 py-3.5 text-gray-500">{lead.company_name || '-'}</td>
                                                <td className="px-5 py-3.5 text-gray-500">{formatProjectType(lead.service_interest)}</td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex flex-col gap-1">
                                                        <Badge status={lead.status} />
                                                        {['signed', 'in_progress', 'won', 'paid'].includes(lead.status) && (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400" title={t('Vous n\'avez plus rien à faire. NA Innovations gère tout.')}>
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                                {t('Géré par NA')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    {myShare(lead.estimated_budget) ? (
                                                        <span className="font-bold text-gray-900 dark:text-white"><ProtectedAmount amount={myShare(lead.estimated_budget)!} /></span>
                                                    ) : (
                                                        <span className="text-gray-300">-</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5 text-right text-gray-400 text-xs">
                                                    {lead.estimated_budget ? <ProtectedAmount amount={lead.estimated_budget} /> : '-'}
                                                </td>
                                                <td className="px-5 py-3.5 text-gray-400">{formatDate(lead.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <Pagination links={leads.links} />
                    </div>
                </>
            )}
        </PartnerLayout>
    );
}
