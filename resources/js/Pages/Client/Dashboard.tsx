import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Badge from '@/Components/ui/Badge';
import { formatDate, formatCurrency, formatProjectType } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import GuidedTour, { TourTriggerButton } from '@/Components/ui/GuidedTour';
import { useTour } from '@/hooks/useTour';
import { clientDashboardSteps } from '@/data/tourSteps';

interface Props {
    projects: any[];
    quotes: any[];
    invoices: any[];
    sentEmails: any[];
    stats: {
        activeProjects: number;
        totalProjects: number;
        pendingQuotes: number;
        unpaidInvoices: number;
        totalDue: number;
    };
}

export default function ClientDashboard({ projects, quotes, invoices, sentEmails = [], stats }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const tour = useTour('client_dashboard', clientDashboardSteps.length);

    return (
        <ClientLayout title={t("Dashboard")}>
            <Head title={t("Client Dashboard")} />

            <GuidedTour
                steps={clientDashboardSteps}
                isActive={tour.isActive}
                currentStep={tour.currentStep}
                onNext={tour.next}
                onPrev={tour.prev}
                onSkip={tour.skip}
                onDismiss={tour.dismiss}
                accentColor="teal"
            />
            <TourTriggerButton onClick={tour.restart} accentColor="teal" />

            {/* Welcome banner */}
            <div data-tour="welcome-banner" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700 p-8 mb-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                    <p className="text-teal-200 text-sm">{t('Welcome back')}</p>
                    <h2 className="text-3xl font-black text-white mt-1">{auth.user?.name}</h2>
                    <p className="text-teal-200 text-sm mt-2">{t('Track your projects, quotes and invoices')}</p>
                </div>
            </div>

            {/* Stats */}
            <div data-tour="stats-grid" className="stagger-children grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatBox icon="folder" label={t('Active Projects')} value={stats.activeProjects} color="emerald" />
                <StatBox icon="doc" label={t('Pending Quotes')} value={stats.pendingQuotes} color="amber" />
                <StatBox icon="invoice" label={t('Unpaid Invoices')} value={stats.unpaidInvoices} color="red" />
                <StatBox icon="money" label={t('Amount Due')} value={formatCurrency(stats.totalDue)} color="blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects */}
                <div data-tour="recent-projects" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white">{t('Projects')}</h3>
                        <Link href="/client/projects" className="text-xs text-teal-500 font-semibold hover:text-teal-600">{t('View all')} &rarr;</Link>
                    </div>
                    {projects.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('No projects yet.')}</div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-700">
                            {projects.map((p: any) => (
                                <Link key={p.id} href={`/client/projects/${p.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.nom_societe}</p>
                                        <p className="text-xs text-gray-400">{formatProjectType(p.type_site)}</p>
                                    </div>
                                    <Badge status={p.status} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Invoices */}
                <div data-tour="recent-invoices" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white">{t('Invoices')}</h3>
                        <Link href="/client/invoices" className="text-xs text-teal-500 font-semibold hover:text-teal-600">{t('View all')} &rarr;</Link>
                    </div>
                    {invoices.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('No invoices yet.')}</div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-700">
                            {invoices.map((inv: any) => (
                                <Link key={inv.id} href={`/client/invoices/${inv.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{inv.invoice_number}</p>
                                        <p className="text-xs text-gray-400">{inv.title} · {formatDate(inv.due_date)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge status={inv.status} />
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(inv.total)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quotes */}
                <div data-tour="quotes-section" className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white">{t('Quotes')}</h3>
                        <Link href="/client/quotes" className="text-xs text-teal-500 font-semibold hover:text-teal-600">{t('View all')} &rarr;</Link>
                    </div>
                    {quotes.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('No quotes yet.')}</div>
                    ) : (
                        <div className="divide-y divide-gray-50 dark:divide-gray-700">
                            {quotes.map((q: any) => (
                                <Link key={q.id} href={`/client/quotes/${q.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{q.quote_number} — {q.title}</p>
                                        <p className="text-xs text-gray-400">{t('Valid Until')}: {q.valid_until ? formatDate(q.valid_until) : '--'}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge status={q.status} />
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(q.total)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sent Emails */}
                {sentEmails.length > 0 && (
                    <SentEmailsSection emails={sentEmails} />
                )}
            </div>
        </ClientLayout>
    );
}

function SentEmailsSection({ emails }: { emails: any[] }) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState<number | null>(null);

    return (
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <h3 className="font-bold text-gray-900 dark:text-white">{t('Emails reçus')}</h3>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                {emails.map((email: any) => (
                    <div key={email.id}>
                        <button
                            onClick={() => setExpanded(expanded === email.id ? null : email.id)}
                            className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${email.status === 'sent' ? 'bg-emerald-500' : email.status === 'failed' ? 'bg-red-500' : 'bg-gray-400'}`} />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{email.subject}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{email.sent_at ? formatDate(email.sent_at) : '--'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                    email.status === 'sent' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                    email.status === 'failed' ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                                    'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                }`}>{email.status}</span>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform ${expanded === email.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </button>
                        {expanded === email.id && email.body && (
                            <div className="px-6 pb-4">
                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                                    {email.body}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatBox({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
    const colors: Record<string, string> = {
        emerald: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10',
        amber: 'bg-amber-50 text-amber-500 dark:bg-amber-500/10',
        red: 'bg-red-50 text-red-500 dark:bg-red-500/10',
        blue: 'bg-blue-50 text-blue-500 dark:bg-blue-500/10',
    };
    const icons: Record<string, string> = {
        folder: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
        doc: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
        invoice: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75',
        money: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    };
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icons[icon]} /></svg>
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider font-semibold">{label}</p>
        </div>
    );
}
