import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useConfirm } from '@/hooks/useConfirm';

interface TeamUser {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
    hourly_rate?: number | string | null;
    deliverables_checklist_enabled?: boolean;
    referral_partner?: {
        id: number;
        referral_code: string;
        default_commission_rate: number;
    };
}

interface Props {
    partners: TeamUser[];
    developers: TeamUser[];
    admins: TeamUser[];
    clients: TeamUser[];
    pending: TeamUser[];
    kbPending: TeamUser[];
}

type ModalRole = 'admin' | 'developer' | 'referral_partner';

function roleBadge(role: string, t: (key: string) => string) {
    switch (role) {
        case 'developer': return t('Developer');
        case 'referral_partner': return t('Partner');
        case 'admin': return t('Admin');
        case 'client': return t('Client');
        default: return role;
    }
}

function roleColor(role: string) {
    switch (role) {
        case 'developer': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300';
        case 'referral_partner': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300';
        case 'admin': return 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300';
        case 'client': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300';
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300';
    }
}

function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TeamIndex({ partners, developers, admins, clients = [], pending, kbPending = [] }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const devSettings = (usePage().props as any).devSettings as { show_hourly_rate?: boolean } | null;
    const showHourlyRate = devSettings?.show_hourly_rate !== false;
    const [showModal, setShowModal] = useState(false);
    const [modalRole, setModalRole] = useState<ModalRole>('developer');

    const form = useForm({
        name: '',
        email: '',
        role: 'developer' as string,
    });

    const openModal = (role: ModalRole) => {
        setModalRole(role);
        form.setData('role', role);
        form.reset();
        form.setData({ name: '', email: '', role });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        form.reset();
        form.clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/team', {
            onSuccess: () => closeModal(),
            preserveScroll: true,
        });
    };

    const handleApprove = (userId: number) => {
        router.patch(`/admin/team/${userId}/approve`, {}, { preserveScroll: true });
    };

    const handleReject = async (userId: number) => {
        const ok = await confirm({
            title: t('Reject'),
            message: t('Are you sure you want to reject this registration? This cannot be undone.'),
            confirmText: t('Reject'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/team/${userId}/reject`, { preserveScroll: true });
    };

    const handleToggle = (userId: number) => {
        router.patch(`/admin/team/${userId}/toggle`, {}, { preserveScroll: true });
    };

    const handleSendCredentials = async (user: TeamUser) => {
        const ok = await confirm({
            title: t('Envoyer les identifiants ?'),
            message: t('Un email avec un lien de connexion et de réinitialisation du mot de passe sera envoyé à :email.', { email: user.email } as any),
            confirmText: t('Envoyer'),
            variant: 'default' as any,
        });
        if (!ok) return;
        router.post(`/admin/team/${user.id}/send-credentials`, {}, { preserveScroll: true });
    };

    const UserCard = ({ user }: { user: TeamUser }) => {
        const inactive = !user.is_active;
        const [rate, setRate] = useState<string>(user.hourly_rate != null ? String(user.hourly_rate) : '');
        const saveRate = () => {
            router.patch(`/admin/team/${user.id}/hourly-rate`, { hourly_rate: rate === '' ? null : rate }, { preserveScroll: true });
        };
        return (
            <div className={`p-3 rounded-xl border transition-colors group ${
                inactive
                    ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-50'
                    : 'bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
            }`}>
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        inactive
                            ? 'bg-gray-200 dark:bg-gray-700'
                            : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700'
                    }`}>
                        <span className={`text-xs font-bold ${inactive ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>{getInitials(user.name)}</span>
                    </div>
                    <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${inactive ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>{user.name}</p>
                        <p className={`text-xs truncate ${inactive ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    {inactive ? (
                        <button
                            onClick={() => handleToggle(user.id)}
                            className="px-2.5 py-1 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors"
                        >
                            {t('Re-enable')}
                        </button>
                    ) : (
                        <>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                                {t('Active')}
                            </span>
                            <button
                                onClick={() => handleSendCredentials(user)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-500/10 text-gray-400 hover:text-teal-600 transition-all"
                                title={t('Envoyer les identifiants par email')}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleToggle(user.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all"
                                title={t("Deactivate")}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
                </div>
                {user.role === 'developer' && !inactive && showHourlyRate && (
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50 flex items-center gap-2">
                        <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">{t('Taux horaire')} (€/h)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={rate}
                            onChange={(e) => setRate(e.target.value)}
                            onBlur={saveRate}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.currentTarget.blur(); } }}
                            placeholder="0.00"
                            className="flex-1 px-2 py-1 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                )}
                {user.role === 'developer' && !inactive && (
                    <div className="mt-2 flex items-center justify-between gap-2">
                        <label className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{t('Checklist livrables')}</label>
                        <button
                            type="button"
                            onClick={() => router.patch(`/admin/team/${user.id}/deliverables-checklist`, {}, { preserveScroll: true })}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${user.deliverables_checklist_enabled ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            title={user.deliverables_checklist_enabled ? t('Désactiver') : t('Activer')}
                        >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${user.deliverables_checklist_enabled ? 'translate-x-5' : 'translate-x-1'}`} />
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const ColumnHeader = ({ title, count, color, gradient }: { title: string; count: number; color: string; gradient: string }) => (
        <div className={`flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r ${gradient}`}>
            <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/20 text-white text-xs font-bold`}>{count}</span>
        </div>
    );

    return (
        <AdminLayout title={t('Team')} header={t('Team Management')}>
            <Head title={t('Team')} />

            {/* Module Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
                <div className="relative">
                    <p className="text-violet-200 text-xs font-medium tracking-wider uppercase mb-1">{t('People')} / {t('Team')}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Team Management')}</h1>
                    <p className="text-violet-200 text-sm">{t('Manage your team members, approve registrations, and control access.')}</p>
                </div>
            </div>

            {/* Pending Approvals */}
            {pending.length > 0 && (
                <div className="mb-6 rounded-2xl border-2 border-amber-400/30 bg-amber-50 dark:bg-amber-500/5 overflow-hidden">
                    <div className="px-5 py-4 bg-amber-100 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300">{t('Pending Approvals')}</h3>
                            <p className="text-xs text-amber-700 dark:text-amber-400/70">{t('{{count}} registration(s) awaiting your review', { count: pending.length })}</p>
                        </div>
                    </div>
                    <div className="divide-y divide-amber-200/50 dark:divide-amber-500/10">
                        {pending.map(user => (
                            <div key={user.id} className="px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-600 dark:to-amber-700 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-amber-800 dark:text-amber-200">{getInitials(user.name)}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                    </div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${roleColor(user.role)}`}>
                                        {roleBadge(user.role, t)}
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                                        {formatDate(user.created_at)}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                    <button
                                        onClick={() => handleApprove(user.id)}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors shadow-sm"
                                    >
                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        {t('Approve')}
                                    </button>
                                    <button
                                        onClick={() => handleReject(user.id)}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors shadow-sm"
                                    >
                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        {t('Reject')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* KB Access Requests */}
            {kbPending.length > 0 && (
                <div className="mb-6 rounded-2xl border-2 border-violet-400/30 bg-violet-50 dark:bg-violet-500/5 overflow-hidden">
                    <div className="px-5 py-4 bg-violet-100 dark:bg-violet-500/10 border-b border-violet-200 dark:border-violet-500/20 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-400/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-violet-900 dark:text-violet-300">{t('Knowledge Base Access Requests')}</h3>
                            <p className="text-xs text-violet-700 dark:text-violet-400/70">{kbPending.length} {t('partner(s) signed the NDA and await your approval')}</p>
                        </div>
                    </div>
                    <div className="divide-y divide-violet-200/50 dark:divide-violet-500/10">
                        {kbPending.map(user => (
                            <div key={user.id} className="px-5 py-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-600 dark:to-violet-700 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-violet-800 dark:text-violet-200">{user.name.split(' ').map((n: string) => n[0]).join('')}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                        {(user as any).referral_partner?.kb_nda_full_name && (
                                            <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">
                                                {t('NDA signé par')} : {(user as any).referral_partner.kb_nda_full_name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                                    <button
                                        onClick={() => router.patch(`/admin/team/${user.id}/kb-approve`, {}, { preserveScroll: true })}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors shadow-sm"
                                    >
                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        {t('Approve')}
                                    </button>
                                    <button
                                        onClick={() => router.patch(`/admin/team/${user.id}/kb-reject`, {}, { preserveScroll: true })}
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors shadow-sm"
                                    >
                                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        {t('Reject')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Clients Column */}
                <div className="space-y-3">
                    <ColumnHeader title={t('Clients')} count={clients.length} color="blue" gradient="from-blue-500 to-cyan-500" />
                    <div className="space-y-2">
                        {clients.length === 0 ? (
                            <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">{t('Aucun client pour le moment')}</div>
                        ) : (
                            clients.map(user => <UserCard key={user.id} user={user} />)
                        )}
                    </div>
                    <a
                        href="/admin/clients/create"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-500/30 text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/5 text-sm font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>{t('Ajouter un client')}</span>
                    </a>
                </div>

                {/* Partners Column */}
                <div className="space-y-3">
                    <ColumnHeader title={t('Partners')} count={partners.length} color="rose" gradient="from-rose-500 to-pink-500" />
                    <div className="space-y-2">
                        {partners.length === 0 ? (
                            <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">{t('No partners yet')}</div>
                        ) : (
                            partners.map(user => <UserCard key={user.id} user={user} />)
                        )}
                    </div>
                    <button
                        onClick={() => openModal('referral_partner')}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-rose-300 dark:border-rose-500/30 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/5 text-sm font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>{t('Add Partner')}</span>
                    </button>
                </div>

                {/* Developers Column */}
                <div className="space-y-3">
                    <ColumnHeader title={t('Developers')} count={developers.length} color="indigo" gradient="from-indigo-500 to-violet-500" />
                    <div className="space-y-2">
                        {developers.length === 0 ? (
                            <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">{t('No developers yet')}</div>
                        ) : (
                            developers.map(user => <UserCard key={user.id} user={user} />)
                        )}
                    </div>
                    <button
                        onClick={() => openModal('developer')}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-indigo-300 dark:border-indigo-500/30 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 text-sm font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>{t('Add Developer')}</span>
                    </button>
                </div>

                {/* Admins Column */}
                <div className="space-y-3">
                    <ColumnHeader title={t('Admins')} count={admins.length} color="teal" gradient="from-teal-500 to-emerald-500" />
                    <div className="space-y-2">
                        {admins.length === 0 ? (
                            <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">{t('No admins yet')}</div>
                        ) : (
                            admins.map(user => <UserCard key={user.id} user={user} />)
                        )}
                    </div>
                    <button
                        onClick={() => openModal('admin')}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-teal-300 dark:border-teal-500/30 text-teal-500 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/5 text-sm font-medium transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>{t('Add Admin')}</span>
                    </button>
                </div>
            </div>

            {/* Add Member Modal */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={closeModal} />

                    {/* Modal Card */}
                    <div className="relative z-10 bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl mx-4 overflow-hidden animate-modal">
                        {/* Header */}
                        <div className={`px-6 py-4 bg-gradient-to-r ${
                            modalRole === 'referral_partner' ? 'from-rose-500 to-pink-500' :
                            modalRole === 'developer' ? 'from-indigo-500 to-violet-500' :
                            'from-teal-500 to-emerald-500'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{t('Add New Member')}</h3>
                                    <p className="text-sm text-white/70">
                                        {t('Creating a new {{role}} account', { role: modalRole === 'referral_partner' ? t('Partner') : modalRole === 'developer' ? t('Developer') : t('Admin') })}
                                    </p>
                                </div>
                                <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Full Name')}</label>
                                <input
                                    type="text"
                                    value={form.data.name}
                                    onChange={e => form.setData('name', e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    required
                                />
                                {form.errors.name && <p className="mt-1 text-xs text-red-500">{form.errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Email')}</label>
                                <input
                                    type="email"
                                    value={form.data.email}
                                    onChange={e => form.setData('email', e.target.value)}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    required
                                />
                                {form.errors.email && <p className="mt-1 text-xs text-red-500">{form.errors.email}</p>}
                            </div>

                            {/* Info: password will be set by the user */}
                            <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl px-4 py-3 flex items-start gap-2">
                                <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                                <p className="text-xs text-blue-700 dark:text-blue-300">{t('The user will receive an email to set their own password.')}</p>
                            </div>

                            {/* Role (pre-selected but changeable) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('Role')}</label>
                                <select
                                    value={form.data.role}
                                    onChange={e => form.setData('role', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                >
                                    <option value="developer">{t('Developer')}</option>
                                    <option value="referral_partner">{t('Partner')}</option>
                                    <option value="admin">{t('Admin')}</option>
                                </select>
                                {form.errors.role && <p className="mt-1 text-xs text-red-500">{form.errors.role}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {t('Cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className={`px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all shadow-sm disabled:opacity-50 ${
                                        modalRole === 'referral_partner' ? 'bg-rose-500 hover:bg-rose-600' :
                                        modalRole === 'developer' ? 'bg-indigo-500 hover:bg-indigo-600' :
                                        'bg-teal-500 hover:bg-teal-600'
                                    }`}
                                >
                                    {form.processing ? (
                                        <span className="flex items-center space-x-2">
                                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>{t('Creating...')}</span>
                                        </span>
                                    ) : t('Create Account')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
            <ConfirmDialog />
        </AdminLayout>
    );
}
