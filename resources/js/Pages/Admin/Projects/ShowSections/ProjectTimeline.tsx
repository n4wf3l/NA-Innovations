import Badge from '@/Components/ui/Badge';
import { TimelineEvent } from '@/types';
import { formatDate } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ProjectNote {
    id: number;
    content: string;
    created_at: string;
    user?: { name: string };
}

interface Props {
    timelineEvents: TimelineEvent[];
    notes: ProjectNote[];
}

export default function ProjectTimeline({ timelineEvents, notes }: Props) {
    const { t } = useTranslation();

    return (
        <>
            {/* Notes */}
            {notes.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{t("Notes")}</h3>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {notes.map(note => (
                            <div key={note.id} className="px-6 py-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{note.content}</p>
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                    {note.user && <span>{note.user.name}</span>}
                                    <span>{formatDate(note.created_at)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t("Timeline")}</h3>
                </div>
                <div className="p-5">
                    {timelineEvents.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">{t("No activity yet.")}</p>
                    ) : (
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                            <div className="space-y-5">
                                {timelineEvents.map(event => (
                                    <div key={event.id} className="relative flex items-start ml-4 pl-6">
                                        <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-violet-400" />
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                                                <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(event.created_at)}</span>
                                            </div>
                                            {event.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{event.description}</p>}
                                            {event.old_value && event.new_value && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge status={event.old_value} />
                                                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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
        </>
    );
}
