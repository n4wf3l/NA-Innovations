import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '@/Components/ui/RichTextEditor';

interface FaqData {
    id: number;
    question: string;
    answer: string;
    category: string | null;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    faqs: FaqData[];
}

const categoryOptions = [
    { value: 'general', label: 'Général' },
    { value: 'pricing', label: 'Tarifs' },
    { value: 'technical', label: 'Technique' },
];

export default function Faqs({ faqs }: Props) {
    const { t } = useTranslation();
    const { flash } = usePage<{ flash: { success?: string } }>().props;
    const [editForms, setEditForms] = useState<Record<number, Partial<FaqData>>>({});
    const [savingId, setSavingId] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [showNew, setShowNew] = useState(false);
    const [newForm, setNewForm] = useState({
        question: '',
        answer: '',
        category: 'general',
        sort_order: faqs.length + 1,
        is_active: true,
    });
    const [creating, setCreating] = useState(false);

    const getEditForm = (faq: FaqData) => {
        return editForms[faq.id] || {
            question: faq.question,
            answer: faq.answer,
            category: faq.category || 'general',
            sort_order: faq.sort_order,
            is_active: faq.is_active,
        };
    };

    const updateEditForm = (faqId: number, field: string, value: any) => {
        const faq = faqs.find(f => f.id === faqId);
        if (!faq) return;
        setEditForms(prev => ({
            ...prev,
            [faqId]: {
                ...getEditForm(faq),
                [field]: value,
            },
        }));
    };

    const handleSave = (faq: FaqData) => {
        setSavingId(faq.id);
        const form = getEditForm(faq);
        router.put(`/admin/settings/faqs/${faq.id}`, form, {
            onFinish: () => setSavingId(null),
        });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/settings/faqs/${id}`, {
            onFinish: () => setDeleteConfirm(null),
        });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        router.post('/admin/settings/faqs', newForm, {
            onFinish: () => setCreating(false),
            onSuccess: () => {
                setShowNew(false);
                setNewForm({ question: '', answer: '', category: 'general', sort_order: faqs.length + 2, is_active: true });
            },
        });
    };

    const moveUp = (faq: FaqData, index: number) => {
        if (index === 0) return;
        const prev = faqs[index - 1];
        router.put(`/admin/settings/faqs/${faq.id}`, { ...getEditForm(faq), sort_order: prev.sort_order }, { preserveScroll: true });
        router.put(`/admin/settings/faqs/${prev.id}`, { ...getEditForm(prev), sort_order: faq.sort_order }, { preserveScroll: true });
    };

    const moveDown = (faq: FaqData, index: number) => {
        if (index === faqs.length - 1) return;
        const next = faqs[index + 1];
        router.put(`/admin/settings/faqs/${faq.id}`, { ...getEditForm(faq), sort_order: next.sort_order }, { preserveScroll: true });
        router.put(`/admin/settings/faqs/${next.id}`, { ...getEditForm(next), sort_order: faq.sort_order }, { preserveScroll: true });
    };

    return (
        <AdminLayout title={t('FAQ')} header={t('FAQ')}>
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('Foire Aux Questions')}</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {t('Gérez les questions fréquentes affichées sur le site vitrine.')}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNew(!showNew)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {t('Ajouter une question')}
                    </button>
                </div>

                {flash?.success && (
                    <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                        <p className="text-sm text-green-700 dark:text-green-300">{flash.success}</p>
                    </div>
                )}

                {/* New FAQ Form */}
                {showNew && (
                    <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-teal-200 dark:border-teal-800 shadow-sm p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('Nouvelle question')}</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Question')}</label>
                            <input
                                type="text"
                                required
                                value={newForm.question}
                                onChange={(e) => setNewForm({ ...newForm, question: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                placeholder="Ex: Combien coûte un site web ?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Réponse')}</label>
                            <RichTextEditor
                                value={newForm.answer}
                                onChange={(html) => setNewForm({ ...newForm, answer: html })}
                                placeholder={t('Réponse à la question...')}
                                minHeight={120}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Catégorie')}</label>
                                <select
                                    value={newForm.category}
                                    onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                >
                                    {categoryOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">
                                {t('Annuler')}
                            </button>
                            <button type="submit" disabled={creating} className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition disabled:opacity-50">
                                {creating ? t('Création...') : t('Créer')}
                            </button>
                        </div>
                    </form>
                )}

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const form = getEditForm(faq);
                        return (
                            <div key={faq.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start gap-3">
                                        {/* Sort controls */}
                                        <div className="flex flex-col gap-1 pt-1">
                                            <button
                                                onClick={() => moveUp(faq, index)}
                                                disabled={index === 0}
                                                className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => moveDown(faq, index)}
                                                disabled={index === faqs.length - 1}
                                                className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Question')}</label>
                                                <input
                                                    type="text"
                                                    value={form.question || ''}
                                                    onChange={(e) => updateEditForm(faq.id, 'question', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('Réponse')}</label>
                                                <RichTextEditor
                                                    value={form.answer || ''}
                                                    onChange={(html) => updateEditForm(faq.id, 'answer', html)}
                                                    placeholder={t('Réponse à la question...')}
                                                    minHeight={120}
                                                />
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <select
                                                        value={form.category || 'general'}
                                                        onChange={(e) => updateEditForm(faq.id, 'category', e.target.value)}
                                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                    >
                                                        {categoryOptions.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <button
                                                    onClick={() => updateEditForm(faq.id, 'is_active', !form.is_active)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                                                        form.is_active ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        form.is_active ? 'translate-x-6' : 'translate-x-1'
                                                    }`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                        {deleteConfirm === faq.id ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-red-600 dark:text-red-400">{t('Confirmer la suppression ?')}</span>
                                                <button
                                                    onClick={() => handleDelete(faq.id)}
                                                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition"
                                                >
                                                    {t('Supprimer')}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
                                                >
                                                    {t('Annuler')}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(faq.id)}
                                                className="px-3 py-1.5 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                                            >
                                                {t('Supprimer')}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleSave(faq)}
                                            disabled={savingId === faq.id}
                                            className="px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
                                        >
                                            {savingId === faq.id ? t('Enregistrement...') : t('Enregistrer')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {faqs.length === 0 && !showNew && (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                        <p className="text-gray-500 dark:text-gray-400">{t('Aucune question. Cliquez sur "Ajouter une question" pour commencer.')}</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
