import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { formatDate, formatCurrency, formatStatus } from '@/lib/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CommitList from '@/Components/ui/CommitList';

interface Props {
    project: any;
    quotes: any[];
    invoices: any[];
    services: any[];
    notes: any[];
}

const statusSteps = [
    { key: 'planning', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z' },
    { key: 'in_progress', icon: 'M11.42 15.17l-5.84-5.84a.75.75 0 010-1.06l5.84-5.84a.75.75 0 011.06 0l5.84 5.84a.75.75 0 010 1.06l-5.84 5.84a.75.75 0 01-1.06 0z' },
    { key: 'review', icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' },
    { key: 'completed', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const statusLabels: Record<string, string> = {
    planning: 'Planning',
    in_progress: 'In Progress',
    review: 'Review',
    completed: 'Completed',
};

export default function ClientProjectShow({ project, quotes, invoices, services, notes }: Props) {
    const { t } = useTranslation();
    const [tab, setTab] = useState<'timeline' | 'documents' | 'finances'>('timeline');
    const currentIdx = statusSteps.findIndex(s => s.key === project.status);
    const timelineEvents = project.timeline_events || [];

    const commentForm = useForm({ content: '' });
    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        commentForm.post(`/client/projects/${project.id}/comment`, {
            onSuccess: () => commentForm.reset(),
            preserveScroll: true,
        });
    };

    const pendingQuotes = quotes.filter((q: any) => ['sent', 'viewed'].includes(q.status));
    const unpaidInvoices = invoices.filter((i: any) => ['sent', 'overdue', 'partially_paid'].includes(i.status));
    const totalDue = unpaidInvoices.reduce((s: number, i: any) => s + (i.amount_due || 0), 0);

    return (
        <ClientLayout title={project.nom_societe}>
            <Head title={project.nom_societe} />

            {/* Project header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-white">{project.nom_societe}</h1>
                            <p className="text-teal-200 text-sm mt-1">{project.type_site || project.description?.substring(0, 100)}</p>
                        </div>
                        <Badge status={project.status} className="text-sm" />
                    </div>
                </div>

                {/* Status stepper */}
                <div className="px-6 py-5">
                    <div className="flex items-center">
                        {statusSteps.map((step, i) => (
                            <div key={step.key} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                        i < currentIdx ? 'bg-teal-500 text-white' :
                                        i === currentIdx ? 'bg-teal-500 text-white ring-4 ring-teal-500/20' :
                                        'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                    }`}>
                                        {i < currentIdx ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={step.icon} /></svg>
                                        )}
                                    </div>
                                    <span className={`text-[11px] mt-2 font-semibold ${
                                        i <= currentIdx ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'
                                    }`}>{t(statusLabels[step.key])}</span>
                                </div>
                                {i < statusSteps.length - 1 && (
                                    <div className={`h-0.5 w-full mx-1 rounded ${i < currentIdx ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* KPI bar */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <KPI label={t('Status')} value={t(statusLabels[project.status] || project.status)} />
                    {project.deadline && <KPI label={t('Deadline')} value={formatDate(project.deadline)} />}
                    {project.developer && <KPI label={t('Developer')} value={project.developer.name} />}
                    {totalDue > 0 ? (
                        <KPI label={t('Amount Due')} value={formatCurrency(totalDue)} accent="red" />
                    ) : project.budget ? (
                        <KPI label={t('Budget')} value={formatCurrency(project.budget)} />
                    ) : null}
                </div>
            </div>

            {/* Pending quotes alert */}
            {pendingQuotes.length > 0 && (
                <div className="mb-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 animate-fade-in">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">{t('Quote awaiting your response')}</h4>
                            <p className="text-xs text-amber-700 dark:text-amber-400/70 mt-0.5">{t('Review and accept or reject the quote to proceed')}</p>
                            <div className="mt-3 space-y-2">
                                {pendingQuotes.map((q: any) => (
                                    <Link key={q.id} href={`/client/quotes/${q.id}`}
                                        className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-3 border border-amber-200 dark:border-amber-500/20 hover:border-amber-300 dark:hover:border-amber-500/40 transition-colors">
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{q.quote_number}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{q.title}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(q.total)}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit">
                {(['timeline', 'documents', 'finances'] as const).map(t2 => (
                    <button key={t2} onClick={() => setTab(t2)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                            tab === t2
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                    >
                        {t2 === 'timeline' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        {t2 === 'documents' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
                        {t2 === 'finances' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75" /></svg>}
                        {t(t2 === 'timeline' ? 'Timeline' : t2 === 'documents' ? 'Documents' : 'Finances')}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="animate-fade-in">
                {/* ── TIMELINE ── */}
                {tab === 'timeline' && (
                    <div className="space-y-6">
                        {/* GitHub Commits (only if admin enabled it) */}
                        {project.show_commits_to_client && project.github_repo && (
                            <CommitList projectId={project.id} />
                        )}

                        {/* Comment form */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                            <form onSubmit={handleComment} className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={commentForm.data.content}
                                        onChange={e => commentForm.setData('content', e.target.value)}
                                        placeholder={t('Leave a comment or question...')}
                                        rows={2}
                                        className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-400 resize-none"
                                        required
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button type="submit" disabled={commentForm.processing || !commentForm.data.content.trim()}
                                            className="px-4 py-2 bg-teal-500 text-white text-xs font-bold rounded-lg hover:bg-teal-600 disabled:opacity-30 transition-all">
                                            {commentForm.processing ? t('Sending...') : t('Send')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Timeline events + notes merged */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white">{t('Activity Timeline')}</h3>
                            </div>
                            <div className="p-6">
                                {timelineEvents.length === 0 && notes.length === 0 ? (
                                    <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">{t('No activity yet.')}</p>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                                        <div className="space-y-6">
                                            {timelineEvents.map((event: any) => (
                                                <div key={`te-${event.id}`} className="relative flex items-start ml-4 pl-6">
                                                    <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 ${
                                                        event.event_type === 'comment'
                                                            ? 'bg-blue-500 border-blue-500'
                                                            : event.event_type === 'status_change'
                                                            ? 'bg-teal-500 border-teal-500'
                                                            : 'bg-white dark:bg-gray-800 border-teal-400'
                                                    }`} />
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                                                            <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(event.created_at)}</span>
                                                        </div>
                                                        {event.description && (
                                                            <p className={`text-sm mt-0.5 ${
                                                                event.event_type === 'comment'
                                                                    ? 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 mt-1'
                                                                    : 'text-gray-500 dark:text-gray-400'
                                                            }`}>{event.description}</p>
                                                        )}
                                                        {event.old_value && event.new_value && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge status={event.old_value} />
                                                                <span className="text-gray-300 dark:text-gray-600">→</span>
                                                                <Badge status={event.new_value} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── DOCUMENTS ── */}
                {tab === 'documents' && (
                    <div className="space-y-4">
                        {quotes.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-12 text-center">
                                <p className="text-sm text-gray-400 dark:text-gray-500">{t('No quotes yet.')}</p>
                            </div>
                        ) : (
                            quotes.map((q: any) => (
                                <Link key={q.id} href={`/client/quotes/${q.id}`}
                                    className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md hover:border-teal-300 dark:hover:border-teal-500/50 transition-all group">
                                    <div className="flex items-center justify-between p-5">
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{q.quote_number} — {q.title}</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(q.issue_date)} · {formatCurrency(q.total)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge status={q.status} />
                                            {['sent', 'viewed'].includes(q.status) && (
                                                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full uppercase">{t('Action Required')}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}

                {/* ── FINANCES ── */}
                {tab === 'finances' && (
                    <div className="space-y-6">
                        {/* Summary cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">{t('Total Billed')}</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{formatCurrency(invoices.reduce((s: number, i: any) => s + (i.total || 0), 0))}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">{t('Total Paid')}</p>
                                <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(invoices.reduce((s: number, i: any) => s + (i.amount_paid || 0), 0))}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">{t('Amount Due')}</p>
                                <p className={`text-xl font-black mt-1 ${totalDue > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{formatCurrency(totalDue)}</p>
                            </div>
                        </div>

                        {/* Invoices */}
                        {invoices.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm px-6 py-12 text-center">
                                <p className="text-sm text-gray-400 dark:text-gray-500">{t('No invoices yet.')}</p>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white">{t('Invoices')}</h3>
                                </div>
                                <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                    {invoices.map((inv: any) => (
                                        <Link key={inv.id} href={`/client/invoices/${inv.id}`}
                                            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                    inv.status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-500/10' :
                                                    inv.status === 'overdue' ? 'bg-red-50 dark:bg-red-500/10' :
                                                    'bg-blue-50 dark:bg-blue-500/10'
                                                }`}>
                                                    <svg className={`w-5 h-5 ${
                                                        inv.status === 'paid' ? 'text-emerald-500' :
                                                        inv.status === 'overdue' ? 'text-red-500' :
                                                        'text-blue-500'
                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{inv.invoice_number}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{inv.title} · {t('Due')}: {formatDate(inv.due_date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(inv.total)}</p>
                                                    {inv.amount_due > 0 && <p className="text-xs text-red-500 font-semibold">{t('Due')}: {formatCurrency(inv.amount_due)}</p>}
                                                </div>
                                                <Badge status={inv.status} />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recurring services */}
                        {services.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white">{t('Recurring Services')}</h3>
                                </div>
                                <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                    {services.map((s: any) => (
                                        <div key={s.id} className={`px-6 py-4 flex items-center justify-between ${s.status === 'expiring_soon' ? 'bg-amber-50/50 dark:bg-amber-500/5' : ''}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                    s.status === 'expired' ? 'bg-red-50 dark:bg-red-500/10' :
                                                    s.status === 'expiring_soon' ? 'bg-amber-50 dark:bg-amber-500/10' :
                                                    'bg-teal-50 dark:bg-teal-500/10'
                                                }`}>
                                                    <svg className={`w-5 h-5 ${
                                                        s.status === 'expired' ? 'text-red-500' :
                                                        s.status === 'expiring_soon' ? 'text-amber-500' :
                                                        'text-teal-500'
                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d={
                                                            s.type === 'hosting' ? 'M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z' :
                                                            s.type === 'domain' ? 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418' :
                                                            s.type === 'ssl' ? 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' :
                                                            'M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3'
                                                        } />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                                        {s.provider} · {s.expiry_date ? `${t('Expiry')}: ${formatDate(s.expiry_date)}` : formatStatus(s.frequency)}
                                                        {s.auto_renew && <span className="ml-1 text-teal-500">({t('Auto Renew')})</span>}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge status={s.status} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </ClientLayout>
    );
}

function KPI({ label, value, accent }: { label: string; value: string; accent?: string }) {
    return (
        <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400 block text-xs">{label}</span>
            <span className={`font-bold ${accent === 'red' ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{value}</span>
        </div>
    );
}
