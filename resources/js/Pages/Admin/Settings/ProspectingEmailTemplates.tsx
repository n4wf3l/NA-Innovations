import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import PartnerSettingsTabs from '@/Components/Admin/PartnerSettingsTabs';

interface ProspectingEmailTemplate {
    id: number;
    title: string;
    body: string;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    templates: ProspectingEmailTemplate[];
}

export default function ProspectingEmailTemplates({ templates }: Props) {
    const { t } = useTranslation();
    const [editing, setEditing] = useState<ProspectingEmailTemplate | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ title: '', body: '', sort_order: 0, is_active: true });
    const [saving, setSaving] = useState(false);

    const openCreate = () => {
        setEditing(null);
        setCreating(true);
        setForm({ title: '', body: 'Objet : \n\nBonjour,\n\n...\n\nCordialement,\n[Votre nom]\nPartenaire NA Innovations', sort_order: templates.length + 1, is_active: true });
    };

    const openEdit = (tpl: ProspectingEmailTemplate) => {
        setCreating(false);
        setEditing(tpl);
        setForm({ title: tpl.title, body: tpl.body, sort_order: tpl.sort_order, is_active: tpl.is_active });
    };

    const close = () => { setEditing(null); setCreating(false); };

    const save = () => {
        setSaving(true);
        const opts = {
            preserveScroll: true,
            onSuccess: () => { close(); },
            onFinish: () => { setSaving(false); },
        };
        if (creating) {
            router.post('/admin/settings/prospecting-email-templates', form as any, opts);
        } else if (editing) {
            router.put(`/admin/settings/prospecting-email-templates/${editing.id}`, form as any, opts);
        }
    };

    const toggle = (tpl: ProspectingEmailTemplate) => {
        router.patch(`/admin/settings/prospecting-email-templates/${tpl.id}/toggle`, {}, { preserveScroll: true });
    };

    const remove = (tpl: ProspectingEmailTemplate) => {
        if (!confirm(t('Supprimer ce template ? Cette action est irréversible.'))) return;
        router.delete(`/admin/settings/prospecting-email-templates/${tpl.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title={t('Gestion partenaires')} header={t('Gestion partenaires')}>
            <Head title={t('Templates de prospection partenaires')} />

            <div className="p-6 space-y-6">
                <PartnerSettingsTabs active="prospecting-email-templates" />
            <div className="space-y-6">
                {/* Header explicatif */}
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg shadow-rose-500/20">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-1">{t('Templates de prospection partenaires')}</h1>
                            <p className="text-rose-100 text-sm leading-relaxed">
                                {t("Ces modèles d'emails sont affichés aux partenaires sur leur page Prospection (/partner/prospecting). Ils servent de scripts prêts à copier-coller pour démarcher de nouveaux clients. Toute modification ici sera immédiatement visible côté partenaire.")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info box visibilité */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4">
                    <div className="flex gap-3">
                        <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                        <div className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                            <p className="font-semibold mb-1">{t('À quoi ça sert ?')}</p>
                            <p>{t("Quand un partenaire va sur sa page Prospection → onglet Templates, il voit la liste de ces emails et peut les copier en un clic pour les envoyer à des prospects (restaurants, clubs, entreprises…). Désactiver un template le masque côté partenaire sans le supprimer.")}</p>
                        </div>
                    </div>
                </div>

                {/* Bouton ajouter */}
                <div className="flex justify-end">
                    <button
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-shadow"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {t('Ajouter un template')}
                    </button>
                </div>

                {/* Liste */}
                <div className="space-y-4">
                    {templates.length === 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">{t("Aucun template pour le moment. Cliquez sur « Ajouter un template » pour en créer un.")}</p>
                        </div>
                    )}
                    {templates.map((tpl) => (
                        <div key={tpl.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500">#{tpl.sort_order}</span>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{tpl.title}</h3>
                                    {!tpl.is_active && (
                                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                            {t('Désactivé')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggle(tpl)}
                                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        {tpl.is_active ? t('Désactiver') : t('Activer')}
                                    </button>
                                    <button
                                        onClick={() => openEdit(tpl)}
                                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                                    >
                                        {t('Modifier')}
                                    </button>
                                    <button
                                        onClick={() => remove(tpl)}
                                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                    >
                                        {t('Supprimer')}
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <pre className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">{tpl.body}</pre>
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
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {creating ? t('Nouveau template') : t('Modifier le template')}
                            </h2>
                            <button onClick={close} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Titre / cible')} <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder={t('ex : Restaurants, Clubs de football, Entreprises…')}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("Ce titre est affiché au partenaire au-dessus du template.")}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("Contenu de l'email")} <span className="text-rose-500">*</span></label>
                                <textarea
                                    value={form.body}
                                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                                    rows={16}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent font-mono text-sm"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t("Commencez par « Objet : … » sur la première ligne. Le partenaire pourra copier l'intégralité du texte en un clic.")}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Ordre d\'affichage')}</label>
                                    <input
                                        type="number"
                                        value={form.sort_order}
                                        onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
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
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{t('Visible par les partenaires')}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
                            <button
                                onClick={close}
                                className="px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {t('Annuler')}
                            </button>
                            <button
                                onClick={save}
                                disabled={saving || !form.title.trim() || !form.body.trim()}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
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
