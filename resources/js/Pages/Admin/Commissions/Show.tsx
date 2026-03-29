import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { formatDate } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useConfirm } from '@/hooks/useConfirm';

interface Props {
    commission: {
        id: number;
        base_amount: number;
        commission_rate: number;
        commission_amount: number;
        status: string;
        scheduled_payment_date?: string;
        paid_date?: string;
        payment_reference?: string;
        created_at: string;
        referral_partner?: { id: number; referral_code: string; user?: { id: number; name: string; email: string } };
        lead?: { id: number; first_name: string; last_name: string; email: string; company_name?: string };
        client?: { id: number; name: string; email: string };
        projet?: { id: number; nom_societe: string; status: string };
        invoice?: { id: number; invoice_number: string; total: number; status: string };
    };
}

export default function CommissionShow({ commission }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const c = commission;

    const handleConfirm = () => router.patch(`/admin/commissions/${c.id}/confirm`, {}, { preserveScroll: true });
    const handleSchedule = () => router.patch(`/admin/commissions/${c.id}/schedule`, {}, { preserveScroll: true });
    const handlePay = () => router.patch(`/admin/commissions/${c.id}/pay`, {}, { preserveScroll: true });
    const handleDelete = async () => {
        const ok = await confirm({ title: t('Supprimer'), message: t('Supprimer cette commission ?'), confirmText: t('Supprimer'), variant: 'danger' });
        if (ok) router.delete(`/admin/commissions/${c.id}`);
    };

    const card = 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden';

    return (
        <AdminLayout title={t('Commission Details')} header={t('Commission Details')}>
            <Head title={t('Commission Details')} />
            <ConfirmDialog />

            {/* Top bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href="/admin/commissions" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t('Back to Commissions')}</Link>
                <div className="flex items-center gap-2">
                    {c.status === 'estimated' && (
                        <button onClick={handleConfirm} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors">{t('Confirmer')}</button>
                    )}
                    {c.status === 'confirmed' && (
                        <button onClick={handleSchedule} className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors">{t('Planifier paiement')}</button>
                    )}
                    {(c.status === 'confirmed' || c.status === 'scheduled') && (
                        <button onClick={handlePay} className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors">{t('Marquer payé')}</button>
                    )}
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">{t('Supprimer')}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Commission card */}
                    <div className={card}>
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Commission')} #{c.id}</h3>
                            <Badge status={c.status} />
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('Base amount')}</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white"><ProtectedAmount amount={c.base_amount} /></p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('Rate')}</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white">{c.commission_rate}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('Commission')}</p>
                                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400"><ProtectedAmount amount={c.commission_amount} /></p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('Created')}</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(c.created_at)}</p>
                                </div>
                            </div>

                            {/* Payment info */}
                            {(c.scheduled_payment_date || c.paid_date || c.payment_reference) && (
                                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {c.scheduled_payment_date && (
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('Scheduled')}</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(c.scheduled_payment_date)}</p>
                                        </div>
                                    )}
                                    {c.paid_date && (
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('Paid on')}</p>
                                            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{formatDate(c.paid_date)}</p>
                                        </div>
                                    )}
                                    {c.payment_reference && (
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{t('Reference')}</p>
                                            <p className="text-sm font-mono text-gray-900 dark:text-white">{c.payment_reference}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lead info */}
                    {c.lead && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Lead associé')}</h3>
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{c.lead.first_name} {c.lead.last_name}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{c.lead.email}{c.lead.company_name ? ` · ${c.lead.company_name}` : ''}</p>
                                </div>
                                <Link href={`/admin/leads/${c.lead.id}`} className="text-xs font-semibold text-teal-500 hover:text-teal-600">{t('Voir')} →</Link>
                            </div>
                        </div>
                    )}

                    {/* Invoice info */}
                    {c.invoice && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Facture associée')}</h3>
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{c.invoice.invoice_number}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500"><ProtectedAmount amount={c.invoice.total} /></p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge status={c.invoice.status} />
                                    <Link href={`/admin/invoices/${c.invoice.id}`} className="text-xs font-semibold text-teal-500 hover:text-teal-600">{t('Voir')} →</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Partner */}
                    {c.referral_partner?.user && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Partenaire')}</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center">
                                        <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{c.referral_partner.user.name[0]}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{c.referral_partner.user.name}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{c.referral_partner.user.email}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{t('Code')} : <span className="font-mono text-rose-500">{c.referral_partner.referral_code}</span></p>
                                <Link href={`/admin/partners/${c.referral_partner.id}`} className="mt-3 inline-block text-xs font-semibold text-rose-500 hover:text-rose-600">{t('Voir le partenaire')} →</Link>
                            </div>
                        </div>
                    )}

                    {/* Project */}
                    {c.projet && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Projet')}</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.projet.nom_societe}</p>
                                <Badge status={c.projet.status} />
                                <Link href={`/admin/projects/${c.projet.id}`} className="mt-3 inline-block text-xs font-semibold text-teal-500 hover:text-teal-600">{t('Voir le projet')} →</Link>
                            </div>
                        </div>
                    )}

                    {/* Client */}
                    {c.client && (
                        <div className={card}>
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('Client')}</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{c.client.name}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{c.client.email}</p>
                                <Link href={`/admin/clients/${c.client.id}`} className="mt-3 inline-block text-xs font-semibold text-teal-500 hover:text-teal-600">{t('Voir le client')} →</Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
