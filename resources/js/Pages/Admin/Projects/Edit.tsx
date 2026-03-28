import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { User, Lead, Project, PageProps } from '@/types';
import { formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    project: Project;
    clients: User[];
    developers: User[];
    leads: Lead[];
}

const inputClass = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-teal-400 focus:ring-teal-400';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
const cardClass = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm';
const headingClass = 'text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4';

const statuses = ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'];
const siteTypes = ['vitrine', 'e-commerce', 'blog', 'portfolio', 'saas', 'web_app', 'mobile_app', 'other'];

function toDateInput(val: string | null | undefined): string {
    if (!val) return '';
    return val.substring(0, 10);
}

export default function ProjectEdit({ project, clients, developers, leads }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const { data, setData, put, processing, errors } = useForm({
        nom_societe: project.nom_societe || '',
        type_societe: project.type_societe || '',
        type_site: project.type_site || '',
        lieu: project.lieu || '',
        client_id: project.client_id ? String(project.client_id) : '',
        developer_id: project.developer_id ? String(project.developer_id) : '',
        lead_id: project.lead_id ? String(project.lead_id) : '',
        status: project.status || 'planning',
        description: project.description || '',
        start_date: toDateInput(project.start_date),
        end_date: toDateInput(project.end_date),
        deadline: toDateInput(project.deadline),
        budget: project.budget ? String(project.budget) : '',
        github_repo: project.github_repo || '',
        show_commits_to_client: project.show_commits_to_client || false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/projects/${project.id}`);
    };

    return (
        <AdminLayout title={t("Edit Project")} header={t("Edit Project")}>
            <Head title={t("Edit Project")} />

            <div className="mb-6">
                <Link href={`/admin/projects/${project.id}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Project")}</Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Project Info */}
                <div className={cardClass}>
                    <h3 className={headingClass}>{t("Project Information")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className={labelClass}>{t("Company / Project Name")} *</label>
                            <input type="text" value={data.nom_societe} onChange={e => setData('nom_societe', e.target.value)} className={inputClass} required />
                            {errors.nom_societe && <p className="mt-1 text-sm text-red-600">{errors.nom_societe}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>{t("Company Type")}</label>
                            <input type="text" value={data.type_societe} onChange={e => setData('type_societe', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>{t("Site Type")}</label>
                            <select value={data.type_site} onChange={e => setData('type_site', e.target.value)} className={inputClass}>
                                <option value="">{t("Select type")}</option>
                                {siteTypes.map(st => <option key={st} value={st}>{formatStatus(st)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>{t("Location")}</label>
                            <input type="text" value={data.lieu} onChange={e => setData('lieu', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>{t("Status")} *</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className={inputClass}>
                                {statuses.map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>{t("Description")}</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Assignments */}
                <div className={cardClass}>
                    <h3 className={headingClass}>{t("Assignments")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>{t("Client")}</label>
                            <select value={data.client_id} onChange={e => setData('client_id', e.target.value)} className={inputClass}>
                                <option value="">{t("None")}</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>{t("Developer")}</label>
                            <select value={data.developer_id} onChange={e => setData('developer_id', e.target.value)} className={inputClass}>
                                <option value="">{t("Unassigned")}</option>
                                {developers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>{t("Lead (Referral)")}</label>
                            <select value={data.lead_id} onChange={e => setData('lead_id', e.target.value)} className={inputClass}>
                                <option value="">{t("None")}</option>
                                {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Schedule & Budget */}
                <div className={cardClass}>
                    <h3 className={headingClass}>{t("Schedule & Budget")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className={labelClass}>{t("Start Date")}</label>
                            <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>{t("End Date")}</label>
                            <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className={inputClass} />
                            {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>{t("Deadline")}</label>
                            <input type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>{t("Budget")}</label>
                            <input type="number" value={data.budget} onChange={e => setData('budget', e.target.value)} className={inputClass} step="0.01" min="0" />
                        </div>
                    </div>
                </div>

                {/* GitHub */}
                <div className={cardClass}>
                    <h3 className={headingClass + ' flex items-center gap-2'}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                    </h3>
                    {auth.user?.github_username ? (
                        <div className="space-y-4">
                            <p className="text-xs text-gray-400 dark:text-gray-500">{t('Connected as')} <span className="font-semibold text-gray-700 dark:text-gray-300">@{auth.user.github_username}</span></p>
                            <div>
                                <label className={labelClass}>{t("Repository")}</label>
                                <input type="text" value={data.github_repo} onChange={e => setData('github_repo', e.target.value)} className={inputClass} placeholder="owner/repo" />
                            </div>
                            {data.github_repo && (
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={data.show_commits_to_client} onChange={e => setData('show_commits_to_client', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-400" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{t("Show commits to client")}</span>
                                </label>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{t('Connect your GitHub account in your profile to link a repository.')}</p>
                            <a href="/auth/github/redirect" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                {t('Connect GitHub')}
                            </a>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/projects/${project.id}`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        {t('Update Project')}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
