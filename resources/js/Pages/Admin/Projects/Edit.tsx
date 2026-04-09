import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { User, Lead, Project, PageProps } from '@/types';
import { formatStatus } from '@/lib/utils';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SearchableSelect from '@/Components/ui/SearchableSelect';

interface Props {
    project: Project;
    clients: User[];
    developers: User[];
    leads: Lead[];
    projectTypes: { value: string; label: string; commission_rate: number }[];
}

const inputClass = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-teal-400 focus:ring-teal-400';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';
const cardClass = 'bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm';
const headingClass = 'text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4';

const statuses = ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'];
function toDateInput(val: string | null | undefined): string {
    if (!val) return '';
    return val.substring(0, 10);
}

export default function ProjectEdit({ project, clients, developers, leads, projectTypes }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const [logoPreview, setLogoPreview] = useState<string | null>(
        project.image ? (project.image.startsWith('http') ? project.image : `/storage/${project.image}`) : null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors } = useForm<Record<string, any>>({
        _method: 'PUT',
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
        image: null as File | null,
        // Client-facing info (visible on /client/projects/{id})
        preview_url: project.preview_url || '',
        staging_url: project.staging_url || '',
        useful_links: JSON.stringify(Array.isArray(project.useful_links) ? project.useful_links : []),
        client_action_required: !!project.client_action_required,
        client_action_message: project.client_action_message || '',
        current_phase: project.current_phase || '',
        next_milestone_label: project.next_milestone_label || '',
        next_milestone_date: toDateInput(project.next_milestone_date),
    });

    // Useful links editor state — array of {label,url}
    const [linksList, setLinksList] = useState<{ label: string; url: string }[]>(
        Array.isArray(project.useful_links) ? project.useful_links : []
    );
    const updateLinks = (next: { label: string; url: string }[]) => {
        setLinksList(next);
        setData('useful_links', JSON.stringify(next));
    };
    const addLink = () => updateLinks([...linksList, { label: '', url: '' }]);
    const removeLink = (i: number) => updateLinks(linksList.filter((_, idx) => idx !== i));
    const setLink = (i: number, field: 'label' | 'url', value: string) => {
        updateLinks(linksList.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setData('image', file); setLogoPreview(URL.createObjectURL(file)); }
    };
    const removeLogo = () => { setData('image', null); setLogoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/projects/${project.id}`, {
            forceFormData: true,
            preserveScroll: true,
            onError: (errs) => console.error('Validation errors:', JSON.stringify(errs, null, 2)),
        });
    };
    const submitting = processing;

    return (
        <AdminLayout title={t("Edit Project")} header={t("Edit Project")}>
            <Head title={t("Edit Project")} />

            <div className="mb-6">
                <Link href={`/admin/projects/${project.id}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Project")}</Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Project Logo */}
                <div className={cardClass}>
                    <h3 className={headingClass}>{t("Project Logo")}</h3>
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo" className="w-20 h-20 rounded-xl object-contain bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600" />
                            ) : (
                                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-500 flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-400 dark:text-gray-500">
                                        {(data.nom_societe || '?').substring(0, 2).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            {logoPreview && (
                                <button type="button" onClick={removeLogo} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" title={t('Remove')}>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                        <div>
                            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/svg+xml,image/webp" onChange={handleLogoChange} className="hidden" id="project-logo-upload" />
                            <label htmlFor="project-logo-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                {logoPreview ? t('Changer le logo') : t('Ajouter un logo')}
                            </label>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{t('JPG, PNG, SVG ou WebP. Max 2 Mo.')}</p>
                        </div>
                    </div>
                </div>

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
                            <SearchableSelect
                                value={data.type_site}
                                onChange={(val) => setData('type_site', val)}
                                placeholder={t('Sélectionner le type')}
                                options={projectTypes.map((pt: any) => ({ value: pt.value, label: pt.label }))}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>{t("Location")}</label>
                            <input type="text" value={data.lieu} onChange={e => setData('lieu', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>{t("Status")} *</label>
                            <SearchableSelect
                                value={data.status}
                                onChange={(val) => setData('status', val)}
                                options={statuses.map(s => ({ value: s, label: formatStatus(s) }))}
                            />
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
                            <SearchableSelect
                                value={data.client_id}
                                onChange={(val) => setData('client_id', val)}
                                placeholder={t("None")}
                                options={clients.map(c => ({ value: String(c.id), label: `${c.name}${c.company_name ? ` (${c.company_name})` : ''}` }))}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>{t("Developer")}</label>
                            <SearchableSelect
                                value={data.developer_id}
                                onChange={(val) => setData('developer_id', val)}
                                placeholder={t("Unassigned")}
                                options={developers.map(d => ({ value: String(d.id), label: d.name }))}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>{t("Lead (Referral)")}</label>
                            <SearchableSelect
                                value={data.lead_id}
                                onChange={(val) => setData('lead_id', val)}
                                placeholder={t("None")}
                                options={leads.map(l => ({ value: String(l.id), label: `${l.first_name} ${l.last_name}` }))}
                            />
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

                {/* === Client-facing info === */}
                <div className={cardClass}>
                    <h3 className={headingClass}>
                        <span className="inline-flex items-center gap-2">
                            <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                            {t('Infos visibles par le client')}
                        </span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">{t('Tout ce que vous renseignez ici sera affiché au client sur sa page projet.')}</p>

                    {/* Action required toggle */}
                    <div className="mb-5 p-4 rounded-xl border-2 border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/5">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.client_action_required}
                                onChange={e => setData('client_action_required', e.target.checked)}
                                className="mt-0.5 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-400"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{t('Action attendue de la part du client')}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('Affiche un bandeau orange en haut de la page projet du client.')}</p>
                            </div>
                        </label>
                        {data.client_action_required && (
                            <textarea
                                value={data.client_action_message}
                                onChange={e => setData('client_action_message', e.target.value)}
                                rows={3}
                                placeholder={t('Ex : Merci de valider les maquettes envoyées par e-mail pour qu\'on puisse continuer le développement.')}
                                className={`${inputClass} mt-3`}
                            />
                        )}
                    </div>

                    {/* Phase + milestone */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('Phase actuelle')}</label>
                            <input type="text" value={data.current_phase} onChange={e => setData('current_phase', e.target.value)} placeholder={t('Ex : Maquettes en cours')} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('Prochaine étape')}</label>
                            <input type="text" value={data.next_milestone_label} onChange={e => setData('next_milestone_label', e.target.value)} placeholder={t('Ex : Validation des maquettes')} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('Date prévue')}</label>
                            <input type="date" value={data.next_milestone_date} onChange={e => setData('next_milestone_date', e.target.value)} className={inputClass} />
                        </div>
                    </div>

                    {/* Preview + staging */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('URL aperçu (preview)')}</label>
                            <input type="text" value={data.preview_url} onChange={e => setData('preview_url', e.target.value)} placeholder="https://preview.example.com" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{t('URL staging / test')}</label>
                            <input type="text" value={data.staging_url} onChange={e => setData('staging_url', e.target.value)} placeholder="https://staging.example.com" className={inputClass} />
                        </div>
                    </div>

                    {/* Useful links repeater */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('Liens utiles supplémentaires')}</label>
                            <button type="button" onClick={addLink} className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400">+ {t('Ajouter un lien')}</button>
                        </div>
                        <div className="space-y-2">
                            {linksList.length === 0 && (
                                <p className="text-xs text-gray-400 italic">{t('Aucun lien ajouté.')}</p>
                            )}
                            {linksList.map((link, i) => (
                                <div key={i} className="flex gap-2">
                                    <input type="text" value={link.label} onChange={e => setLink(i, 'label', e.target.value)} placeholder={t('Libellé (ex : Trello)')} className={`${inputClass} flex-1`} />
                                    <input type="text" value={link.url} onChange={e => setLink(i, 'url', e.target.value)} placeholder="https://..." className={`${inputClass} flex-[2]`} />
                                    <button type="button" onClick={() => removeLink(i)} className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title={t('Supprimer')}>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/projects/${project.id}`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Cancel')}</Link>
                    <button type="submit" disabled={submitting} className="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {submitting && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        {t('Update Project')}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
