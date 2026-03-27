import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-teal-400 focus:ring-teal-400';

export default function PostCreate() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, progress } = useForm({
        title: '',
        subject: '',
        description: '',
        photo: null as File | null,
    });

    const [preview, setPreview] = useState<string | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('photo', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/posts', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title={t("New Post")} header={t("New Post")}>
            <Head title={t("New Post")} />

            <div className="mb-6">
                <Link href="/admin/posts" className="text-sm text-gray-500 hover:text-gray-700">&larr; {t("Back to Posts")}</Link>
            </div>

            <form onSubmit={submit} className="space-y-6 max-w-4xl">
                {/* Post Content */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Post Content")}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Title")} *</label>
                            <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className={inputClass} required placeholder={t("Post title")} />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Subject")} *</label>
                            <input type="text" value={data.subject} onChange={e => setData('subject', e.target.value)} className={inputClass} required placeholder={t("Post subject or category")} />
                            {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Description")} *</label>
                            <textarea value={data.description} onChange={e => setData('description', e.target.value)} rows={8} className={inputClass} required placeholder={t("Write your post content here...")} />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* Photo */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{t("Photo")}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Upload Photo")}</label>
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
                            {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
                            <p className="mt-1 text-xs text-gray-400">{t("Max 2MB. JPG, PNG, GIF accepted.")}</p>
                        </div>
                        {preview && (
                            <div className="relative inline-block">
                                <img src={preview} alt="Preview" className="w-48 h-32 object-cover rounded-xl border border-gray-200" />
                                <button type="button" onClick={() => { setData('photo', null); setPreview(null); }} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        )}
                        {progress && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-teal-500 h-2 rounded-full transition-all" style={{ width: `${progress.percentage}%` }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link href="/admin/posts" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">{t('Cancel')}</Link>
                    <button type="submit" disabled={processing} className="px-6 py-2 text-sm font-semibold bg-teal-300 text-gray-900 rounded-lg hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2">
                        {processing && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                        Create Post
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
