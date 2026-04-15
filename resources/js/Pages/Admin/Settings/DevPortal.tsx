import { useState, FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useTranslation } from 'react-i18next';

interface Props {
    settings: Record<string, boolean>;
}

const FEATURES: { key: string; titleKey: string; descKey: string }[] = [
    { key: 'dev.show_earnings', titleKey: 'Revenus', descKey: 'Afficher les revenus et le tarif horaire aux développeurs' },
    { key: 'dev.show_hourly_rate', titleKey: 'Tarif horaire', descKey: 'Afficher le tarif horaire dans le profil développeur' },
    { key: 'dev.require_time_approval', titleKey: 'Validation des heures', descKey: 'Les entrées de temps doivent être validées par un admin' },
    { key: 'dev.allow_release', titleKey: 'Libération de projet', descKey: 'Les développeurs peuvent libérer un projet qu\'ils ont pris' },
    { key: 'dev.show_skills_matching', titleKey: 'Suggestions par compétences', descKey: 'Suggérer des projets selon les compétences du développeur' },
    { key: 'dev.show_team_contacts', titleKey: 'Contacts équipe', descKey: 'Afficher la page des contacts de l\'équipe' },
    { key: 'dev.show_milestones', titleKey: 'Étapes du projet', descKey: 'Afficher le planificateur d\'étapes multi-jalons' },
    { key: 'dev.show_credentials', titleKey: 'Identifiants & env', descKey: 'Afficher la section identifiants et variables d\'environnement' },
    { key: 'dev.show_messaging', titleKey: 'Messagerie', descKey: 'Afficher la messagerie développeur ↔ admin / client' },
    { key: 'dev.allow_blocked_status', titleKey: 'Statuts bloqué / en attente', descKey: 'Autoriser les statuts bloqué, en attente client, en pause' },
    { key: 'dev.show_useful_links', titleKey: 'Liens utiles', descKey: 'Afficher les URL de staging, preview, GitHub et liens utiles' },
    { key: 'dev.decloisoned_notes', titleKey: 'Notes décloisonnées', descKey: 'Les développeurs voient toutes les notes (pas seulement les leurs)' },
    { key: 'dev.notify_github_inactivity', titleKey: 'Notification inactivité GitHub', descKey: 'Notifier le développeur chaque matin (9h, heure belge) si aucun commit n\'a été poussé depuis 3 jours sur un projet partagé avec le client' },
];

export default function DevPortalSettings({ settings }: Props) {
    const { t } = useTranslation();
    const [state, setState] = useState<Record<string, boolean>>(settings);
    const [saving, setSaving] = useState(false);

    const toggle = (key: string) => setState(s => ({ ...s, [key]: !s[key] }));

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        router.put('/admin/settings/dev-portal', state, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    return (
        <AdminLayout title={t('Paramètres portail développeur')} header={t('Paramètres portail développeur')}>
            <Head title={t('Paramètres portail développeur')} />

            <form onSubmit={handleSave} className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('Fonctionnalités du portail développeur')}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('Activez ou désactivez chaque fonctionnalité du portail développeur.')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {FEATURES.map(f => (
                        <div key={f.key} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t(f.titleKey)}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t(f.descKey)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => toggle(f.key)}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 shrink-0 ${state[f.key] ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${state[f.key] ? 'translate-x-7' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-600 disabled:opacity-50"
                    >
                        {saving ? t('Enregistrement...') : t('Enregistrer')}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
