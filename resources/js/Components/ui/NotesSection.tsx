import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';
import { useConfirm } from '@/hooks/useConfirm';

interface Note {
    id: number;
    content: string;
    is_private: boolean;
    is_pinned: boolean;
    created_at: string;
    user?: { id: number; name: string };
}

interface Props {
    notes: Note[];
    notableType: 'lead' | 'project' | 'client' | 'quote' | 'service';
    notableId: number;
}

export default function NotesSection({ notes, notableType, notableId }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const [content, setContent] = useState('');
    const [isPrivate, setIsPrivate] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const sorted = [...notes].sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        setSubmitting(true);
        router.post('/admin/notes', {
            notable_type: notableType,
            notable_id: notableId,
            content: content.trim(),
            is_private: isPrivate,
        }, {
            preserveScroll: true,
            onFinish: () => { setSubmitting(false); setContent(''); },
        });
    };

    const handleDelete = async (id: number) => {
        const ok = await confirm({
            title: t('Supprimer cette note ?'),
            message: t('Cette action est irréversible.'),
            confirmText: t('Supprimer'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/notes/${id}`, { preserveScroll: true });
    };

    const handleTogglePin = (id: number) => {
        router.patch(`/admin/notes/${id}/pin`, {}, { preserveScroll: true });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                    {t('Notes')}
                    {notes.length > 0 && <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">({notes.length})</span>}
                </h3>
            </div>

            {/* Add note form */}
            <form onSubmit={handleSubmit} className="px-5 py-4 border-b border-gray-50 dark:border-gray-700">
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder={t('Ajouter une note...')}
                    rows={2}
                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-400 resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={e => setIsPrivate(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-teal-500 focus:ring-teal-400"
                        />
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">
                            {isPrivate ? t('Privée (visible uniquement par les admins)') : t('Publique (visible par le client)')}
                        </span>
                    </label>
                    <button
                        type="submit"
                        disabled={submitting || !content.trim()}
                        className="px-4 py-1.5 bg-teal-500 text-white text-xs font-bold rounded-lg hover:bg-teal-600 disabled:opacity-30 transition-colors"
                    >
                        {submitting ? t('Envoi...') : t('Ajouter')}
                    </button>
                </div>
            </form>

            {/* Notes list */}
            <div className="max-h-80 overflow-y-auto">
                {sorted.length === 0 ? (
                    <div className="px-5 py-8 text-center text-xs text-gray-400 dark:text-gray-500">{t('Aucune note.')}</div>
                ) : (
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {sorted.map(note => (
                            <div key={note.id} className={`px-5 py-3.5 group ${note.is_pinned ? 'bg-amber-50/50 dark:bg-amber-500/5' : ''}`}>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-gray-900 dark:text-white">{note.user?.name || t('Système')}</span>
                                            <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500">{formatDate(note.created_at)}</span>
                                            {note.is_pinned && (
                                                <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
                                            )}
                                            {note.is_private && (
                                                <span className="text-[9px] text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{t('Privée')}</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{note.content}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                        <button onClick={() => handleTogglePin(note.id)} className="p-1 text-gray-300 dark:text-gray-600 hover:text-amber-500 transition-colors" title={note.is_pinned ? t('Désépingler') : t('Épingler')}>
                                            <svg className="w-3.5 h-3.5" fill={note.is_pinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
                                        </button>
                                        <button onClick={() => handleDelete(note.id)} className="p-1 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors" title={t('Supprimer')}>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialog />
        </div>
    );
}
