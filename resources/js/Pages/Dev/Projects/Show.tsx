import DevLayout from '@/Layouts/DevLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import { formatCurrency, formatDate, formatStatus } from '@/lib/utils';
import CommitList from '@/Components/ui/CommitList';
import { useTranslation } from 'react-i18next';

interface Props {
    project: any;
}

export default function ProjectShow({ project }: Props) {
    const { t } = useTranslation();
    const { post, processing } = useForm({});
    const isUnassigned = !project.developer_id;
    const partnerName = project.lead?.referral_partner?.user?.name;

    function handleClaim(e: React.FormEvent) {
        e.preventDefault();
        if (confirm(`Are you sure you want to claim "${project.nom_societe}"?`)) {
            post(`/dev/projects/${project.id}/claim`);
        }
    }

    return (
        <DevLayout title={project.nom_societe || 'Project Details'}>
            <Head title={project.nom_societe || 'Project Details'} />

            {/* Back link */}
            <div className="mb-6">
                <Link href="/dev/projects" className="text-sm text-gray-400 hover:text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    Back to Projects
                </Link>
            </div>

            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-2xl font-black text-gray-900">{project.nom_societe || 'Untitled Project'}</h1>
                            <Badge status={project.status} />
                        </div>
                        {project.description && (
                            <p className="text-sm text-gray-500 max-w-2xl">{project.description}</p>
                        )}
                    </div>
                    {isUnassigned && (
                        <form onSubmit={handleClaim} className="flex-shrink-0">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? t('Claiming...') : t('Claim This Project')}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Details */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50">
                            <h3 className="font-bold text-gray-900 text-sm">{t("Project Details")}</h3>
                        </div>
                        <div className="p-6">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DetailItem label={t("Type")} value={project.type_site || '-'} />
                                <DetailItem label={t("Technology")} value={project.langage_programmation || '-'} />
                                <DetailItem label={t("Budget")} value={project.budget ? formatCurrency(project.budget) : '-'} />
                                <DetailItem label={t("Total Billed")} value={project.total_billed ? formatCurrency(project.total_billed) : '-'} />
                                <DetailItem label={t("Start Date")} value={project.start_date ? formatDate(project.start_date) : '-'} />
                                <DetailItem label={t("Deadline")} value={project.deadline ? formatDate(project.deadline) : '-'} />
                                <DetailItem label={t("Location")} value={project.lieu || '-'} />
                                <DetailItem label={t("Dev Days")} value={project.jours_developpement ? `${project.jours_developpement} days` : '-'} />
                            </dl>
                        </div>
                    </div>

                    {/* GitHub Commits */}
                    {project.github_repo && <CommitList projectId={project.id} />}

                    {/* Timeline */}
                    {project.timeline_events && project.timeline_events.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="font-bold text-gray-900 text-sm">{t("Timeline")}</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {project.timeline_events.map((event: any) => (
                                        <div key={event.id} className="flex items-start space-x-3">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                                {event.description && (
                                                    <p className="text-xs text-gray-400 mt-0.5">{event.description}</p>
                                                )}
                                                <p className="text-xs text-gray-300 mt-1">
                                                    {new Date(event.created_at).toLocaleString()}
                                                    {event.user && ` by ${event.user.name}`}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quotes */}
                    {project.quotes && project.quotes.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="font-bold text-gray-900 text-sm">{t("Quotes")}</h3>
                            </div>
                            <div>
                                {project.quotes.map((quote: any) => (
                                    <div key={quote.id} className="flex items-center justify-between px-6 py-3.5 border-b border-gray-50 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{quote.quote_number}</p>
                                            <p className="text-xs text-gray-400">{quote.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">{formatCurrency(quote.total)}</p>
                                            <Badge status={quote.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Invoices */}
                    {project.invoices && project.invoices.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="font-bold text-gray-900 text-sm">{t("Invoices")}</h3>
                            </div>
                            <div>
                                {project.invoices.map((invoice: any) => (
                                    <div key={invoice.id} className="flex items-center justify-between px-6 py-3.5 border-b border-gray-50 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{invoice.invoice_number}</p>
                                            <p className="text-xs text-gray-400">{invoice.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                                            <Badge status={invoice.status} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Client Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50">
                            <h3 className="font-bold text-gray-900 text-sm">{t("Client")}</h3>
                        </div>
                        <div className="p-6">
                            {project.client ? (
                                <div>
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                            <span className="text-indigo-600 text-sm font-bold">{project.client.name?.charAt(0)?.toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{project.client.name}</p>
                                            <p className="text-xs text-gray-400">{project.client.email}</p>
                                        </div>
                                    </div>
                                    {project.client.company_name && (
                                        <p className="text-xs text-gray-500">Company: {project.client.company_name}</p>
                                    )}
                                    {project.client.phone && (
                                        <p className="text-xs text-gray-500 mt-1">Phone: {project.client.phone}</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">{t("No client assigned")}</p>
                            )}
                        </div>
                    </div>

                    {/* Developer Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50">
                            <h3 className="font-bold text-gray-900 text-sm">{t("Developer")}</h3>
                        </div>
                        <div className="p-6">
                            {project.developer ? (
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <span className="text-emerald-600 text-sm font-bold">{project.developer.name?.charAt(0)?.toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{project.developer.name}</p>
                                        <p className="text-xs text-gray-400">{project.developer.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-2">
                                    <p className="text-sm text-gray-400 mb-3">{t("No developer assigned")}</p>
                                    <form onSubmit={handleClaim}>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'Claiming...' : 'Claim This Project'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Referral Info */}
                    {partnerName && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <h3 className="font-bold text-gray-900 text-sm">{t("Referral")}</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{partnerName}</p>
                                        <p className="text-xs text-gray-400">Referral Partner</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Info */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50">
                            <h3 className="font-bold text-gray-900 text-sm">{t("Status")}</h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">Current Status</span>
                                <Badge status={project.status} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">{t("Created")}</span>
                                <span className="text-xs text-gray-600">{new Date(project.created_at).toLocaleDateString()}</span>
                            </div>
                            {project.start_date && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Started</span>
                                    <span className="text-xs text-gray-600">{formatDate(project.start_date)}</span>
                                </div>
                            )}
                            {project.deadline && (
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400">Deadline</span>
                                    <span className="text-xs text-gray-600">{formatDate(project.deadline)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DevLayout>
    );
}

function DetailItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{label}</dt>
            <dd className="text-sm text-gray-900 mt-0.5">{value}</dd>
        </div>
    );
}
