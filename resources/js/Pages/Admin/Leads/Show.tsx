import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { Lead, TimelineEvent } from '@/types';
import { formatCurrency, formatDate, formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    lead: Lead;
    timeline: TimelineEvent[];
}

export default function LeadShow({ lead, timeline }: Props) {
    const { t } = useTranslation();
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this lead?')) {
            router.delete(`/admin/leads/${lead.id}`);
        }
    };

    return (
        <AdminLayout title={`${lead.first_name} ${lead.last_name}`} header={t('Lead Details')}>
            <Head title={`${lead.first_name} ${lead.last_name}`} />

            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/leads" className="text-sm text-gray-500 hover:text-gray-700">&larr; {t("Back to Leads")}</Link>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/leads/${lead.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('Edit')}</Link>
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50">{t('Delete')}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
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
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{t("Phone")}</span>
                                    <a href={`tel:${lead.phone}`} className="text-sm text-teal-600 hover:text-teal-700">{lead.phone}</a>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{t("Source")}</span>
                                <span className="text-sm text-gray-700">{formatStatus(lead.source)}</span>
                            </div>
                            {lead.estimated_budget && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{t("Budget")}</span>
                                    <span className="text-sm font-medium text-gray-900">{formatCurrency(lead.estimated_budget)}</span>
                                </div>
                            )}
                            {lead.service_interest && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{t("Interest")}</span>
                                    <span className="text-sm text-gray-700">{lead.service_interest}</span>
                                </div>
                            )}
                            {lead.referral_partner && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{t("Partner")}</span>
                                    <span className="text-sm text-gray-700">{lead.referral_partner.user?.name}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{t("Created")}</span>
                                <span className="text-sm text-gray-700">{formatDate(lead.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {lead.notes && (
                        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Notes")}</h4>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{lead.notes}</p>
                        </div>
                    )}

                    {lead.lost_reason && (
                        <div className="bg-red-50 rounded-xl border border-red-200 p-5">
                            <h4 className="text-sm font-semibold text-red-700 uppercase tracking-wider mb-3">{t("Lost Reason")}</h4>
                            <p className="text-sm text-red-600">{lead.lost_reason}</p>
                        </div>
                    )}
                </div>

                {/* Timeline */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-50">
                            <h3 className="font-semibold text-gray-900">{t("Activity Timeline")}</h3>
                        </div>
                        <div className="p-5">
                            {timeline.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-8">{t("No activity yet.")}</p>
                            ) : (
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                                    <div className="space-y-6">
                                        {timeline.map(event => (
                                            <div key={event.id} className="relative flex items-start ml-4 pl-6">
                                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-violet-400" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
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
        </AdminLayout>
    );
}
