import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { Project, User, Lead, Quote, Invoice, RecurringService, TimelineEvent, PageProps } from '@/types';
import { formatDate } from '@/lib/utils';
import UnifiedTimeline from '@/Components/ui/UnifiedTimeline';
import DeliverablesChecklist from '@/Components/project/DeliverablesChecklist';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useConfirm } from '@/hooks/useConfirm';
import SearchableSelect from '@/Components/ui/SearchableSelect';

import ProjectHeader from './ShowSections/ProjectHeader';
import ProjectTimeline from './ShowSections/ProjectTimeline';
import ProjectRelatedDocs from './ShowSections/ProjectRelatedDocs';
import EmailModalSection from './ShowSections/EmailModal';

interface ProjectNote {
    id: number;
    content: string;
    created_at: string;
    user?: User;
}

interface ProjectDocument {
    id: number;
    name: string;
    file_path: string;
    created_at: string;
}

interface Attachment {
    id: number;
    name: string;
    original_filename: string;
    file_path: string;
    mime_type: string;
    file_size: number;
    category: string;
    description?: string;
    is_client_visible: boolean;
    created_at: string;
    uploader?: { id: number; name: string };
}

interface SentEmailItem {
    id: number; subject: string; recipient_email: string; body: string;
    status: string; sent_at: string; sender?: { name: string };
}

interface Props {
    project: Project & {
        client?: User;
        developer?: User;
        lead?: Lead & { referral_partner?: { user?: User } };
        quotes?: Quote[];
        invoices?: Invoice[];
        recurring_services?: RecurringService[];
        payouts?: { id: number; user_id: number; user: User; role: string; amount: number; status: string; paid_date?: string; payment_method?: string; payment_reference?: string; notes?: string }[];
        timeline_events?: TimelineEvent[];
        notes?: ProjectNote[];
        documents?: Attachment[];
    };
    emailTemplate?: { subject: string; body: string; variables?: string[] } | null;
    sentEmails?: SentEmailItem[];
}

