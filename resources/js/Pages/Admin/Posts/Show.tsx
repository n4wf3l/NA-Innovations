import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';

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
    updated_at: string;
}

interface Props {
    post: Post;
}

export default function PostShow({ post }: Props) {
    const { t } = useTranslation();
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const handleDelete = () => {
        router.delete(`/admin/posts/${post.id}`, {
            onSuccess: () => {},
        });
    };

    const togglePublish = () => {
        router.put(`/admin/posts/${post.id}`, {
            ...post,
            status: post.status === 'published' ? 'draft' : 'published',
            published_at: post.status === 'published' ? post.published_at : new Date().toISOString(),
            tags: post.tags || [],
        });
    };

    return (
        <AdminLayout title={post.title} header={t("View Post")}>
            <Head title={post.title} />

            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
                <Link href="/admin/posts" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    &larr; {t("Back to Posts")}
                </Link>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t('Edit')}
                    </Link>
                    <button
                        onClick={togglePublish}
                        className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${post.status === 'published' ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}
                    >
                        {post.status === 'published' ? t('Unpublish') : t('Publish')}
                    </button>
                    {deleteConfirm ? (
                        <div className="flex items-center gap-1">
                            <button onClick={handleDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors">
                                {t('Confirm delete')}
                            </button>
                            <button onClick={() => setDeleteConfirm(false)} className="px-3 py-2 text-sm text-gray-400 hover:text-gray-600">
                                {t('Cancel')}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setDeleteConfirm(true)}
                            className="px-4 py-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                        >
                            {t('Delete')}
                        </button>
                    )}
                </div>
            </div>

            {/* Article preview */}
            <div className="max-w-4xl mx-auto">
                {/* Status bar */}
                <div className="flex items-center gap-3 mb-6 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${post.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {post.status === 'published' ? t('Published') : t('Draft')}
                    </span>
                    {post.published_at && (
                        <span className="text-xs text-gray-500">{t('Published on')} {formatDate(post.published_at)}</span>
                    )}
                    {post.reading_time && (
                        <span className="text-xs text-gray-400">{post.reading_time} min {t('read')}</span>
                    )}
                    {post.category && (
                        <span className="text-xs font-medium text-teal-500">{post.category}</span>
                    )}
                    <span className="ml-auto text-xs text-gray-400">{t('Slug')}: /posts/{post.slug}</span>
                </div>

                {/* Cover image */}
                {post.image_url && (
                    <div className="mb-8 rounded-2xl overflow-hidden">
                        <img src={post.image_url} alt={post.title} loading="lazy" className="w-full aspect-video object-cover" />
                    </div>
                )}

                {/* Article content */}
                <article className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 md:p-12">
                    {/* Header */}
                    <header className="mb-8 pb-8 border-b border-gray-100 dark:border-gray-700">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                            {post.title}
                        </h1>
                        {post.excerpt && (
                            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">{post.excerpt}</p>
                        )}
                        <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
                            {post.author && (
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-xs font-bold text-teal-700 dark:text-teal-300">
                                        {post.author.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{post.author.name}</span>
                                </div>
                            )}
                            {post.published_at && <span>{formatDate(post.published_at)}</span>}
                            {post.reading_time && <span>{post.reading_time} min</span>}
                        </div>
                    </header>

                    {/* Body content */}
                    {post.content ? (
                        <div
                            className="prose prose-lg dark:prose-invert max-w-none
                                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                                prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                                prose-li:text-gray-600 dark:prose-li:text-gray-300
                                prose-strong:text-gray-900 dark:prose-strong:text-white
                                prose-a:text-teal-500 prose-a:no-underline hover:prose-a:underline
                                prose-blockquote:border-l-teal-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-700/50 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-4
                                prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono
                                prose-ul:my-4 prose-ol:my-4 prose-li:my-1"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    ) : post.description ? (
                        <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {post.description}
                        </div>
                    ) : (
                        <p className="text-gray-400 italic">{t('No content yet.')}</p>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </article>

                {/* SEO info */}
                {(post.meta_title || post.meta_description) && (
                    <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">SEO</h3>
                        {post.meta_title && (
                            <div className="mb-2">
                                <span className="text-xs text-gray-400">{t('Meta title')}:</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{post.meta_title}</p>
                            </div>
                        )}
                        {post.meta_description && (
                            <div>
                                <span className="text-xs text-gray-400">{t('Meta description')}:</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{post.meta_description}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
