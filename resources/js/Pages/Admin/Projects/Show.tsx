import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { Project, User, Lead, Quote, Invoice, RecurringService, TimelineEvent, PageProps } from '@/types';
import { formatDate, formatStatus } from '@/lib/utils';
import CommitList from '@/Components/ui/CommitList';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

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
                <Link href="/admin/projects" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Projects")}</Link>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/projects/${project.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('Edit')}</Link>
                    <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50">{t('Delete')}</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Header */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
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
                                    <span className="text-gray-500 dark:text-gray-400 block">{t("Site Type")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatStatus(project.type_site)}</span>
                                </div>
                            )}
                            {project.lieu && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400 block">{t("Location")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{project.lieu}</span>
                                </div>
                            )}
                            {project.start_date && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400 block">{t("Start Date")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.start_date)}</span>
                                </div>
                            )}
                            {project.deadline && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400 block">{t("Deadline")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.deadline)}</span>
                                </div>
                            )}
                            {project.end_date && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400 block">{t("End Date")}</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.end_date)}</span>
                                </div>
                            )}
                            {project.budget != null && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400 block">{t("Budget")}</span>
                                    <span className="font-medium text-gray-900"><ProtectedAmount amount={project.budget} /></span>
                                </div>
                            )}
                            {project.total_billed != null && (
                                <div>
                                    <span className="text-gray-500 dark:text-gray-400 block">{t("Total Billed")}</span>
                                    <span className="font-medium text-gray-900"><ProtectedAmount amount={project.total_billed} /></span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t("Created")}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{formatDate(project.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {project.description && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">{t("Description")}</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.description}</p>
                        </div>
                    )}

                    {/* Related Quotes */}
                    {quotes.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{t("Quotes")}</h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {quotes.map(quote => (
                                    <Link key={quote.id} href={`/admin/quotes/${quote.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-white">{quote.quote_number}</span>
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
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{t("Invoices")}</h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {invoices.map(inv => (
                                    <Link key={inv.id} href={`/admin/invoices/${inv.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-white">{inv.invoice_number}</span>
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
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{t("Recurring Services")}</h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {services.map(svc => (
                                    <Link key={svc.id} href={`/admin/services/${svc.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-white">{svc.name}</span>
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
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{t("Notes")}</h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
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
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{project.client.name}</p>
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
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{project.developer.name}</p>
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

                    {/* Timeline */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                        <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{t("Timeline")}</h3>
                        </div>
                        <div className="p-5">
                            {timelineEvents.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-4">{t("No activity yet.")}</p>
                            ) : (
                                <div className="relative">
                                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                                    <div className="space-y-5">
                                        {timelineEvents.map(event => (
                                            <div key={event.id} className="relative flex items-start ml-4 pl-6">
                                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white dark:bg-gray-800 border-2 border-violet-400" />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(event.created_at)}</span>
                                                    </div>
                                                    {event.description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{event.description}</p>}
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
                    /* GitHub not connected */
                    <div className="text-center py-2">
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-3">{t('Connect your GitHub account in your profile to link a repository.')}</p>
                        <a href="/auth/github/redirect" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            {t('Connect GitHub')}
                        </a>
                    </div>
                ) : !project.github_repo || editing ? (
                    /* Link a repo form */
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
                    /* Repo linked — show info + commits */
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

            {/* Commits list below the card */}
            {project.github_repo && !editing && <CommitList projectId={project.id} />}
        </div>
    );
}
