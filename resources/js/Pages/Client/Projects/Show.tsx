import ClientLayout from '@/Layouts/ClientLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { formatDate, formatCurrency, formatStatus, formatProjectType } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageProps } from '@/types';

interface TechDoc {
    id: number;
    title: string;
    content: string;
    category: string | null;
    is_client_visible: boolean;
    created_at: string;
    updated_at: string;
    author?: { id: number; name: string };
}

interface Props {
    project: any;
    quotes: any[];
    invoices: any[];
    services: any[];
    notes: any[];
    projectDocuments: any[];
    attachments: any[];
    techDocs: TechDoc[];
    hasTestimonial?: boolean;
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

const techDocCategoryColors: Record<string, string> = {
    architecture: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    api: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    deployment: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    database: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    setup: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const techDocCategoryLabels: Record<string, string> = {
    architecture: 'Architecture',
    api: 'API',
    deployment: 'Deployment',
    database: 'Database',
    setup: 'Setup',
    other: 'Other',
};

export default function ClientProjectShow({ project, quotes, invoices, services, notes, projectDocuments, attachments = [], techDocs = [], hasTestimonial = false }: Props) {
    const { t } = useTranslation();
    const { financialUnlocked } = usePage<PageProps>().props;
    const [tab, setTab] = useState<'timeline' | 'documents' | 'finances'>('timeline');
    const [expandedTechDocId, setExpandedTechDocId] = useState<number | null>(null);
    const currentIdx = statusSteps.findIndex(s => s.key === project.status);
    const timelineEvents = project.timeline_events || [];

    // Fetch GitHub commits and merge with timeline
    interface UnifiedEntry {
        id: string;
        type: 'event' | 'commit' | 'comment';
        date: string;
        title: string;
        description?: string;
        eventType?: string;
        oldValue?: string;
        newValue?: string;
        // commit-specific
        hash?: string;
        authorName?: string;
        authorAvatar?: string | null;
    }

    const [commits, setCommits] = useState<any[]>([]);
    const [commitsLoading, setCommitsLoading] = useState(false);

    useEffect(() => {
        if (project.show_commits_to_client && project.github_repo) {
            setCommitsLoading(true);
            fetch(`/api/projects/${project.id}/commits`)
                .then(r => r.json())
                .then(data => setCommits(data.commits || []))
                .catch(() => {})
                .finally(() => setCommitsLoading(false));
        }
    }, [project.id]);

    // Merge timeline events + commits into one chronological list
    const unifiedTimeline: UnifiedEntry[] = [
        ...timelineEvents.map((e: any) => ({
            id: `te-${e.id}`,
            type: (e.event_type === 'comment' ? 'comment' : 'event') as UnifiedEntry['type'],
            date: e.created_at,
            title: e.title,
            description: e.description,
            eventType: e.event_type,
            oldValue: e.old_value,
            newValue: e.new_value,
        })),
        ...commits.map((c: any) => ({
            id: `commit-${c.hash}`,
            type: 'commit' as UnifiedEntry['type'],
            date: c.date,
            title: c.message,
            hash: c.hash,
            authorName: c.author_name,
            authorAvatar: c.author_avatar,
        })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

            {/* Expired/Suspended Service Alert */}
            {services.filter((s: any) => s.status === 'expired' || s.status === 'suspended').map((s: any) => (
                <div key={s.id} className={`rounded-2xl border p-4 flex items-start gap-3 mb-4 ${
                    s.status === 'suspended'
                        ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
                        : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
                }`}>
                    <svg className={`w-6 h-6 flex-shrink-0 mt-0.5 ${s.status === 'suspended' ? 'text-red-500' : 'text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <div>
                        <p className={`text-sm font-bold ${s.status === 'suspended' ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                            {s.status === 'suspended' ? t('Service suspendu') : t('Service expiré')} — {s.name}
                        </p>
                        <p className={`text-xs mt-1 ${s.status === 'suspended' ? 'text-red-600/80 dark:text-red-300/80' : 'text-amber-600/80 dark:text-amber-300/80'}`}>
                            {t('Veuillez nous contacter pour renouveler votre service et réactiver votre projet.')}
                        </p>
                    </div>
                </div>
            ))}

            {/* Project header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-black text-white">{project.nom_societe}</h1>
                            <p className="text-teal-200 text-sm mt-1">{formatProjectType(project.type_site) !== '--' ? formatProjectType(project.type_site) : project.description?.substring(0, 100)}</p>
                        </div>
                        <Badge status={project.status} className="text-sm" />
                    </div>
                </div>

                {/* Status stepper */}
                <div className="px-6 py-6">
                    {/* Circles + connectors */}
                    <div className="flex items-center">
                        {statusSteps.map((step, i) => (
                            <div key={step.key} className="flex items-center flex-1 last:flex-none">
                                {/* Circle */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                    i < currentIdx ? 'bg-teal-500 text-white' :
                                    i === currentIdx ? 'bg-teal-500 text-white ring-4 ring-teal-500/20' :
                                    'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                }`}>
                                    {i < currentIdx ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={step.icon} /></svg>
                                    )}
                                </div>
                                {/* Connector line */}
                                {i < statusSteps.length - 1 && (
                                    <div className={`h-0.5 flex-1 mx-2 rounded ${i < currentIdx ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Labels below */}
                    <div className="flex mt-2">
                        {statusSteps.map((step, i) => (
                            <div key={step.key} className={`flex-1 ${i === statusSteps.length - 1 ? 'flex-none' : ''}`}>
                                <span className={`text-[11px] font-semibold ${
                                    i <= currentIdx ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'
                                } ${i === 0 ? '' : i === statusSteps.length - 1 ? 'ml-[-12px]' : 'ml-[-8px]'}`}>
                                    {t(statusLabels[step.key])}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KPI bar */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <KPI label={t('Status')} value={t(statusLabels[project.status] || project.status)} />
                    {project.deadline && <KPI label={t('Deadline')} value={formatDate(project.deadline)} />}
                    {project.developer && <KPI label={t('Developer')} value={project.developer.name} />}
                    {totalDue > 0 && (
                        <KPI label={t('Amount Due')} value={formatCurrency(totalDue)} accent="red" />
                    )}
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

                        {/* Unified chronological timeline */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900 dark:text-white">{t('Activity Timeline')}</h3>
                                <div className="flex items-center gap-3 text-[10px] font-bold">
                                    {commits.length > 0 && (
                                        <span className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                                            <span className="w-2 h-2 rounded-full bg-violet-500" />
                                            {commits.length} commits
                                        </span>
                                    )}
                                    {commitsLoading && (
                                        <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                            {t('Loading commits...')}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                {unifiedTimeline.length === 0 ? (
                                    <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">{t('No activity yet.')}</p>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                                        <div className="space-y-5">
                                            {unifiedTimeline.map(entry => (
                                                <div key={entry.id} className="relative flex items-start ml-4 pl-6">
                                                    {/* Dot — color by type */}
                                                    <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 ${
                                                        entry.type === 'commit'
                                                            ? 'bg-violet-500 border-violet-500'
                                                            : entry.type === 'comment'
                                                            ? 'bg-blue-500 border-blue-500'
                                                            : entry.eventType === 'status_change'
                                                            ? 'bg-teal-500 border-teal-500'
                                                            : entry.eventType === 'email_sent'
                                                            ? 'bg-amber-500 border-amber-500'
                                                            : entry.eventType === 'document_signed' || entry.eventType === 'document_countersigned'
                                                            ? 'bg-emerald-500 border-emerald-500'
                                                            : 'bg-white dark:bg-gray-800 border-teal-400'
                                                    }`} />

                                                    <div className="flex-1 min-w-0">
                                                        {entry.type === 'commit' ? (
                                                            /* GitHub commit */
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                                                        commit
                                                                    </span>
                                                                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{entry.hash?.substring(0, 7)}</span>
                                                                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{formatDate(entry.date)}</span>
                                                                </div>
                                                                <p className="text-sm text-gray-900 dark:text-white mt-1 truncate">{entry.title}</p>
                                                                {entry.authorName && (
                                                                    <div className="flex items-center gap-1.5 mt-1">
                                                                        {entry.authorAvatar && <img src={entry.authorAvatar} className="w-4 h-4 rounded-full" alt="" />}
                                                                        <span className="text-xs text-gray-400 dark:text-gray-500">{entry.authorName}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            /* Platform event */
                                                            <div>
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.title}</p>
                                                                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 shrink-0">{formatDate(entry.date)}</span>
                                                                </div>
                                                                {entry.description && (
                                                                    <p className={`text-sm mt-0.5 ${
                                                                        entry.type === 'comment'
                                                                            ? 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 mt-1'
                                                                            : 'text-gray-500 dark:text-gray-400'
                                                                    }`}>{entry.description}</p>
                                                                )}
                                                                {entry.oldValue && entry.newValue && (
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Badge status={entry.oldValue} />
                                                                        <span className="text-gray-300 dark:text-gray-600">{'\u2192'}</span>
                                                                        <Badge status={entry.newValue} />
                                                                    </div>
                                                                )}
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
                    <div className="space-y-6">
                        {/* Documents légaux */}
                        {projectDocuments && projectDocuments.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                                    {t('Documents légaux')}
                                </h3>
                                <div className="space-y-3">
                                    {projectDocuments.map((doc: any) => {
                                        const category = doc.template?.category;
                                        const iconBg = category === 'legal'
                                            ? 'bg-teal-50 dark:bg-teal-500/10'
                                            : category === 'delivery'
                                            ? 'bg-green-50 dark:bg-green-500/10'
                                            : 'bg-blue-50 dark:bg-blue-500/10';
                                        const iconColor = category === 'legal'
                                            ? 'text-teal-500'
                                            : category === 'delivery'
                                            ? 'text-green-500'
                                            : 'text-blue-500';
                                        const iconPath = category === 'legal'
                                            ? 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z'
                                            : category === 'delivery'
                                            ? 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                            : 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z';

                                        return (
                                            <Link
                                                key={doc.id}
                                                href={`/client/documents/${doc.id}`}
                                                className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md hover:border-teal-300 dark:hover:border-teal-500/50 transition-all group"
                                            >
                                                <div className="flex items-center justify-between p-5">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                                                            <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                                                            </svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{doc.title}</p>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(doc.created_at)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge status={doc.status} />
                                                        {['pending_client', 'viewed'].includes(doc.status) && (
                                                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-full uppercase">{t('Action Required')}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Devis */}
                        <div>
                            {projectDocuments && projectDocuments.length > 0 && (
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                    {t('Quotes')}
                                </h3>
                            )}
                            <div className="space-y-3">
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
                        </div>

                        {/* Technical Documentation */}
                        {techDocs.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.512.645 6.374 1.766m0-14.524A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.524v14.524" /></svg>
                                    {t('Technical Documentation')}
                                </h3>
                                <div className="space-y-3">
                                    {techDocs.map((doc: TechDoc) => (
                                        <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                            <button
                                                onClick={() => setExpandedTechDocId(expandedTechDocId === doc.id ? null : doc.id)}
                                                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                                            >
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                                                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.512.645 6.374 1.766m0-14.524A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.524v14.524" /></svg>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{doc.title}</p>
                                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                            {doc.category && (
                                                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${techDocCategoryColors[doc.category] || techDocCategoryColors.other}`}>
                                                                    {t(techDocCategoryLabels[doc.category] || doc.category)}
                                                                </span>
                                                            )}
                                                            {doc.author && <span className="text-xs text-gray-400 dark:text-gray-500">{doc.author.name}</span>}
                                                            <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(doc.updated_at)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <svg className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${expandedTechDocId === doc.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                                            </button>
                                            {expandedTechDocId === doc.id && (
                                                <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                                                    <div
                                                        className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                                        dangerouslySetInnerHTML={{ __html: doc.content }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* External Documents (attachments) */}
                        {attachments.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
                                    {t('External Documents')}
                                </h3>
                                <div className="space-y-3">
                                    {attachments.map((doc: any) => {
                                        const isPdf = doc.mime_type === 'application/pdf';
                                        const isImage = doc.mime_type?.startsWith('image/');
                                        const iconBg = isPdf ? 'bg-red-50 dark:bg-red-500/10' : isImage ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-violet-50 dark:bg-violet-500/10';
                                        const iconColor = isPdf ? 'text-red-500' : isImage ? 'text-blue-500' : 'text-violet-500';
                                        const catLabels: Record<string, string> = {
                                            quote: 'Devis externe',
                                            invoice: 'Facture externe',
                                            contract: 'Contrat',
                                            brief: 'Brief / Cahier des charges',
                                            specification: 'Spécification',
                                            other: 'Autre',
                                        };
                                        const catColors: Record<string, string> = {
                                            quote: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
                                            invoice: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
                                            contract: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
                                            brief: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300',
                                            specification: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
                                            other: 'bg-gray-100 dark:bg-gray-600/30 text-gray-700 dark:text-gray-300',
                                        };
                                        const fmtSize = (bytes: number) => {
                                            if (bytes < 1024) return `${bytes} B`;
                                            if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
                                            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
                                        };

                                        return (
                                            <div key={doc.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                                <div className="flex items-center justify-between p-5">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                                                            <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{doc.name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${catColors[doc.category] || catColors.other}`}>
                                                                    {t(catLabels[doc.category] || doc.category)}
                                                                </span>
                                                                <span className="text-xs text-gray-400 dark:text-gray-500">{fmtSize(doc.file_size)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={`/client/projects/${project.id}/attachments/${doc.id}/download`}
                                                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                                        {t('Download')}
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
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
                                    {services.map((s: any) => {
                                        const freqLabels: Record<string, string> = {
                                            monthly: 'Mensuel',
                                            quarterly: 'Trimestriel',
                                            semi_annual: 'Semestriel',
                                            annual: 'Annuel',
                                            biennial: 'Bisannuel',
                                            triennial: 'Trisannuel',
                                        };
                                        return (
                                            <div key={s.id} className={`px-6 py-4 ${s.status === 'expiring_soon' ? 'bg-amber-50/50 dark:bg-amber-500/5' : ''}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 min-w-0">
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
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</p>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                {s.provider} · {s.expiry_date ? `${t('Expiry')}: ${formatDate(s.expiry_date)}` : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {s.auto_renew && (
                                                            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2 py-1 rounded-full whitespace-nowrap">{t('Renouvellement auto')}</span>
                                                        )}
                                                        <Badge status={s.status} />
                                                    </div>
                                                </div>
                                                {/* Extra details row */}
                                                <div className="mt-2 ml-[52px] flex flex-wrap items-center gap-3">
                                                    {s.frequency && (
                                                        <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            {freqLabels[s.frequency] || formatStatus(s.frequency)}
                                                        </span>
                                                    )}
                                                    {financialUnlocked && s.billed_price > 0 && (
                                                        <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                            {formatCurrency(s.billed_price)}
                                                        </span>
                                                    )}
                                                    {s.login_url && (
                                                        <a href={s.login_url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1 transition-colors">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                                                            {t('Accéder au service')}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Testimonial */}
            {!hasTestimonial ? (
                <div className="mt-8 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-500/5 dark:to-pink-500/5 rounded-2xl border border-rose-200 dark:border-rose-500/20 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{t('Share your experience')}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{t('Your feedback helps us improve and inspires future clients.')}</p>
                            <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget); router.post('/client/testimonial', { message: fd.get('message'), rating: fd.get('rating') }); }} className="space-y-3">
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
            ) : (
                <div className="mt-8 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 p-5 flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">{t('Thank you! Your testimonial has been submitted.')}</p>
                </div>
            )}
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
