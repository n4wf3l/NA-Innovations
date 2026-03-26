import { useState } from 'react';
import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { PaginatedData, Lead } from '@/types';
import { formatDate } from '@/lib/utils';

interface Props {
    leads: PaginatedData<Lead>;
    commissionRate: number;
}

export default function PartnerLeadsIndex({ leads, commissionRate }: Props) {
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
                        Your commission rate: <span className="font-bold text-rose-500">{commissionRate}%</span>
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setView('cards')}
                        className={`p-2 rounded-lg transition-colors ${view === 'cards' ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 border border-gray-200 hover:text-gray-600'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-gray-900 text-white' : 'bg-white text-gray-400 border border-gray-200 hover:text-gray-600'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                        </svg>
                    </button>
                </div>
            </div>

            {leads.data.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No leads yet</p>
                    <p className="text-sm text-gray-400 mt-1">Use the "Submit a Client" button to get started</p>
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
                                    className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
                                >
                                    {/* Top: name + badge */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                                                {lead.first_name[0]}{lead.last_name[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{lead.first_name} {lead.last_name}</p>
                                                {lead.company_name && (
                                                    <p className="text-xs text-gray-400">{lead.company_name}</p>
                                                )}
                                            </div>
                                        </div>
                                        <Badge status={lead.status} />
                                    </div>

                                    {/* Service */}
                                    {lead.service_interest && (
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-1">{lead.service_interest}</p>
                                    )}

                                    {/* Bottom: commission + date */}
                                    <div className="border-t border-gray-50 pt-3 flex items-end justify-between">
                                        <div>
                                            {myShare(lead.estimated_budget) ? (
                                                <>
                                                    <p className="text-xl font-black text-gray-900">
                                                        <ProtectedAmount amount={myShare(lead.estimated_budget)!} />
                                                    </p>
                                                    <p className="text-[11px] text-gray-400">
                                                        Your share ({commissionRate}% of <ProtectedAmount amount={lead.estimated_budget!} />)
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-gray-300">No budget set</p>
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
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Company</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Service</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Share</th>
                                            <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Project Value</th>
                                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {leads.data.map(lead => (
                                            <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <Link href={`/partner/leads/${lead.id}`} className="flex items-center space-x-3 group">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                                                            {lead.first_name[0]}{lead.last_name[0]}
                                                        </div>
                                                        <span className="font-medium text-gray-900 group-hover:text-rose-600 transition-colors">
                                                            {lead.first_name} {lead.last_name}
                                                        </span>
                                                    </Link>
                                                </td>
                                                <td className="px-5 py-3.5 text-gray-500">{lead.company_name || '—'}</td>
                                                <td className="px-5 py-3.5 text-gray-500">{lead.service_interest || '—'}</td>
                                                <td className="px-5 py-3.5"><Badge status={lead.status} /></td>
                                                <td className="px-5 py-3.5 text-right">
                                                    {myShare(lead.estimated_budget) ? (
                                                        <span className="font-bold text-gray-900"><ProtectedAmount amount={myShare(lead.estimated_budget)!} /></span>
                                                    ) : (
                                                        <span className="text-gray-300">—</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5 text-right text-gray-400 text-xs">
                                                    {lead.estimated_budget ? <ProtectedAmount amount={lead.estimated_budget} /> : '—'}
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
