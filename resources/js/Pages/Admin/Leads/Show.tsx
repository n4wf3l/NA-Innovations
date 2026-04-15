import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { Lead, TimelineEvent } from '@/types';
import { formatCurrency, formatDate, formatStatus, formatProjectType } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import NotesSection from '@/Components/ui/NotesSection';
import WhatsAppButton from '@/Components/ui/WhatsAppButton';
import { useConfirm } from '@/hooks/useConfirm';

interface Props {
    lead: Lead;
    timeline: TimelineEvent[];
}

export default function LeadShow({ lead, timeline }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const handleDelete = async () => {
        const ok = await confirm({
            title: t('Delete'),
            message: t('Are you sure you want to delete this lead?'),
            confirmText: t('Delete'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/leads/${lead.id}`);
    };

    return (
        <AdminLayout title={`${lead.first_name} ${lead.last_name}`} header={t('Lead Details')}>
            <Head title={`${lead.first_name} ${lead.last_name}`} />

            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/leads" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Leads")}</Link>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/leads/${lead.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Edit')}</Link>
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">{t('Delete')}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4">
                            <h3 className="text-white font-semibold">{lead.first_name} {lead.last_name}</h3>
                            {lead.company_name && <p className="text-white/70 text-sm">{lead.company_name}</p>}
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{t("Status")}</span>
                                <Badge status={lead.status} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{t("Email")}</span>
                                <a href={`mailto:${lead.email}`} className="text-sm text-teal-600 hover:text-teal-700">{lead.email}</a>
                            </div>
                            {lead.phone && (
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm text-gray-500">{t("Phone")}</span>
                                    <div className="flex items-center gap-2">
                                        <a href={`tel:${lead.phone}`} className="text-sm text-teal-600 hover:text-teal-700">{lead.phone}</a>
                                        <WhatsAppButton phone={lead.phone} message={t('Bonjour {{name}}, je reviens vers vous concernant votre demande.', { name: lead.first_name } as any)} />
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{t("Source")}</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{formatStatus(lead.source)}</span>
                            </div>
                            {lead.estimated_budget && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{t("Budget")}</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(lead.estimated_budget)}</span>
                                </div>
                            )}
                            {lead.service_interest && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{t("Interest")}</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{formatProjectType(lead.service_interest)}</span>
                                </div>
                            )}
                            {lead.referral_partner && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{t("Partner")}</span>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{lead.referral_partner.user?.name}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{t("Created")}</span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{formatDate(lead.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Admin notes (text field) */}
                    {typeof lead.notes === 'string' && lead.notes && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">{t("Notes")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{lead.notes}</p>
                        </div>
                    )}

                    {lead.lost_reason && (
                        <div className="bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20 p-5">
                            <h4 className="text-sm font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider mb-3">{t("Lost Reason")}</h4>
                            <p className="text-sm text-red-600 dark:text-red-400">{lead.lost_reason}</p>
                        </div>
                    )}

                    {/* Notes section (polymorphic relation) */}
                    <NotesSection notes={Array.isArray(lead.notes) ? lead.notes : []} notableType="lead" notableId={lead.id} />
                </div>

                {/* Timeline */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{t("Activity Timeline")}</h3>
                        </div>
                        <div className="p-5">
                            {timeline.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-8">{t("No activity yet.")}</p>
                            ) : (
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                                    <div className="space-y-6">
                                        {timeline.map(event => (
                                            <div key={event.id} className="relative flex items-start ml-4 pl-6">
                                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-violet-400" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                                                        <span className="text-xs text-gray-400">{new Date(event.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    {event.description && <p className="text-sm text-gray-500 mt-0.5">{event.description}</p>}
                                                    {event.old_value && event.new_value && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge status={event.old_value} />
                                                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                                            <Badge status={event.new_value} />
                                                        </div>
                                                    )}
                                                    {event.user && <p className="text-xs text-gray-400 mt-1">by {event.user.name}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDialog />
        </AdminLayout>
    );
}
