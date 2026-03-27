import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { Project, User, Lead, Quote, Invoice, RecurringService, TimelineEvent } from '@/types';
import { formatDate, formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

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

interface Props {
    project: Project & {
        client?: User;
        developer?: User;
        lead?: Lead & { referral_partner?: { user?: User } };
        quotes?: Quote[];
        invoices?: Invoice[];
        recurring_services?: RecurringService[];
        timeline_events?: TimelineEvent[];
        notes?: ProjectNote[];
        documents?: ProjectDocument[];
    };
}

export default function ProjectShow({ project }: Props) {
    const { t } = useTranslation();
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(`/admin/projects/${project.id}`);
        }
    };

    const quotes = project.quotes || [];
    const invoices = project.invoices || [];
    const services = project.recurring_services || [];
    const timelineEvents = project.timeline_events || [];
    const notes = project.notes || [];

    return (
        <AdminLayout title={project.nom_societe || t('Project')} header={t('Project Details')}>
            <Head title={project.nom_societe || t('Project')} />

            {/* Top Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href="/admin/projects" className="text-sm text-gray-500 hover:text-gray-700">&larr; {t("Back to Projects")}</Link>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/projects/${project.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('Edit')}</Link>
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50">{t('Delete')}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Header */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-white text-xl font-bold">{project.nom_societe}</h2>
                                    {project.type_societe && <p className="text-white/80 text-sm mt-1">{project.type_societe}</p>}
                                </div>
                                <Badge status={project.status} className="text-sm" />
                            </div>
                        </div>
                        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {project.type_site && (
                                <div>
                                    <span className="text-gray-500 block">{t("Site Type")}</span>
                                    <span className="font-medium text-gray-900">{formatStatus(project.type_site)}</span>
                                </div>
                            )}
                            {project.lieu && (
                                <div>
                                    <span className="text-gray-500 block">{t("Location")}</span>
                                    <span className="font-medium text-gray-900">{project.lieu}</span>
                                </div>
                            )}
                            {project.start_date && (
                                <div>
                                    <span className="text-gray-500 block">{t("Start Date")}</span>
                                    <span className="font-medium text-gray-900">{formatDate(project.start_date)}</span>
                                </div>
                            )}
                            {project.deadline && (
                                <div>
                                    <span className="text-gray-500 block">{t("Deadline")}</span>
                                    <span className="font-medium text-gray-900">{formatDate(project.deadline)}</span>
                                </div>
                            )}
                            {project.end_date && (
                                <div>
                                    <span className="text-gray-500 block">{t("End Date")}</span>
                                    <span className="font-medium text-gray-900">{formatDate(project.end_date)}</span>
                                </div>
                            )}
                            {project.budget != null && (
                                <div>
                                    <span className="text-gray-500 block">{t("Budget")}</span>
                                    <span className="font-medium text-gray-900"><ProtectedAmount amount={project.budget} /></span>
                                </div>
                            )}
                            {project.total_billed != null && (
                                <div>
                                    <span className="text-gray-500 block">{t("Total Billed")}</span>
                                    <span className="font-medium text-gray-900"><ProtectedAmount amount={project.total_billed} /></span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500 block">{t("Created")}</span>
                                <span className="font-medium text-gray-900">{formatDate(project.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Description")}</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.description}</p>
                        </div>
                    )}

                    {/* Related Quotes */}
                    {quotes.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="font-semibold text-gray-900">{t("Quotes")}</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {quotes.map(quote => (
                                    <Link key={quote.id} href={`/admin/quotes/${quote.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                                        <div>
                                            <span className="font-medium text-gray-900">{quote.quote_number}</span>
                                            <span className="ml-2 text-sm text-gray-500">{quote.title}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge status={quote.status} />
                                            <ProtectedAmount amount={quote.total} className="font-medium text-sm" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Invoices */}
                    {invoices.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="font-semibold text-gray-900">{t("Invoices")}</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {invoices.map(inv => (
                                    <Link key={inv.id} href={`/admin/invoices/${inv.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                                        <div>
                                            <span className="font-medium text-gray-900">{inv.invoice_number}</span>
                                            <span className="ml-2 text-sm text-gray-500">{inv.title}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge status={inv.status} />
                                            <ProtectedAmount amount={inv.total} className="font-medium text-sm" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Services */}
                    {services.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="font-semibold text-gray-900">{t("Recurring Services")}</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {services.map(svc => (
                                    <Link key={svc.id} href={`/admin/services/${svc.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors">
                                        <div>
                                            <span className="font-medium text-gray-900">{svc.name}</span>
                                            {svc.provider && <span className="ml-2 text-sm text-gray-500">({svc.provider})</span>}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge status={svc.status} />
                                            <span className="text-sm text-gray-500">{formatDate(svc.expiry_date)}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {notes.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="font-semibold text-gray-900">{t("Notes")}</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {notes.map(note => (
                                    <div key={note.id} className="px-6 py-4">
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{note.content}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                            {note.user && <span>{note.user.name}</span>}
                                            <span>{formatDate(note.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Assignments */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-4">
                            <h3 className="text-white font-semibold">{t("Team")}</h3>
                        </div>
                        <div className="p-5 space-y-4">
                            {project.client && (
                                <div>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                                            <span className="text-violet-600 text-xs font-semibold">{project.client.initial}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{project.client.name}</p>
                                            <p className="text-xs text-gray-500">{project.client.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {project.developer && (
                                <div>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Developer</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                                            <span className="text-teal-600 text-xs font-semibold">{project.developer.initial}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{project.developer.name}</p>
                                            <p className="text-xs text-gray-500">{project.developer.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {project.lead && (
                                <div>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Referral Lead</span>
                                    <Link href={`/admin/leads/${project.lead.id}`} className="flex items-center gap-2 mt-1 hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{project.lead.first_name} {project.lead.last_name}</p>
                                            {project.lead.referral_partner?.user && (
                                                <p className="text-xs text-gray-500">via {project.lead.referral_partner.user.name}</p>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            )}
                            {!project.client && !project.developer && !project.lead && (
                                <p className="text-sm text-gray-400">{t("No team members assigned.")}</p>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-50">
                            <h3 className="font-semibold text-gray-900">{t("Timeline")}</h3>
                        </div>
                        <div className="p-5">
                            {timelineEvents.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-4">{t("No activity yet.")}</p>
                            ) : (
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
                                    <div className="space-y-5">
                                        {timelineEvents.map(event => (
                                            <div key={event.id} className="relative flex items-start ml-4 pl-6">
                                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-violet-400" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                                        <span className="text-xs text-gray-400">{formatDate(event.created_at)}</span>
                                                    </div>
                                                    {event.description && <p className="text-sm text-gray-500 mt-0.5">{event.description}</p>}
                                                    {event.old_value && event.new_value && (
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge status={event.old_value} />
                                                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                                            <Badge status={event.new_value} />
                                                        </div>
                                                    )}
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
