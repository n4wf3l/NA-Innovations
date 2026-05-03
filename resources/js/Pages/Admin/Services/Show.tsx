import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { RecurringService, User, Project } from '@/types';
import { formatDate, formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import NotesSection from '@/Components/ui/NotesSection';
import { useConfirm } from '@/hooks/useConfirm';

interface ServiceRenewal {
    id: number;
    renewal_date: string;
    new_expiry_date: string;
    cost: number;
    billed_amount: number;
    status: string;
}

interface ServiceNote {
    id: number;
    content: string;
    is_private: boolean;
    is_pinned: boolean;
    created_at: string;
    user?: { id: number; name: string };
}

interface Props {
    service: RecurringService & {
        provider_account?: string;
        provider_reference?: string;
        client_id?: number;
        projet_id?: number;
        purchase_date?: string;
        currency?: string;
        payment_mode?: string;
        auto_renew?: boolean;
        alert_days_before?: number;
        login_url?: string;
        credentials_note?: string;
        description?: string;
        notes?: string;
        client?: User;
        projet?: Project;
        renewals?: ServiceRenewal[];
    };
    serviceNotes?: ServiceNote[];
}

export default function ServiceShow({ service, serviceNotes = [] }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const handleDelete = async () => {
        const ok = await confirm({
            title: t('Delete'),
            message: t('Are you sure you want to delete this service?'),
            confirmText: t('Delete'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/services/${service.id}`);
    };

    const handleRenew = async () => {
        const ok = await confirm({
            title: t('Renouveler'),
            message: t('Renouveler ce service ? La date d\'expiration sera mise à jour.'),
            confirmText: t('Renouveler'),
            variant: 'info',
        });
        if (!ok) return;
        router.post(`/admin/services/${service.id}/renew`);
    };

    const handleSuspend = async () => {
        const ok = await confirm({
            title: t('Suspendre'),
            message: t('Suspendre ce service ? Le projet associé sera mis en pause.'),
            confirmText: t('Suspendre'),
            variant: 'warning',
        });
        if (!ok) return;
        router.patch(`/admin/services/${service.id}/status`, { status: 'suspended' }, { preserveScroll: true });
    };

    const handleReactivate = async () => {
        const ok = await confirm({
            title: t('Réactiver'),
            message: t('Réactiver ce service ? Le projet associé sera remis en cours.'),
            confirmText: t('Réactiver'),
            variant: 'info',
        });
        if (!ok) return;
        router.patch(`/admin/services/${service.id}/status`, { status: 'active' }, { preserveScroll: true });
    };

    const renewals = service.renewals || [];
    const margin = service.billed_price - service.real_cost;
    const marginPercent = service.real_cost > 0 ? ((margin / service.real_cost) * 100).toFixed(1) : '--';
    const isExpired = service.status === 'expired';
    const isSuspended = service.status === 'suspended';
    const isInactive = isExpired || isSuspended;

    return (
        <AdminLayout title={service.name} header={t('Service Details')}>
            <Head title={service.name} />

            {/* Expired/Suspended Alert Banner */}
            {isInactive && (
                <div className={`rounded-2xl border p-5 mb-6 ${
                    isSuspended
                        ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
                        : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
                }`}>
                    <div className="flex items-start gap-3">
                        <svg className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isSuspended ? 'text-red-500' : 'text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        <div className="flex-1">
                            <p className={`font-bold ${isSuspended ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                {isSuspended ? t('Service suspendu') : t('Service expiré')}
                            </p>
                            <p className={`text-sm mt-1 ${isSuspended ? 'text-red-600/80 dark:text-red-300/80' : 'text-amber-600/80 dark:text-amber-300/80'}`}>
                                {isSuspended
                                    ? t('Ce service est suspendu. Le client n\'a pas renouvelé. Le projet associé a été mis en pause.')
                                    : t('Ce service a expiré. Le client a été notifié. Sans renouvellement, il sera suspendu automatiquement après 14 jours.')}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                                <button onClick={handleRenew} className="px-4 py-2 text-sm font-bold text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-colors">
                                    {t('Renouveler maintenant')}
                                </button>
                                {isExpired && (
                                    <button onClick={handleSuspend} className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                        {t('Suspendre maintenant')}
                                    </button>
                                )}
                                {isSuspended && (
                                    <button onClick={handleReactivate} className="px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-500/30 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                                        {t('Réactiver le service')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href="/admin/services" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Services")}</Link>
                <div className="flex items-center gap-2">
                    {!isInactive && <button onClick={handleRenew} className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600">{t('Renew')}</button>}
                    <Link href={`/admin/services/${service.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Edit')}</Link>
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">{t('Delete')}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Service Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-white text-xl font-bold">{service.name}</h2>
                                    {service.provider && <p className="text-white/80 text-sm mt-1">{service.provider}</p>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge status={service.type} />
                                    <Badge status={service.status} />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {service.purchase_date && (
                                <div>
                                    <span className="text-gray-500 block">{t("Purchase Date")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatDate(service.purchase_date)}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500 block">{t("Expiry Date")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatDate(service.expiry_date)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">{t("Frequency")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatStatus(service.frequency)}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">{t("Auto Renew")}</span>
                                <span className={`font-medium ${service.auto_renew ? 'text-emerald-600' : 'text-gray-400'}`}>
                                    {service.auto_renew ? 'Yes' : 'No'}
                                </span>
                            </div>
                            {service.payment_mode && (
                                <div>
                                    <span className="text-gray-500 block">{t("Payment Mode")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatStatus(service.payment_mode)}</span>
                                </div>
                            )}
                            {service.provider_account && (
                                <div>
                                    <span className="text-gray-500 block">{t("Provider Account")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{service.provider_account}</span>
                                </div>
                            )}
                            {service.provider_reference && (
                                <div>
                                    <span className="text-gray-500 block">{t("Provider Ref.")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{service.provider_reference}</span>
                                </div>
                            )}
                            {service.login_url && (
                                <div>
                                    <span className="text-gray-500 block">{t("Login URL")}</span>
                                    <a href={service.login_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-700 truncate block">{t("Open")}</a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pricing / Margin Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Pricing & Margin")}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                                <span className="text-xs text-gray-500 block mb-1">{t("Real Cost")}</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white"><ProtectedAmount amount={service.real_cost} /></span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                                <span className="text-xs text-gray-500 block mb-1">{t("Billed Price")}</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white"><ProtectedAmount amount={service.billed_price} /></span>
                            </div>
                            <div className={`rounded-xl p-4 text-center ${margin >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                <span className="text-xs text-gray-500 block mb-1">{t("Margin")}</span>
                                <span className={`text-lg font-bold ${margin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    <ProtectedAmount amount={margin} />
                                </span>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                                <span className="text-xs text-gray-500 block mb-1">{t("Margin")} %</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">{marginPercent}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {service.description && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Description")}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{service.description}</p>
                        </div>
                    )}

                    {/* Renewal History */}
                    {renewals.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{t("Renewal History")}</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                                            <th className="text-left px-6 py-3 font-medium text-gray-500">{t("Renewal Date")}</th>
                                            <th className="text-left px-6 py-3 font-medium text-gray-500">{t("New Expiry")}</th>
                                            <th className="text-right px-6 py-3 font-medium text-gray-500">{t("Cost")}</th>
                                            <th className="text-right px-6 py-3 font-medium text-gray-500">{t("Billed")}</th>
                                            <th className="text-left px-6 py-3 font-medium text-gray-500">{t("Status")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renewals.map(renewal => (
                                            <tr key={renewal.id} className="border-b border-gray-50 dark:border-gray-700">
                                                <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{formatDate(renewal.renewal_date)}</td>
                                                <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{formatDate(renewal.new_expiry_date)}</td>
                                                <td className="px-6 py-3 text-right"><ProtectedAmount amount={renewal.cost} /></td>
                                                <td className="px-6 py-3 text-right"><ProtectedAmount amount={renewal.billed_amount} /></td>
                                                <td className="px-6 py-3"><Badge status={renewal.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Client */}
                    {service.client && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-4">
                                <h3 className="text-white font-semibold">{t("Client")}</h3>
                            </div>
                            <div className="p-5 space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">{t("Name")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{service.client.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">{t("Email")}</span>
                                    <a href={`mailto:${service.client.email}`} className="text-teal-600 hover:text-teal-700">{service.client.email}</a>
                                </div>
                                {service.client.company_name && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">{t("Company")}</span>
                                        <span className="text-gray-700 dark:text-gray-300">{service.client.company_name}</span>
                                    </div>
                                )}
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                    <Link href={`/admin/clients/${service.client.id}/edit`} className="text-sm text-teal-600 hover:text-teal-700">{t("View Client")}</Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Project */}
                    {service.projet && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Linked Project")}</h4>
                            <Link href={`/admin/projects/${service.projet.id}`} className="text-sm text-teal-600 hover:text-teal-700 font-medium">{service.projet.nom_societe}</Link>
                        </div>
                    )}

                    {/* Credentials */}
                    {service.credentials_note && (
                        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
                            <h4 className="text-sm font-semibold text-amber-800 uppercase tracking-wider mb-3">{t("Credentials")}</h4>
                            <p className="text-sm text-amber-700 whitespace-pre-wrap">{service.credentials_note}</p>
                        </div>
                    )}

                    {/* Free-text notes from the service's "notes" column */}
                    {typeof service.notes === 'string' && service.notes.trim() && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Notes")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{service.notes}</p>
                        </div>
                    )}

                    {/* Discussion notes (separate from the column to avoid Eloquent name conflict) */}
                    <NotesSection notes={serviceNotes} notableType="service" notableId={service.id} />
                </div>
            </div>
            <ConfirmDialog />
        </AdminLayout>
    );
}
