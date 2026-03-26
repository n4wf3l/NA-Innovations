import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { useState } from 'react';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    action_url?: string;
    created_at: string;
}

interface Props {
    partner: any;
    stats: {
        totalLeads: number;
        wonLeads: number;
        conversionRate: number;
        totalEarned: number;
        totalPaid: number;
        pendingPayout: number;
        estimatedPending: number;
        avgDealSize: number;
        topService: string;
        pipelineCounts: {
            new: number;
            contacted: number;
            brief: number;
            quote: number;
            won: number;
            lost: number;
        };
    };
    recentLeads: any[];
    recentCommissions: any[];
    notifications?: Notification[];
}

export default function PartnerDashboard({ partner, stats, recentLeads, recentCommissions, notifications = [] }: Props) {
    const [copied, setCopied] = useState(false);

    const referralLink = partner.referral_link || `${window.location.origin}?ref=${partner.referral_code}`;

    function copyReferralLink() {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const pipelineStages = [
        { key: 'new', label: 'New', count: stats.pipelineCounts?.new || 0, color: 'bg-violet-500' },
        { key: 'contacted', label: 'Contacted', count: stats.pipelineCounts?.contacted || 0, color: 'bg-blue-500' },
        { key: 'brief', label: 'Brief', count: stats.pipelineCounts?.brief || 0, color: 'bg-indigo-500' },
        { key: 'quote', label: 'Quote', count: stats.pipelineCounts?.quote || 0, color: 'bg-amber-500' },
        { key: 'won', label: 'Won', count: stats.pipelineCounts?.won || 0, color: 'bg-emerald-500' },
        { key: 'lost', label: 'Lost', count: stats.pipelineCounts?.lost || 0, color: 'bg-red-500' },
    ];

    const totalPipelineLeads = pipelineStages.reduce((sum, s) => sum + s.count, 0);

    return (
        <PartnerLayout title="Dashboard">
            <Head title="Partner Dashboard" />

            {/* Notifications */}
            {notifications.length > 0 && (
                <div className="mb-6 space-y-3">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-4 flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-indigo-900">{notification.title}</p>
                                <p className="text-xs text-indigo-700 mt-0.5">{notification.message}</p>
                                <div className="flex items-center space-x-3 mt-2">
                                    {notification.action_url && (
                                        <Link href={notification.action_url} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                                            View details &rarr;
                                        </Link>
                                    )}
                                    <span className="text-xs text-indigo-400">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Hero banner */}
            <div className="animate-slide-up relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 mb-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                    <p className="text-gray-400 text-sm">Welcome back,</p>
                    <h2 className="text-3xl font-black text-white mt-1">{partner.user?.name || 'Partner'}</h2>
                    <div className="mt-4 flex items-center space-x-3">
                        <span className="text-gray-400 text-sm">Your referral code:</span>
                        <span className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-lg font-mono text-sm font-bold text-rose-300 tracking-wider">
                            {partner.referral_code}
                        </span>
                    </div>

                    {/* Copyable Referral Link */}
                    <div className="mt-4">
                        <p className="text-gray-400 text-xs mb-1.5">Your referral link:</p>
                        <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 font-mono truncate">
                                {referralLink}
                            </div>
                            <button
                                onClick={copyReferralLink}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center space-x-1.5 flex-shrink-0"
                            >
                                {copied ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        <span>Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                        </svg>
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats grid */}
            <div className="stagger-children grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{stats.totalLeads}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Leads Sent</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900">{stats.wonLeads} <span className="text-lg text-gray-400 font-normal">({stats.conversionRate}%)</span></p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Leads Won</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900"><ProtectedAmount amount={stats.totalEarned} /></p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Total Earned</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900"><ProtectedAmount amount={stats.pendingPayout} /></p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Pending Payout</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                        </div>
                    </div>
                    <p className="text-3xl font-black text-gray-900"><ProtectedAmount amount={stats.avgDealSize} /></p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Avg Deal Size</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
                        </div>
                    </div>
                    <p className="text-2xl font-black text-gray-900 truncate">{stats.topService}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Top Service</p>
                </div>
            </div>

            {/* Pipeline Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Pipeline Summary</h3>
                {totalPipelineLeads > 0 ? (
                    <>
                        {/* Horizontal bar */}
                        <div className="flex rounded-full overflow-hidden h-4 mb-4">
                            {pipelineStages.map((stage) => {
                                const widthPercent = (stage.count / totalPipelineLeads) * 100;
                                if (widthPercent === 0) return null;
                                return (
                                    <div
                                        key={stage.key}
                                        className={`${stage.color} transition-all`}
                                        style={{ width: `${widthPercent}%` }}
                                        title={`${stage.label}: ${stage.count}`}
                                    />
                                );
                            })}
                        </div>
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                            {pipelineStages.map((stage) => (
                                <div key={stage.key} className="flex items-center space-x-1.5">
                                    <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                                    <span className="text-xs text-gray-600">
                                        {stage.label}: <span className="font-bold text-gray-900">{stage.count}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-gray-400">No leads in the pipeline yet.</p>
                )}
            </div>

            {/* Two columns */}
            <div className="stagger-children grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Leads */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-sm">Recent Leads</h3>
                        <Link href="/partner/leads" className="text-xs text-rose-500 hover:text-rose-600 font-semibold">View all &rarr;</Link>
                    </div>
                    {recentLeads.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                            </div>
                            <p className="text-sm text-gray-400">No leads yet</p>
                            <p className="text-xs text-gray-300 mt-1">Use the button above to submit your first client</p>
                        </div>
                    ) : (
                        <div>
                            {recentLeads.map((lead: any) => (
                                <Link key={lead.id} href={`/partner/leads/${lead.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {lead.first_name[0]}{lead.last_name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{lead.first_name} {lead.last_name}</p>
                                            <p className="text-xs text-gray-400">{lead.company_name || lead.email}</p>
                                        </div>
                                    </div>
                                    <Badge status={lead.status} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Commissions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-sm">Commissions</h3>
                        <Link href="/partner/commissions" className="text-xs text-rose-500 hover:text-rose-600 font-semibold">View all &rarr;</Link>
                    </div>
                    {recentCommissions.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p className="text-sm text-gray-400">No commissions yet</p>
                            <p className="text-xs text-gray-300 mt-1">Submit clients to start earning</p>
                        </div>
                    ) : (
                        <div>
                            {recentCommissions.map((c: any) => (
                                <div key={c.id} className="flex items-center justify-between px-6 py-3.5 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900"><ProtectedAmount amount={c.commission_amount} /></p>
                                        <p className="text-xs text-gray-400">{c.commission_rate}% on <ProtectedAmount amount={c.base_amount} /></p>
                                    </div>
                                    <Badge status={c.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PartnerLayout>
    );
}
