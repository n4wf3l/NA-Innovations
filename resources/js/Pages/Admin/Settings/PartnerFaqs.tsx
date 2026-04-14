import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import PartnerSettingsTabs from '@/Components/Admin/PartnerSettingsTabs';

interface PartnerFaq {
    id: number;
    question: string;
    answer: string;
    category: string;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    faqs: PartnerFaq[];
}

const CATEGORIES = [
    { value: 'commissions', label: 'Commissions' },
    { value: 'pipeline', label: 'Pipeline' },
    { value: 'leads', label: 'Leads' },
    { value: 'objections', label: 'Objections' },
    { value: 'rules', label: 'Règles' },
    { value: 'general', label: 'Général' },
];

export default function PartnerFaqs({ faqs }: Props) {
    const { t } = useTranslation();
    const [editing, setEditing] = useState<PartnerFaq | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ question: '', answer: '', category: 'general', sort_order: 0, is_active: true });
    const [saving, setSaving] = useState(false);

    const openCreate = () => {
        setEditing(null);
        setCreating(true);
        setForm({ question: '', answer: '', category: 'general', sort_order: faqs.length + 1, is_active: true });
    };

    const openEdit = (f: PartnerFaq) => {
        setCreating(false);
        setEditing(f);
        setForm({ question: f.question, answer: f.answer, category: f.category, sort_order: f.sort_order, is_active: f.is_active });
    };

    const close = () => { setEditing(null); setCreating(false); };

    const save = () => {
        setSaving(true);
        const opts = {
            preserveScroll: true,
            onSuccess: () => close(),
            onFinish: () => setSaving(false),
        };
        if (creating) {
            router.post('/admin/settings/partner-faqs', form as any, opts);
        } else if (editing) {
            router.put(`/admin/settings/partner-faqs/${editing.id}`, form as any, opts);
        }
    };

    const toggle = (f: PartnerFaq) => router.patch(`/admin/settings/partner-faqs/${f.id}/toggle`, {}, { preserveScroll: true });
    const remove = (f: PartnerFaq) => {
        if (!confirm(t('Supprimer cette FAQ ?'))) return;
        router.delete(`/admin/settings/partner-faqs/${f.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title={t('Gestion partenaires')} header={t('Gestion partenaires')}>
            <Head title={t('FAQ Partenaires')} />

            <div className="p-6 space-y-6">
                <PartnerSettingsTabs active="partner-faqs" />
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg shadow-rose-500/20">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-1">{t('FAQ Partenaires')}</h1>
                            <p className="text-rose-100 text-sm leading-relaxed">
                                {t("Ces questions/réponses sont affichées aux partenaires sur la page « Centre d'aide » (/partner/help). Elles couvrent les commissions, le pipeline, les leads, les objections et les règles du programme. Toute modification ici est immédiatement visible côté partenaire.")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>{t('Astuce :')}</strong> {t("Vous pouvez utiliser **double étoiles** pour mettre du texte en gras dans la réponse, et commencer une ligne par « - » pour créer une liste à puces.")}
                    </p>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-shadow"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        {t('Ajouter une FAQ')}
                    </button>
                </div>

                <div className="space-y-4">
                    {faqs.length === 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">{t('Aucune FAQ pour le moment.')}</p>
                        </div>
                    )}
                    {faqs.map((f) => (
                        <div key={f.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono text-gray-400 dark:text-gray-500">#{f.sort_order}</span>
                                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                                            {f.category}
                                        </span>
                                        {!f.is_active && (
                                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                                {t('Désactivé')}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{f.question}</h3>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => toggle(f)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                                        {f.is_active ? t('Désactiver') : t('Activer')}
                                    </button>
                                    <button onClick={() => openEdit(f)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50">
                                        {t('Modifier')}
                                    </button>
                                    <button onClick={() => remove(f)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50">
                                        {t('Supprimer')}
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <pre className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-sans max-h-48 overflow-y-auto">{f.answer}</pre>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>

            {(editing || creating) && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={close}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{creating ? t('Nouvelle FAQ') : t('Modifier la FAQ')}</h2>
                            <button onClick={close} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Question')} <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.question}
                                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Réponse')} <span className="text-rose-500">*</span></label>
                                <textarea
                                    value={form.answer}
                                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                                    rows={16}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm leading-relaxed"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('Utilisez **texte** pour le gras, et commencez une ligne par « - » pour une puce.')}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Catégorie')}</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    >
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Ordre')}</label>
                                    <input
                                        type="number"
                                        value={form.sort_order}
                                        onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.is_active}
                                            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                            className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{t('Visible')}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
                            <button onClick={close} className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">{t('Annuler')}</button>
                            <button
                                onClick={save}
                                disabled={saving || !form.question.trim() || !form.answer.trim()}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? t('Enregistrement...') : t('Enregistrer')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