export default function ProjectShow({ project, emailTemplate, sentEmails = [] }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const handleDelete = async () => {
        const ok = await confirm({
            title: t('Delete'),
            message: t('Are you sure you want to delete this project?'),
            confirmText: t('Delete'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/projects/${project.id}`);
    };

    const quotes = project.quotes || [];
    const invoices = project.invoices || [];
    const services = project.recurring_services || [];
    const payouts = project.payouts || [];
    const timelineEvents = project.timeline_events || [];
    const notes = project.notes || [];
    const attachments: Attachment[] = project.documents || [];

    const expiredServices = services.filter(s => s.status === 'expired' || s.status === 'suspended');
    const totalPayouts = payouts.reduce((sum, p) => sum + Number(p.amount), 0);
    const netMargin = (project.budget || 0) - totalPayouts;

    // Payout form
    const [showPayoutForm, setShowPayoutForm] = useState(false);
    const payoutForm = useForm({
        user_id: project.developer_id?.toString() || '',
        role: 'developer',
        amount: '',
        status: 'paid',
        paid_date: new Date().toISOString().split('T')[0],
        payment_method: 'bank_transfer',
        payment_reference: '',
        notes: '',
    });

    const submitPayout = (e: React.FormEvent) => {
        e.preventDefault();
        payoutForm.post(`/admin/projects/${project.id}/payouts`, {
            preserveScroll: true,
            onSuccess: () => { setShowPayoutForm(false); payoutForm.reset(); },
        });
    };

    return (
        <AdminLayout title={project.nom_societe || t('Project')} header={t('Project Details')}>
            <Head title={project.nom_societe || t('Project')} />

            {/* Top Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href="/admin/projects" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Projects")}</Link>
                <div className="flex items-center gap-2">
                    {project.client && (
                        <button onClick={() => setShowEmailModal(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                            {t('Email client')}
                        </button>
                    )}
                    <Link href={`/admin/projects/${project.id}/documents`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        {t('Documents')}
                    </Link>
                    <Link href={`/admin/projects/${project.id}/docs`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.331 0 4.512.645 6.374 1.766m0-14.524A8.966 8.966 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.524v14.524" /></svg>
                        {t('Docs')}
                    </Link>
                    <Link href={`/admin/projects/${project.id}/budget`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                        {t('Budget')}
                    </Link>
                    <Link href={`/admin/projects/${project.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Edit')}</Link>
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">{t('Delete')}</button>
                </div>
            </div>

            {/* Expired/Suspended Service Alert */}
            {expiredServices.length > 0 && (
                <div className="mb-6">
                    {expiredServices.map(service => (
                        <div key={service.id} className={`rounded-2xl border p-4 flex items-start gap-3 mb-3 ${
                            service.status === 'suspended'
                                ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
                                : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
                        }`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                service.status === 'suspended'
                                    ? 'bg-red-100 dark:bg-red-500/20'
                                    : 'bg-amber-100 dark:bg-amber-500/20'
                            }`}>
                                <svg className={`w-5 h-5 ${service.status === 'suspended' ? 'text-red-500' : 'text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold ${service.status === 'suspended' ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                    {service.status === 'suspended' ? t('Service suspendu') : t('Service expiré')} — {service.name}
                                </p>
                                <p className={`text-xs mt-0.5 ${service.status === 'suspended' ? 'text-red-600 dark:text-red-300' : 'text-amber-600 dark:text-amber-300'}`}>
                                    {service.status === 'suspended'
                                        ? t('Ce service est suspendu depuis plus de 14 jours. Le client n\'a pas renouvelé.')
                                        : t('Ce service a expiré. Le client a été notifié. Suspension automatique dans 14 jours.')}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                    <Link href={`/admin/services/${service.id}`} className={`text-xs font-semibold ${service.status === 'suspended' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'} hover:underline`}>
                                        {t('Voir le service')} →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <ProjectHeader project={project} />

                    <ProjectRelatedDocs quotes={quotes} invoices={invoices} services={services} />

                    {/* Payouts — Répartition des paiements */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Répartition des paiements')}</h3>
                            </div>
                            <button onClick={() => setShowPayoutForm(!showPayoutForm)} className="text-xs font-semibold text-teal-500 hover:text-teal-600">
                                {showPayoutForm ? t('Annuler') : `+ ${t('Ajouter')}`}
                            </button>
                        </div>

                        {/* Summary bar */}
                        {(project.budget || 0) > 0 && (
                            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-500 dark:text-gray-400">{t('Budget')} : <strong className="text-gray-900 dark:text-white">{project.budget}€</strong></span>
                                    <span className="text-gray-500 dark:text-gray-400">{t('Versé')} : <strong className="text-gray-900 dark:text-white">{totalPayouts.toFixed(2)}€</strong></span>
                                </div>
                                <span className={`font-bold ${netMargin >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                                    {t('Marge nette')} : {netMargin.toFixed(2)}€
                                </span>
                            </div>
                        )}

                        {/* Add form */}
                        {showPayoutForm && (
                            <form onSubmit={submitPayout} className="p-6 border-b border-gray-50 dark:border-gray-700 space-y-4">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Membre')}</label>
                                        <SearchableSelect
                                            value={payoutForm.data.user_id}
                                            onChange={(val) => payoutForm.setData('user_id', val)}
                                            placeholder={t('Sélectionner...')}
                                            options={[
                                                ...(project.developer ? [{ value: String(project.developer.id), label: project.developer.name }] : []),
                                                ...(project.client ? [{ value: String(project.client.id), label: project.client.name }] : []),
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Rôle')}</label>
                                        <SearchableSelect
                                            value={payoutForm.data.role}
                                            onChange={(val) => payoutForm.setData('role', val)}
                                            options={[
                                                { value: 'developer', label: t('Développeur') },
                                                { value: 'admin', label: t('Admin') },
                                                { value: 'subcontractor', label: t('Sous-traitant') },
                                                { value: 'freelancer', label: t('Freelancer') },
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Montant (€)')}</label>
                                        <input type="number" step="0.01" value={payoutForm.data.amount} onChange={e => payoutForm.setData('amount', e.target.value)} className="w-full text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white" placeholder="100.00" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t('Méthode')}</label>
                                        <SearchableSelect
                                            value={payoutForm.data.payment_method}
                                            onChange={(val) => payoutForm.setData('payment_method', val)}
                                            options={[
                                                { value: 'bank_transfer', label: t('Virement') },
                                                { value: 'cash', label: t('Cash') },
                                                { value: 'paypal', label: 'PayPal' },
                                                { value: 'other', label: t('Autre') },
                                            ]}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input type="text" value={payoutForm.data.notes} onChange={e => payoutForm.setData('notes', e.target.value)} placeholder={t('Notes (optionnel)...')} className="flex-1 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-white" />
                                    <button type="submit" disabled={payoutForm.processing || !payoutForm.data.user_id || !payoutForm.data.amount} className="px-5 py-2 bg-teal-500 text-white text-sm font-bold rounded-lg hover:bg-teal-600 disabled:opacity-40 transition-colors">
                                        {t('Ajouter')}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Payouts list */}
                        {payouts.length === 0 ? (
                            <div className="px-6 py-8 text-center">
                                <p className="text-sm text-gray-400 dark:text-gray-500">{t('Aucun paiement enregistré.')}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {payouts.map(payout => (
                                    <div key={payout.id} className="px-6 py-3.5 flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{(payout.user?.name || '?')[0]}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{payout.user?.name || '?'}</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                                    {payout.role === 'developer' ? t('Développeur') : payout.role === 'admin' ? 'Admin' : payout.role === 'subcontractor' ? t('Sous-traitant') : 'Freelancer'}
                                                    {payout.payment_method && ` · ${payout.payment_method === 'bank_transfer' ? t('Virement') : payout.payment_method === 'cash' ? 'Cash' : payout.payment_method}`}
                                                    {payout.notes && ` · ${payout.notes}`}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{Number(payout.amount).toFixed(2)}€</p>
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500">
                                                    {payout.status === 'paid' ? (
                                                        <span className="text-emerald-500">{t('Payé')}{payout.paid_date ? ` · ${formatDate(payout.paid_date)}` : ''}</span>
                                                    ) : (
                                                        <span className="text-amber-500">{t('En attente')}</span>
                                                    )}
                                                </p>
                                            </div>
                                            {payout.status === 'pending' && (
                                                <button onClick={() => router.patch(`/admin/payouts/${payout.id}`, { status: 'paid' }, { preserveScroll: true })} className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold">{t('Marquer payé')}</button>
                                            )}
                                            <button onClick={async () => {
                                                const ok = await confirm({ title: t('Supprimer'), message: t('Supprimer ce paiement ?'), confirmText: t('Supprimer'), variant: 'danger' });
                                                if (ok) router.delete(`/admin/payouts/${payout.id}`, { preserveScroll: true });
                                            }} className="text-xs text-red-400 hover:text-red-500">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* External Documents */}
                    <ExternalDocumentsSection
                        projectId={project.id}
                        attachments={attachments}
                        showUploadModal={showUploadModal}
                        setShowUploadModal={setShowUploadModal}
                    />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Assignments */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-4">
                            <h3 className="text-white font-semibold">{t("Team")}</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            {project.client && (
                                <div>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('Client')}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                                            <span className="text-violet-600 text-xs font-semibold">{project.client.initial}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{project.client.name}</p>
                                            <p className="text-xs text-gray-500">{project.client.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {project.developer && (
                                <div>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('Developer')}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                                            <span className="text-teal-600 text-xs font-semibold">{project.developer.initial}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{project.developer.name}</p>
                                            <p className="text-xs text-gray-500">{project.developer.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {project.lead && (
                                <div>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('Referral Lead')}</span>
                                    <Link href={`/admin/leads/${project.lead.id}`} className="flex items-center gap-2 mt-1 hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{project.lead.first_name} {project.lead.last_name}</p>
                                            {project.lead.referral_partner?.user && (
                                                <p className="text-xs text-gray-500">via {project.lead.referral_partner.user.name}</p>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            )}
                            {!project.client && !project.developer && !project.lead && (
                                <p className="text-sm text-gray-400 dark:text-gray-500">{t("No team members assigned.")}</p>
                            )}
                        </div>
                    </div>

                    {/* GitHub */}
                    <GitHubCard project={project} />

                    {/* Emails section */}
                    <EmailModalSection
                        project={project}
                        emailTemplate={emailTemplate}
                        sentEmails={sentEmails}
                        showModal={showEmailModal}
                        setShowModal={setShowEmailModal}
                    />

                    {/* Unified Timeline (events + commits) */}
                    <UnifiedTimeline
                        events={timelineEvents}
                        projectId={project.id}
                        githubRepo={project.github_repo}
                        showCommits={true}
                    />

                    <DeliverablesChecklist
                        projectId={project.id}
                        deliverables={project.deliverables || []}
                        mode="admin"
                    />
                </div>
            </div>
            <ConfirmDialog />
        </AdminLayout>
    );
}

function GitHubCard({ project }: { project: any }) {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const githubConnected = !!auth.user?.github_username;
    const [editing, setEditing] = useState(false);
    const [repo, setRepo] = useState(project.github_repo || '');
    const [showToClient, setShowToClient] = useState(project.show_commits_to_client || false);
    const [saving, setSaving] = useState(false);

    const handleSave = () => {
        setSaving(true);
        router.patch(`/admin/projects/${project.id}/github`, {
            github_repo: repo,
            show_commits_to_client: showToClient,
        }, { onFinish: () => { setSaving(false); setEditing(false); }, preserveScroll: true });
    };

    const handleUnlink = () => {
        setSaving(true);
        router.patch(`/admin/projects/${project.id}/github`, {
            github_repo: null,
            show_commits_to_client: false,
        }, { onFinish: () => { setSaving(false); setRepo(''); setShowToClient(false); }, preserveScroll: true });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">GitHub</h3>
                </div>
                {project.github_repo && !editing && (
                    <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(true)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">{t('Edit')}</button>
                        <button onClick={handleUnlink} className="text-xs text-red-400 hover:text-red-500">{t('Remove')}</button>
                    </div>
                )}
            </div>

            <div className="p-5">
                {!githubConnected ? (
                    <div className="text-center py-2">
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">{t('Connect your GitHub account in your profile to link a repository.')}</p>
                        <a href="/auth/github/redirect" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            {t('Connect GitHub')}
                        </a>
                    </div>
                ) : !project.github_repo || editing ? (
                    <div className="space-y-3">
                        <p className="text-xs text-gray-400 dark:text-gray-500">{t('Connected as')} <span className="font-semibold text-gray-700 dark:text-gray-300">@{auth.user?.github_username}</span></p>
                        <div>
                            <input
                                type="text"
                                value={repo}
                                onChange={e => setRepo(e.target.value)}
                                placeholder="owner/repo"
                                className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-teal-400"
                            />
                        </div>
                        {repo && (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={showToClient} onChange={e => setShowToClient(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">{t('Show commits to client')}</span>
                            </label>
                        )}
                        <div className="flex gap-2">
                            <button onClick={handleSave} disabled={saving || !repo} className="flex-1 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg disabled:opacity-30 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                                {saving ? t('Saving...') : t('Save')}
                            </button>
                            {editing && (
                                <button onClick={() => { setEditing(false); setRepo(project.github_repo || ''); setShowToClient(project.show_commits_to_client || false); }} className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700">
                                    {t('Cancel')}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <a href={`https://github.com/${project.github_repo}`} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5">
                                {project.github_repo}
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                            </a>
                            {project.show_commits_to_client && (
                                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-2 py-0.5 rounded-full uppercase">{t('Visible to client')}</span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Commits are now merged into the unified timeline */}
        </div>
    );
}

const categoryLabels: Record<string, string> = {
    quote: 'Devis externe',
    invoice: 'Facture externe',
    contract: 'Contrat',
    brief: 'Brief / Cahier des charges',
    specification: 'Spécification',
    other: 'Autre',
};

const categoryColors: Record<string, string> = {
    quote: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
    invoice: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
    contract: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
    brief: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300',
    specification: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    other: 'bg-gray-100 dark:bg-gray-600/30 text-gray-700 dark:text-gray-300',
};

function getFileIcon(mimeType: string): { color: string; bg: string } {
    if (mimeType === 'application/pdf') return { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10' };
    if (mimeType.startsWith('image/')) return { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' };
    if (mimeType.includes('word') || mimeType.includes('document')) return { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' };
    return { color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-500/10' };
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ExternalDocumentsSection({ projectId, attachments, showUploadModal, setShowUploadModal }: {
    projectId: number;
    attachments: Attachment[];
    showUploadModal: boolean;
    setShowUploadModal: (v: boolean) => void;
}) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();

    const handleToggleVisibility = (docId: number) => {
        router.patch(`/admin/projects/${projectId}/attachments/${docId}/toggle`, {}, { preserveScroll: true });
    };

    const handleDeleteAttachment = async (docId: number) => {
        const ok = await confirm({
            title: t('Delete'),
            message: t('Are you sure you want to delete this document?'),
            confirmText: t('Delete'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/projects/${projectId}/attachments/${docId}`, { preserveScroll: true });
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{t('External Documents')}</h3>
                        {attachments.length > 0 && (
                            <span className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full">{attachments.length}</span>
                        )}
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors flex items-center gap-1.5"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                        {t('Upload')}
                    </button>
                </div>

                {attachments.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                        <svg className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                        <p className="text-sm text-gray-400 dark:text-gray-500">{t('No external documents yet.')}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {attachments.map(doc => {
                            const icon = getFileIcon(doc.mime_type);
                            return (
                                <div key={doc.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className={`w-9 h-9 rounded-lg ${icon.bg} flex items-center justify-center flex-shrink-0`}>
                                            <svg className={`w-4.5 h-4.5 ${icon.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500">{doc.original_filename}</span>
                                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${categoryColors[doc.category] || categoryColors.other}`}>
                                                    {categoryLabels[doc.category] || doc.category}
                                                </span>
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500">{formatFileSize(doc.file_size)}</span>
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500">{formatDate(doc.created_at)}</span>
                                                {doc.uploader && <span className="text-[10px] text-gray-400 dark:text-gray-500">{doc.uploader.name}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 ml-3 flex-shrink-0">
                                        <a
                                            href={`/admin/projects/${projectId}/attachments/${doc.id}/download`}
                                            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                            title={t('Download')}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                                        </a>
                                        <button
                                            onClick={() => handleToggleVisibility(doc.id)}
                                            className={`p-1.5 transition-colors ${doc.is_client_visible ? 'text-green-500 hover:text-green-600' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400'}`}
                                            title={doc.is_client_visible ? t('Visible to client — click to hide') : t('Hidden from client — click to show')}
                                        >
                                            {doc.is_client_visible ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAttachment(doc.id)}
                                            className="p-1.5 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                            title={t('Delete')}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showUploadModal && createPortal(
                <UploadAttachmentModal projectId={projectId} onClose={() => setShowUploadModal(false)} />,
                document.body
            )}
            <ConfirmDialog />
        </>
    );
}

function UploadAttachmentModal({ projectId, onClose }: { projectId: number; onClose: () => void }) {
    const { t } = useTranslation();
    const form = useForm<{
        file: File | null;
        name: string;
        category: string;
        description: string;
        is_client_visible: boolean;
    }>({
        file: null,
        name: '',
        category: 'other',
        description: '',
        is_client_visible: false,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        form.setData('file', file);
        if (file && !form.data.name) {
            form.setData('name', file.name.replace(/\.[^/.]+$/, ''));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/admin/projects/${projectId}/attachments`, {
            onSuccess: () => onClose(),
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">{t('Upload Document')}</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{t('File')} *</label>
                        <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-50 dark:file:bg-violet-500/10 file:text-violet-700 dark:file:text-violet-300 hover:file:bg-violet-100 dark:hover:file:bg-violet-500/20 cursor-pointer" accept="*/*" />
                        {form.errors.file && <p className="text-xs text-red-500 mt-1">{form.errors.file}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{t('Document Name')} *</label>
                        <input type="text" value={form.data.name} onChange={e => form.setData('name', e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent" placeholder={t('e.g. Contrat signé')} required />
                        {form.errors.name && <p className="text-xs text-red-500 mt-1">{form.errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{t('Category')} *</label>
                        <SearchableSelect
                            value={form.data.category}
                            onChange={(val) => form.setData('category', val)}
                            options={[
                                { value: 'quote', label: t('Devis externe') },
                                { value: 'invoice', label: t('Facture externe') },
                                { value: 'contract', label: t('Contrat') },
                                { value: 'brief', label: t('Brief / Cahier des charges') },
                                { value: 'specification', label: t('Spécification') },
                                { value: 'other', label: t('Autre') },
                            ]}
                        />
                        {form.errors.category && <p className="text-xs text-red-500 mt-1">{form.errors.category}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">{t('Description')}</label>
                        <textarea value={form.data.description} onChange={e => form.setData('description', e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none" placeholder={t('Description optionnelle...')} />
                        {form.errors.description && <p className="text-xs text-red-500 mt-1">{form.errors.description}</p>}
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" checked={form.data.is_client_visible} onChange={e => form.setData('is_client_visible', e.target.checked)} className="sr-only peer" />
                            <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-violet-400 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-500" />
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{t('Visible to client')}</span>
                    </label>
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">{t('Cancel')}</button>
                        <button type="submit" disabled={form.processing || !form.data.file}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 flex items-center gap-2">
                            {form.processing ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                            )}
                            {t('Upload')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
