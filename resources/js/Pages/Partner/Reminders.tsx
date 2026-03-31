import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import ConfirmModal from '@/Components/ui/ConfirmModal';

interface Reminder {
    id: number;
    contact_name: string;
    contact_email: string | null;
    contact_phone: string | null;
    company_name: string | null;
    notes: string | null;
    remind_at: string;
    send_email_notification: boolean;
    status: string;
    sent_at: string | null;
    dismissed_at: string | null;
    lead_id: number | null;
}

interface Props {
    reminders: Reminder[];
    stats: { total: number; upcoming: number; overdue: number; completed: number };
}

const emptyForm = {
    contact_name: '', contact_email: '', contact_phone: '', company_name: '',
    notes: '', remind_at: '', send_email_notification: true,
};

export default function Reminders({ reminders, stats }: Props) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Reminder | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [confirm, setConfirm] = useState<{ id: number; action: 'dismiss' | 'delete' } | null>(null);

    const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (r: Reminder) => {
        setEditing(r);
        setForm({
            contact_name: r.contact_name,
            contact_email: r.contact_email || '',
            contact_phone: r.contact_phone || '',
            company_name: r.company_name || '',
            notes: r.notes || '',
            remind_at: r.remind_at ? new Date(r.remind_at).toISOString().slice(0, 16) : '',
            send_email_notification: r.send_email_notification,
        });
        setShowModal(true);
    };

    const submit = () => {
        setSubmitting(true);
        if (editing) {
            router.put(`/partner/reminders/${editing.id}`, form as any, {
                onFinish: () => { setSubmitting(false); setShowModal(false); },
            });
        } else {
            router.post('/partner/reminders', form as any, {
                onFinish: () => { setSubmitting(false); setShowModal(false); },
            });
        }
    };

    const handleConfirm = () => {
        if (!confirm) return;
        if (confirm.action === 'dismiss') {
            router.patch(`/partner/reminders/${confirm.id}/dismiss`, {}, { preserveScroll: true });
        } else {
            router.delete(`/partner/reminders/${confirm.id}`, { preserveScroll: true });
        }
        setConfirm(null);
    };

    const now = new Date();

    const statusBadge = (r: Reminder) => {
        if (r.status === 'sent') return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">{t('Envoyé')}</span>;
        if (r.status === 'dismissed') return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">{t('Fermé')}</span>;
        if (new Date(r.remind_at) <= now) return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 animate-pulse">{t('En retard')}</span>;
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{t('À venir')}</span>;
    };

    const timeUntil = (date: string) => {
        const diff = new Date(date).getTime() - now.getTime();
        if (diff < 0) { const ago = Math.abs(diff); return t('Il y a') + ' ' + formatDuration(ago); }
        return t('Dans') + ' ' + formatDuration(diff);
    };

    const formatDuration = (ms: number) => {
        const mins = Math.floor(ms / 60000);
        if (mins < 60) return `${mins} min`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days} ${t('jours')}`;
    };

    const input = "w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent";

    return (
        <PartnerLayout title={t('Reminders')}>
            <Head title={t('Reminders')} />

            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-pink-700 rounded-2xl p-6 mb-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{t('Rappels de relance')}</h1>
                        <p className="text-rose-200 text-sm mt-1">{t('Ne laissez jamais un prospect sans suivi')}</p>
                    </div>
                    <button onClick={openCreate} className="px-5 py-2.5 bg-white text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-colors shadow-lg flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {t('Nouveau rappel')}
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: t('Total'), value: stats.total, color: 'text-gray-900 dark:text-white' },
                    { label: t('À venir'), value: stats.upcoming, color: 'text-blue-600 dark:text-blue-400' },
                    { label: t('En retard'), value: stats.overdue, color: 'text-red-600 dark:text-red-400' },
                    { label: t('Envoyés'), value: stats.completed, color: 'text-emerald-600 dark:text-emerald-400' },
                ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Reminders List */}
            {reminders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('Aucun rappel')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('Quand un prospect dit "Rappelle-moi plus tard", créez un rappel pour ne jamais oublier.')}</p>
                    <button onClick={openCreate} className="px-5 py-2.5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors">
                        {t('Créer mon premier rappel')}
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {reminders.map(r => (
                        <div key={r.id} className={`bg-white dark:bg-gray-800 rounded-2xl border shadow-sm p-5 transition-all duration-200 hover:shadow-md ${
                            r.status === 'pending' && new Date(r.remind_at) <= now
                                ? 'border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5'
                                : r.status === 'pending'
                                ? 'border-blue-200 dark:border-blue-500/20'
                                : 'border-gray-100 dark:border-gray-700 opacity-60'
                        }`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{r.contact_name}</h3>
                                        {r.company_name && <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-lg">{r.company_name}</span>}
                                        {statusBadge(r)}
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        {r.contact_phone && (
                                            <a href={`tel:${r.contact_phone}`} className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                                                {r.contact_phone}
                                            </a>
                                        )}
                                        {r.contact_email && (
                                            <a href={`mailto:${r.contact_email}`} className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                                {r.contact_email}
                                            </a>
                                        )}
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {timeUntil(r.remind_at)}
                                        </span>
                                        {r.send_email_notification && (
                                            <span className="flex items-center gap-1 text-xs text-emerald-500">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                {t('Email auto')}
                                            </span>
                                        )}
                                    </div>
                                    {r.notes && <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{r.notes}</p>}
                                </div>
                                {r.status === 'pending' && (
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <button onClick={() => openEdit(r)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title={t('Modifier')}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
                                        </button>
                                        <button onClick={() => setConfirm({ id: r.id, action: 'dismiss' })} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors" title={t('Marquer comme fait')}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                        </button>
                                        <button onClick={() => setConfirm({ id: r.id, action: 'delete' })} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title={t('Supprimer')}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-[modalIn_0.3s_ease-out]">
                        <div className="bg-gradient-to-r from-rose-600 to-pink-700 px-6 py-5">
                            <h2 className="text-lg font-bold text-white">{editing ? t('Modifier le rappel') : t('Nouveau rappel')}</h2>
                            <p className="text-rose-200 text-sm mt-0.5">{t('Planifiez une relance pour ne jamais oublier un prospect')}</p>
                        </div>
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('Nom du contact')} *</label>
                                    <input type="text" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} className={input} placeholder="Jean Dupont" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('Société')}</label>
                                    <input type="text" value={form.company_name} onChange={e => set('company_name', e.target.value)} className={input} placeholder="Restaurant XYZ" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('Email')}</label>
                                    <input type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} className={input} placeholder="jean@example.com" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('Téléphone')}</label>
                                    <input type="tel" value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} className={input} placeholder="+32 470 123 456" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('Date et heure du rappel')} *</label>
                                <input type="datetime-local" value={form.remind_at} onChange={e => set('remind_at', e.target.value)} className={input} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('Notes')}</label>
                                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} className={input + ' resize-none'} rows={3} placeholder={t('Ex: Il m\'a dit de le rappeler après les vacances pour discuter du site web...')} />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <input type="checkbox" checked={form.send_email_notification} onChange={e => set('send_email_notification', e.target.checked)} className="rounded border-gray-300 dark:border-gray-600 text-rose-500 focus:ring-rose-500" />
                                <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('M\'envoyer un email de rappel')}</span>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{t('Vous recevrez un email automatique quand le rappel arrive à échéance')}</p>
                                </div>
                            </label>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">{t('Annuler')}</button>
                            <button onClick={submit} disabled={!form.contact_name.trim() || !form.remind_at || submitting} className="px-5 py-2 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-40 shadow-lg shadow-rose-500/20">
                                {submitting ? t('Enregistrement...') : editing ? t('Mettre à jour') : t('Créer le rappel')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Confirm Modal */}
            {confirm && (
                <ConfirmModal
                    open={true}
                    title={confirm.action === 'dismiss' ? t('Marquer comme fait ?') : t('Supprimer ce rappel ?')}
                    message={confirm.action === 'dismiss' ? t('Ce rappel sera marqué comme traité.') : t('Cette action est irréversible.')}
                    confirmText={confirm.action === 'dismiss' ? t('Confirmer') : t('Supprimer')}
                    variant={confirm.action === 'delete' ? 'danger' : 'default'}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </PartnerLayout>
    );
}
