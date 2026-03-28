import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Commit {
    hash: string;
    message: string;
    author_name: string;
    author_avatar: string | null;
    date: string;
}

interface Props {
    projectId: number;
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('fr-BE', { day: '2-digit', month: 'short' });
}

export default function CommitList({ projectId }: Props) {
    const { t } = useTranslation();
    const [commits, setCommits] = useState<Commit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/projects/${projectId}/commits`)
            .then(res => res.json())
            .then(data => {
                setCommits(data.commits || []);
                if (data.error) setError(data.error);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load commits');
                setLoading(false);
            });
    }, [projectId]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white dark:text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Recent Commits')}</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">GitHub</p>
                </div>
            </div>

            {loading ? (
                <div className="p-6 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                </div>
            ) : error && commits.length === 0 ? (
                <div className="p-6 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">{error === 'No repository linked' ? t('No repository linked') : t('Could not load commits')}</p>
                </div>
            ) : commits.length === 0 ? (
                <div className="p-6 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">{t('No commits yet')}</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-50 dark:divide-gray-700 max-h-[400px] overflow-y-auto custom-scroll">
                    {commits.map(commit => (
                        <div key={commit.hash} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                            {commit.author_avatar ? (
                                <img src={commit.author_avatar} alt="" className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5" />
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">{commit.author_name?.[0]?.toUpperCase() || '?'}</span>
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 dark:text-white leading-snug">
                                    <span className="font-mono text-xs text-gray-400 dark:text-gray-500 mr-2">{commit.hash.substring(0, 7)}</span>
                                    {commit.message.length > 80 ? commit.message.substring(0, 80) + '...' : commit.message.split('\n')[0]}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    {commit.author_name} -- {timeAgo(commit.date)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
