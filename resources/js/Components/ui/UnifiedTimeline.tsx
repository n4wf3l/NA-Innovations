import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import Badge from '@/Components/ui/Badge';

interface TimelineEvent {
    id: number;
    title: string;
    description?: string;
    event_type: string;
    old_value?: string;
    new_value?: string;
    created_at: string;
}

interface Commit {
    hash: string;
    message: string;
    author_name: string;
    author_avatar: string | null;
    date: string;
}

interface UnifiedEntry {
    id: string;
    type: 'event' | 'commit';
    date: string;
    title: string;
    description?: string;
    eventType?: string;
    oldValue?: string;
    newValue?: string;
    hash?: string;
    authorName?: string;
    authorAvatar?: string | null;
}

interface Props {
    events: TimelineEvent[];
    projectId: number;
    githubRepo?: string | null;
    showCommits?: boolean;
}

export default function UnifiedTimeline({ events, projectId, githubRepo, showCommits = true }: Props) {
    const { t } = useTranslation();
    const [commits, setCommits] = useState<Commit[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showCommits && githubRepo) {
            setLoading(true);
            fetch(`/api/projects/${projectId}/commits`)
                .then(r => r.json())
                .then(data => setCommits(data.commits || []))
                .catch(() => {})
                .finally(() => setLoading(false));
        }
    }, [projectId, githubRepo, showCommits]);

    const unified: UnifiedEntry[] = [
        ...events.map(e => ({
            id: `te-${e.id}`,
            type: 'event' as const,
            date: e.created_at,
            title: e.title,
            description: e.description,
            eventType: e.event_type,
            oldValue: e.old_value,
            newValue: e.new_value,
        })),
        ...commits.map(c => ({
            id: `commit-${c.hash}`,
            type: 'commit' as const,
            date: c.date,
            title: c.message,
            hash: c.hash,
            authorName: c.author_name,
            authorAvatar: c.author_avatar,
        })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getDotClass = (entry: UnifiedEntry) => {
        if (entry.type === 'commit') return 'bg-violet-500 border-violet-500';
        switch (entry.eventType) {
            case 'comment': return 'bg-blue-500 border-blue-500';
            case 'status_change': return 'bg-teal-500 border-teal-500';
            case 'email_sent': return 'bg-amber-500 border-amber-500';
            case 'document_signed':
            case 'document_countersigned': return 'bg-emerald-500 border-emerald-500';
            case 'developer_assigned':
            case 'project_created': return 'bg-indigo-500 border-indigo-500';
            default: return 'bg-white dark:bg-gray-800 border-teal-400';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t('Timeline')}</h3>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                    {commits.length > 0 && (
                        <span className="flex items-center gap-1 text-violet-500">
                            <span className="w-2 h-2 rounded-full bg-violet-500" />
                            {commits.length} commits
                        </span>
                    )}
                    {events.length > 0 && (
                        <span className="flex items-center gap-1 text-teal-500">
                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                            {events.length} {t('events')}
                        </span>
                    )}
                    {loading && (
                        <svg className="w-3.5 h-3.5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    )}
                </div>
            </div>
            <div className="p-5">
                {unified.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">{t('No activity yet.')}</p>
                ) : (
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                        <div className="space-y-5">
                            {unified.map(entry => (
                                <div key={entry.id} className="relative flex items-start ml-4 pl-6">
                                    <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full border-2 ${getDotClass(entry)}`} />

                                    <div className="flex-1 min-w-0">
                                        {entry.type === 'commit' ? (
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                                                        commit
                                                    </span>
                                                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{entry.hash?.substring(0, 7)}</span>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{formatDate(entry.date)}</span>
                                                </div>
                                                <p className="text-sm text-gray-900 dark:text-white mt-1">{entry.title}</p>
                                                {entry.authorName && (
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        {entry.authorAvatar && <img src={entry.authorAvatar} className="w-4 h-4 rounded-full" alt="" />}
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">{entry.authorName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.title}</p>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 shrink-0">{formatDate(entry.date)}</span>
                                                </div>
                                                {entry.description && (
                                                    <p className={`text-sm mt-0.5 ${
                                                        entry.eventType === 'comment'
                                                            ? 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2 mt-1'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                    }`}>{entry.description}</p>
                                                )}
                                                {entry.oldValue && entry.newValue && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge status={entry.oldValue} />
                                                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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
    );
}
