import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const inputClass = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-teal-300 focus:ring-teal-300';

export default function PageCreate() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        audience: 'partner',
        is_published: true,
        sort_order: 0,
        icon: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/pages');
    };

    return (
        <AdminLayout title={t("New Page")} header={t("New Page")}>
            <Head title={t("New Page")} />

            <div className="mb-6">
                <Link href="/admin/pages" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Pages")}</Link>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Page Details */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Page Details")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Title")} *</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className={inputClass} required placeholder="e.g. Partner Program Guide" />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Audience")} *</label>
                            <select value={data.audience} onChange={e => setData('audience', e.target.value)} className={inputClass}>
                                <option value="partner">{t("Partner")}</option>
                                <option value="developer">{t("Developer")}</option>
                                <option value="public">{t("Public")}</option>
                            </select>
                            {errors.audience && <p className="mt-1 text-sm text-red-600">{errors.audience}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Sort Order")}</label>
                            <input type="number" value={data.sort_order} onChange={e => setData('sort_order', parseInt(e.target.value) || 0)} className={inputClass} min="0" />
                            {errors.sort_order && <p className="mt-1 text-sm text-red-600">{errors.sort_order}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("Icon (SVG path)")}</label>
                            <input type="text" value={data.icon} onChange={e => setData('icon', e.target.value)} className={inputClass} placeholder="M12 6.042A8.967 8.967 0 006 3.75c-1.052..." />
                            {errors.icon && <p className="mt-1 text-sm text-red-600">{errors.icon}</p>}
                            {data.icon && (
                                <div className="mt-2 flex items-center space-x-2">
                                    <span className="text-xs text-gray-400">Preview:</span>
                                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={data.icon} />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={data.is_published}
                                    onChange={e => setData('is_published', e.target.checked)}
                                    className="rounded border-gray-300 text-teal-500 focus:ring-teal-300"
                                />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('Published')}</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Content (HTML)")}</h3>
                    <textarea
                        value={data.content}
                        onChange={e => setData('content', e.target.value)}
                        rows={20}
                        className={inputClass + ' font-mono text-xs'}
                        required
                        placeholder="<h2>Page Title</h2>&#10;<p>Your content here...</p>"
                    />
                    {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href="/admin/pages" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        {t('Create Page')}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
