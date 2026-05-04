import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
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
    hasTestimonial: boolean;
}

export default function ClientDashboard({ projects = [], quotes = [], invoices = [], sentEmails = [], stats, hasTestimonial }: Props) {
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

            {/* Action required banner - aggregates projects needing client input */}
            {projects.some((p: any) => p.client_action_required) && (
                <div className="mb-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 border-2 border-orange-300 dark:border-orange-500/40 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-black text-orange-900 dark:text-orange-200">{t('Action attendue de votre part')}</h3>
                            <p className="text-xs text-orange-800 dark:text-orange-300/90 mt-1">{t('Notre équipe attend un retour pour avancer sur ces projets :')}</p>
                            <div className="mt-3 space-y-2">
                                {projects.filter((p: any) => p.client_action_required).map((p: any) => (
                                    <Link key={p.id} href={`/client/projects/${p.id}`} className="flex items-start justify-between gap-3 bg-white/80 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 rounded-xl p-3 border border-orange-200 dark:border-orange-500/30 transition-colors">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{p.nom_societe}</p>
                                            {p.client_action_message && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">{p.client_action_message}</p>
                                            )}
                                        </div>
                                        <svg className="w-4 h-4 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Financial summary */}
            {(stats.totalDue > 0 || invoices.length > 0) && (
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
                        {t('Vue financière globale')}
                    </h3>
                    {(() => {
                        const totalBilled = invoices.reduce((s: number, i: any) => s + (Number(i.total) || 0), 0);
                        const totalPaid = totalBilled - stats.totalDue;
                        return (
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{t('Facturé')}</p>
                                    <p className="text-lg font-black text-gray-900 dark:text-white mt-1">{formatCurrency(totalBilled)}</p>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4">
                                    <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{t('Payé')}</p>
                                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(totalPaid)}</p>
                                </div>
                                <div className={`${stats.totalDue > 0 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-50 dark:bg-gray-700/30'} rounded-xl p-4`}>
                                    <p className={`text-[10px] font-semibold uppercase tracking-wider ${stats.totalDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400'}`}>{t('Restant dû')}</p>
                                    <p className={`text-lg font-black mt-1 ${stats.totalDue > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{formatCurrency(stats.totalDue)}</p>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

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
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{q.quote_number} - {q.title}</p>
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

                {/* Testimonial */}
                {!hasTestimonial && (
                    <div className="lg:col-span-2 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-500/5 dark:to-pink-500/5 rounded-2xl border border-rose-200 dark:border-rose-500/20 p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{t('Share your experience')}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('Your feedback helps us improve and inspires future clients.')}</p>
                                <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget); router.post('/client/testimonial', { message: fd.get('message'), rating: fd.get('rating') }); }} className="space-y-3">
                                    {/* Stars */}
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <label key={star} className="cursor-pointer">
                                                <input type="radio" name="rating" value={star} className="sr-only peer" />
                                                <svg className="w-6 h-6 text-gray-300 dark:text-gray-600 peer-checked:text-amber-400 hover:text-amber-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                </svg>
                                            </label>
                                        ))}
                                    </div>
                                    <textarea name="message" required rows={2} maxLength={1000} className="w-full rounded-xl border border-rose-200 dark:border-rose-500/20 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-400 focus:border-transparent placeholder-gray-400" placeholder={t('What did you appreciate about working with us?')} />
                                    <button type="submit" className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
                                        {t('Submit testimonial')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                {hasTestimonial && (
                    <div className="lg:col-span-2 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 p-5 flex items-center gap-3">
                        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">{t('Thank you! Your testimonial has been submitted.')}</p>
                    </div>
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
