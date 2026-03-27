import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { User, Lead } from '@/types';
import { formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    clients: User[];
    developers: User[];
    leads: Lead[];
}

const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-teal-400 focus:ring-teal-400';

const statuses = ['planning', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'];

const siteTypes = ['vitrine', 'e-commerce', 'blog', 'portfolio', 'saas', 'web_app', 'mobile_app', 'other'];

export default function ProjectCreate({ clients, developers, leads }: Props) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        nom_societe: '',
        type_societe: '',
        type_site: '',
        lieu: '',
        client_id: '',
        developer_id: '',
        lead_id: '',
        status: 'planning',
        description: '',
        start_date: '',
        end_date: '',
        deadline: '',
        budget: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/projects');
    };

    return (
        <AdminLayout title={t("New Project")} header={t("New Project")}>
            <Head title={t("New Project")} />

            <div className="mb-6">
                <Link href="/admin/projects" className="text-sm text-gray-500 hover:text-gray-700">&larr; {t("Back to Projects")}</Link>
            </div>

            <form onSubmit={submit} className="space-y-6 max-w-4xl">
                {/* Project Info */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Project Information")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Company / Project Name")} *</label>
                            <input type="text" value={data.nom_societe} onChange={e => setData('nom_societe', e.target.value)} className={inputClass} required placeholder="e.g. Acme Corp Website" />
                            {errors.nom_societe && <p className="mt-1 text-sm text-red-600">{errors.nom_societe}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Company Type")}</label>
                            <input type="text" value={data.type_societe} onChange={e => setData('type_societe', e.target.value)} className={inputClass} placeholder="e.g. SaaS, Agency, Restaurant" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Site Type")}</label>
                            <select value={data.type_site} onChange={e => setData('type_site', e.target.value)} className={inputClass}>
                                <option value="">{t("Select type")}</option>
                                {siteTypes.map(t => <option key={t} value={t}>{formatStatus(t)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Location")}</label>
                            <input type="text" value={data.lieu} onChange={e => setData('lieu', e.target.value)} className={inputClass} placeholder="e.g. Brussels, Belgium" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Status")} *</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className={inputClass}>
                                {statuses.map(s => <option key={s} value={s}>{formatStatus(s)}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Description")}</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={3} className={inputClass} placeholder="Brief description of the project..." />
                        </div>
                    </div>
                </div>

                {/* Assignments */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Assignments")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Client")}</label>
                            <select value={data.client_id} onChange={e => setData('client_id', e.target.value)} className={inputClass}>
                                <option value="">{t("None")}</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Developer")}</label>
                            <select value={data.developer_id} onChange={e => setData('developer_id', e.target.value)} className={inputClass}>
                                <option value="">{t("Unassigned")}</option>
                                {developers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Lead (Referral)")}</label>
                            <select value={data.lead_id} onChange={e => setData('lead_id', e.target.value)} className={inputClass}>
                                <option value="">{t("None")}</option>
                                {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Schedule & Budget */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Schedule & Budget")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Start Date")}</label>
                            <input type="date" value={data.start_date} onChange={e => setData('start_date', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("End Date")}</label>
                            <input type="date" value={data.end_date} onChange={e => setData('end_date', e.target.value)} className={inputClass} />
                            {errors.end_date && <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Deadline")}</label>
                            <input type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Budget")}</label>
                            <input type="number" value={data.budget} onChange={e => setData('budget', e.target.value)} className={inputClass} step="0.01" min="0" placeholder="0.00" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href="/admin/projects" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        Create Project
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
