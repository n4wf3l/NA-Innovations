import { useState, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Deliverable {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    completed_at: string | null;
    completer?: { id: number; name: string } | null;
}

interface Props {
    projectId: number;
    deliverables: Deliverable[];
    mode: 'admin' | 'dev' | 'dev-disabled';
}

export default function DeliverablesChecklist({ projectId, deliverables, mode }: Props) {
    const { t } = useTranslation();
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');

    const total = deliverables.length;
    const done = deliverables.filter(d => d.is_completed).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    const toggleEndpoint = (id: number) =>
        mode === 'admin' ? `/admin/deliverables/${id}/toggle` : `/dev/deliverables/${id}/toggle`;

    const handleToggle = (d: Deliverable) => {
        if (mode === 'dev-disabled') return;
        router.patch(toggleEndpoint(d.id), {}, { preserveScroll: true });
    };

    const handleAdd = (e: FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        setAdding(true);
        router.post(`/admin/projects/${projectId}/deliverables`, { title: newTitle.trim(), description: newDesc.trim() || null }, {
            preserveScroll: true,
            onSuccess: () => { setNewTitle(''); setNewDesc(''); },
            onFinish: () => setAdding(false),
        });
    };

    const handleDelete = (d: Deliverable) => {
        if (!confirm(t('Supprimer le livrable « {{title}} » ?', { title: d.title }))) return;
        router.delete(`/admin/deliverables/${d.id}`, { preserveScroll: true });
    };

    const startEdit = (d: Deliverable) => {
        setEditingId(d.id);
        setEditTitle(d.title);
        setEditDesc(d.description || '');
    };

    const saveEdit = (id: number) => {
        router.patch(`/admin/deliverables/${id}`, { title: editTitle.trim(), description: editDesc.trim() || null }, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t('Checklist livrables')}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {total === 0 ? t('Aucun livrable défini pour ce projet.') : t('{{done}} / {{total}} complétés ({{pct}}%)', { done, total, pct })}
                    </p>
                </div>
                {total > 0 && (
                    <div className="w-24 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                )}
            </div>

            {mode === 'dev-disabled' && (
                <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-xs text-gray-600 dark:text-gray-400 mb-3">
                    {t('La checklist livrables n\'est pas activée pour votre compte. Contactez un admin pour l\'activer.')}
                </div>
            )}

            {deliverables.length > 0 && (
                <ul className="space-y-2">
                    {deliverables.map(d => (
                        <li key={d.id} className={`flex items-start gap-3 p-3 rounded-xl border ${d.is_completed ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/40' : 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700'}`}>
                            <button
                                type="button"
                                onClick={() => handleToggle(d)}
                                disabled={mode === 'dev-disabled'}
                                className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 transition-colors ${d.is_completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'} ${mode === 'dev-disabled' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                aria-label={d.is_completed ? t('Marquer comme non fait') : t('Marquer comme fait')}
                            >
                                {d.is_completed && (
                                    <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                )}
                            </button>
                            <div className="flex-1 min-w-0">
                                {editingId === d.id ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={e => setEditTitle(e.target.value)}
                                            className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                            autoFocus
                                        />
                                        <textarea
                                            value={editDesc}
                                            onChange={e => setEditDesc(e.target.value)}
                                            rows={2}
                                            className="w-full px-2 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                            placeholder={t('Description (optionnel)')}
                                        />
                                        <div className="flex gap-2">
                                            <button type="button" onClick={() => saveEdit(d.id)} className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-500 text-white hover:bg-indigo-600">{t('Enregistrer')}</button>
                                            <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1 text-xs font-semibold rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">{t('Annuler')}</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className={`text-sm font-medium ${d.is_completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{d.title}</p>
                                        {d.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{d.description}</p>
                                        )}
                                        {d.is_completed && d.completer && (
                                            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">{t('Complété par')} {d.completer.name}</p>
                                        )}
                                    </>
                                )}
                            </div>
                            {mode === 'admin' && editingId !== d.id && (
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <button type="button" onClick={() => startEdit(d)} className="p-1.5 text-gray-400 hover:text-indigo-500 transition-colors" title={t('Modifier')}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
                                    </button>
                                    <button type="button" onClick={() => handleDelete(d)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title={t('Supprimer')}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {mode === 'admin' && (
                <form onSubmit={handleAdd} className="mt-4 space-y-2">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        placeholder={t('Titre du livrable')}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <textarea
                        value={newDesc}
                        onChange={e => setNewDesc(e.target.value)}
                        rows={2}
                        placeholder={t('Description (optionnel)')}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button type="submit" disabled={adding || !newTitle.trim()} className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 disabled:opacity-50">
                        {adding ? t('Ajout...') : t('Ajouter un livrable')}
                    </button>
                </form>
            )}
        </div>
    );
}
