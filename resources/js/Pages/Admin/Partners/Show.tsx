import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { formatDate, formatCurrency } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import WhatsAppButton from '@/Components/ui/WhatsAppButton';

interface Props {
    partner: any;
    totalLeads: number;
    wonLeads: number;
    conversionRate: number;
    totalCommissionEstimated: number;
    totalCommissionConfirmed: number;
    totalCommissionPaid: number;
}

export default function PartnerShow({ partner, totalLeads, wonLeads, conversionRate, totalCommissionEstimated, totalCommissionConfirmed, totalCommissionPaid }: Props) {
    const { t } = useTranslation();
    const user = partner.user;
    const leads = partner.leads || [];
    const commissions = partner.commissions || [];

    return (
        <AdminLayout title={user?.name || t('Partenaire')} header={t('Fiche partenaire')}>
            <Head title={user?.name || t('Partenaire')} />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href="/admin/partners" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t('Retour aux partenaires')}</Link>
                <Link href={`/admin/partners/${partner.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Modifier')}</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left - Info + Stats */}
                <div className="space-y-6">
                    {/* Profile card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                    <span className="text-white text-xl font-black">{(user?.name || '?').substring(0, 2).toUpperCase()}</span>
                                </div>
                                <div>
                                    <h2 className="text-white text-xl font-bold">{user?.name}</h2>
                                    <p className="text-rose-200 text-sm">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 space-y-3">
                            {user?.phone && (
                                <div className="flex items-center justify-between gap-2 text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">{t('Téléphone')}</span>
                                    <div className="flex items-center gap-2">
                                        <a href={`tel:${user.phone}`} className="font-medium text-gray-900 dark:text-white hover:text-teal-600">{user.phone}</a>
                                        <WhatsAppButton phone={user.phone} message={t('Bonjour {{name}}, j\'espère que tu vas bien.', { name: user.name } as any)} />
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t('Code parrainage')}</span>
                                <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded">{partner.referral_code}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t('Taux de commission')}</span>
                                <span className="font-bold text-gray-900 dark:text-white">{partner.default_commission_rate}%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t('Méthode de paiement')}</span>
                                <span className="font-medium text-gray-900 dark:text-white capitalize">{partner.payment_method?.replace('_', ' ')}</span>
                            </div>
                            {partner.bank_iban && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">IBAN</span>
                                    <span className="font-mono text-xs text-gray-900 dark:text-white">{partner.bank_iban}</span>
                                </div>
                            )}
                            {partner.paypal_email && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">PayPal</span>
                                    <span className="text-xs text-gray-900 dark:text-white">{partner.paypal_email}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t('Statut')}</span>
                                <Badge status={partner.is_active ? 'active' : 'inactive'} />
                            </div>
                        </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{totalLeads}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold mt-1">{t('Leads soumis')}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{wonLeads}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold mt-1">{t('Leads gagnés')}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{conversionRate}%</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold mt-1">{t('Conversion')}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(totalCommissionPaid)}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold mt-1">{t('Payé')}</p>
                        </div>
                    </div>

                    {/* Commission summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t('Commissions')}</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t('Estimées')}</span>
                                <span className="font-medium text-amber-600 dark:text-amber-400">{formatCurrency(totalCommissionEstimated)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 dark:text-gray-400">{t('Confirmées')}</span>
                                <span className="font-medium text-blue-600 dark:text-blue-400">{formatCurrency(totalCommissionConfirmed)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-50 dark:border-gray-700">
                                <span className="text-gray-500 dark:text-gray-400 font-semibold">{t('Payées')}</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalCommissionPaid)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Leads + Commissions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent leads */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Derniers leads')}</h3>
                            <span className="text-xs text-gray-400 dark:text-gray-500">{totalLeads} {t('au total')}</span>
                        </div>
                        {leads.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('Aucun lead soumis.')}</div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {leads.map((lead: any) => (
                                    <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{lead.first_name} {lead.last_name}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">{lead.company_name || lead.email}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {lead.estimated_budget && <span className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(lead.estimated_budget)}</span>}
                                            <Badge status={lead.status} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Commissions */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Historique commissions')}</h3>
                        </div>
                        {commissions.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('Aucune commission.')}</div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {commissions.map((comm: any) => (
                                    <div key={comm.id} className="flex items-center justify-between px-6 py-3.5">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(comm.commission_amount)}
                                                <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">({comm.commission_rate}%)</span>
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {t('Base')} : {formatCurrency(comm.base_amount)} · {formatDate(comm.created_at)}
                                            </p>
                                        </div>
                                        <Badge status={comm.status} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
