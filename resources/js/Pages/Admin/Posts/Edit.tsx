import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '@/Components/ui/RichTextEditor';

interface Post {
    id: number;
    title: string;
    slug: string;
    subject?: string;
    description?: string;
    content?: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    status: string;
    published_at?: string;
    cover_image?: string;
    photo?: string;
    image_url?: string;
    reading_time?: number;
    meta_title?: string;
    meta_description?: string;
    author?: { id: number; name: string };
    created_at: string;
}

interface Props {
    post: Post;
    categories: string[];
}

const inputClass = 'w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-teal-400 focus:ring-teal-400';

const PRESET_CATEGORIES = ['Technique', 'Business', 'Actualité', 'Guide', 'Étude de cas'];

export default function PostEdit({ post, categories }: Props) {
    const { t } = useTranslation();
    const { data, setData, post: submitForm, processing, errors, progress } = useForm({
        title: post.title || '',
        slug: post.slug || '',
        subject: post.subject || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category: post.category || '',
        tags: (post.tags || []) as string[],
        status: (post.status || 'draft') as 'draft' | 'published',
        published_at: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
        cover_image: null as File | null,
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        _method: 'PUT',
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [showSeo, setShowSeo] = useState(false);
    const [customCategory, setCustomCategory] = useState(false);

    const allCategories = [...new Set([...PRESET_CATEGORIES, ...categories])];

    const currentImageUrl = post.image_url || null;

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('cover_image', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const addTag = (value: string) => {
        const tag = value.trim();
        if (tag && !data.tags.includes(tag)) {
            setData('tags', [...data.tags, tag]);
        }
        setTagInput('');
    };

    const removeTag = (tag: string) => {
        setData('tags', data.tags.filter(t => t !== tag));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        submitForm(`/admin/posts/${post.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title={t("Edit Post")} header={t("Edit Post")}>
            <Head title={`${t("Edit")} — ${post.title}`} />

            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/posts" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    &larr; {t("Back to Posts")}
                </Link>
                <Link
                    href={`/admin/posts/${post.id}`}
                    className="text-sm text-teal-500 hover:text-teal-600 font-medium"
                >
                    {t("View article")}
                </Link>
            </div>

            <form onSubmit={submit}>
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left column - Main content (2/3) */}
                    <div className="flex-1 lg:w-2/3 space-y-6">
                        {/* Title */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full border-0 bg-transparent text-2xl font-bold text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:ring-0 p-0"
                                placeholder={t("Titre de l'article...")}
                                required
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}

                            {/* Slug */}
                            <div className="mt-3 flex items-center gap-2">
                                <span className="text-xs text-gray-400">/posts/</span>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={e => setData('slug', e.target.value)}
                                    className="flex-1 border-0 border-b border-dashed border-gray-200 dark:border-gray-600 bg-transparent text-xs text-gray-500 dark:text-gray-400 focus:ring-0 focus:border-teal-400 p-0 pb-0.5"
                                    placeholder="slug"
                                />
                            </div>
                            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                        </div>

                        {/* Content - Rich Text Editor */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="px-6 pt-4 pb-2">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{t("Content")}</h3>
                            </div>
                            <div className="px-4 pb-4">
                                <RichTextEditor
                                    value={data.content}
                                    onChange={(html) => setData('content', html)}
                                    placeholder={t("Rédigez votre article ici...")}
                                    minHeight={400}
                                />
                            </div>
                            {errors.content && <p className="px-6 pb-3 text-sm text-red-600">{errors.content}</p>}
                        </div>
                    </div>

                    {/* Right column - Sidebar (1/3) */}
                    <div className="lg:w-1/3 space-y-6">
                        {/* Publication card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Publication")}</h3>

                            {/* Status pills */}
                            <div className="flex items-center gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setData('status', 'draft')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${data.status === 'draft' ? 'bg-gray-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                >
                                    {t('Draft')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('status', 'published')}
                                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${data.status === 'published' ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                >
                                    {t('Publish')}
                                </button>
                            </div>

                            {/* Published at */}
                            {data.status === 'published' && (
                                <div className="mb-4">
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t("Publication date")}</label>
                                    <input
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={e => setData('published_at', e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            )}

                            {/* Category */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t("Category")}</label>
                                {customCategory ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                            className={inputClass}
                                            placeholder={t("Nouvelle catégorie...")}
                                        />
                                        <button type="button" onClick={() => setCustomCategory(false)} className="text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap">
                                            {t('Cancel')}
                                        </button>
                                    </div>
                                ) : (
                                    <select
                                        value={data.category}
                                        onChange={e => {
                                            if (e.target.value === '__custom__') {
                                                setCustomCategory(true);
                                                setData('category', '');
                                            } else {
                                                setData('category', e.target.value);
                                            }
                                        }}
                                        className={inputClass}
                                    >
                                        <option value="">{t('Select a category')}</option>
                                        {allCategories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                        <option value="__custom__">{t('Other...')}</option>
                                    </select>
                                )}
                            </div>
                        </div>

                        {/* Cover image card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Cover Image")}</h3>

                            {/* Current image or preview */}
                            {(preview || currentImageUrl) && (
                                <div className="relative mb-3">
                                    <img src={preview || currentImageUrl!} alt="Cover" className="w-full aspect-video object-cover rounded-xl border border-gray-200 dark:border-gray-600" />
                                    {preview && (
                                        <button
                                            type="button"
                                            onClick={() => { setData('cover_image', null); setPreview(null); }}
                                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    )}
                                </div>
                            )}

                            <label className="flex items-center justify-center w-full py-3 border border-dashed border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/5 transition-colors">
                                <span className="text-xs text-gray-400">{currentImageUrl ? t('Replace image') : t('Click to upload')}</span>
                                <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                            </label>
                            {errors.cover_image && <p className="text-sm text-red-600 mt-1">{errors.cover_image}</p>}
                            {progress && (
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                                    <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${progress.percentage}%` }} />
                                </div>
                            )}
                        </div>

                        {/* Excerpt + Tags card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">{t("Summary")}</h3>

                            {/* Excerpt */}
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t("Excerpt")}</label>
                                <textarea
                                    value={data.excerpt}
                                    onChange={e => setData('excerpt', e.target.value.slice(0, 500))}
                                    rows={3}
                                    className={inputClass}
                                    placeholder={t("Résumé court de l'article...")}
                                    maxLength={500}
                                />
                                <p className="text-right text-[10px] text-gray-400 mt-1">{data.excerpt.length}/500</p>
                                {errors.excerpt && <p className="text-sm text-red-600">{errors.excerpt}</p>}
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t("Tags")}</label>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {data.tags.map((tag) => (
                                        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-500/10 px-2.5 py-1 text-xs font-medium text-teal-700 dark:text-teal-300">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="text-teal-400 hover:text-teal-600">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addTag(tagInput);
                                        }
                                    }}
                                    className={inputClass}
                                    placeholder={t("Ajouter un tag + Entrée")}
                                />
                            </div>
                        </div>

                        {/* SEO card (collapsible) */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setShowSeo(!showSeo)}
                                className="w-full flex items-center justify-between p-6"
                            >
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">SEO</h3>
                                <svg className={`w-4 h-4 text-gray-400 transition-transform ${showSeo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showSeo && (
                                <div className="px-6 pb-6 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t("Meta title")}</label>
                                        <input
                                            type="text"
                                            value={data.meta_title}
                                            onChange={e => setData('meta_title', e.target.value)}
                                            className={inputClass}
                                            placeholder={t("Titre pour les moteurs de recherche")}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t("Meta description")}</label>
                                        <textarea
                                            value={data.meta_description}
                                            onChange={e => setData('meta_description', e.target.value)}
                                            rows={3}
                                            className={inputClass}
                                            placeholder={t("Description pour les moteurs de recherche")}
                                            maxLength={500}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-8 pb-8">
                    <Link href="/admin/posts" className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        {t('Cancel')}
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 text-sm font-semibold bg-teal-300 text-gray-900 rounded-xl hover:bg-teal-400 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        {processing && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        )}
                        {t('Update Post')}
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
