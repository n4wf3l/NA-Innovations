import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import { PaginatedData } from '@/types';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    description?: string;
    content?: string;
    status: string;
    category?: string;
    tags?: string[];
    cover_image?: string;
    photo?: string;
    image_url?: string;
    reading_time?: number;
    author?: { id: number; name: string };
    published_at?: string;
    created_at: string;
}

interface Props {
    posts: PaginatedData<Post>;
    categories: string[];
    counts: { total: number; published: number; draft: number };
    filters: { status?: string; category?: string; search?: string };
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'maintenant';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `il y a ${days}j`;
    const months = Math.floor(days / 30);
    return `il y a ${months} mois`;
}

export default function PostsIndex({ posts, categories, counts, filters }: Props) {
    const { t } = useTranslation();
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    const applyFilter = (key: string, value: string | undefined) => {
        router.get('/admin/posts', {
            ...filters,
            [key]: value || undefined,
        }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/posts/${id}`, {
            onSuccess: () => setDeleteConfirm(null),
        });
    };

    const activeTab = filters.status || 'all';

    return (
        <AdminLayout title={t("News / Blog")} header={t("News / Blog")}>
            <Head title={t("News / Blog")} />

            <ModuleBanner
                breadcrumb={`${t("Content")} / ${t("Posts")}`}
                title={t("News & Blog")}
                description={t("Manage your blog posts and news articles. Create, edit, and publish content.")}
                gradient="from-slate-600 to-gray-700"
                icon="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                actionHref="/admin/posts/create"
                actionLabel={t("New Post")}
            />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                {/* Status tabs */}
                <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-1">
                    <button
                        onClick={() => applyFilter('status', undefined)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'all' ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        {t('All')} ({counts.total})
                    </button>
                    <button
                        onClick={() => applyFilter('status', 'published')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'published' ? 'bg-emerald-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        {t('Published')} ({counts.published})
                    </button>
                    <button
                        onClick={() => applyFilter('status', 'draft')}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'draft' ? 'bg-gray-500 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                    >
                        {t('Drafts')} ({counts.draft})
                    </button>
                </div>

                {/* Category filter */}
                {categories.length > 0 && (
                    <select
                        value={filters.category || ''}
                        onChange={(e) => applyFilter('category', e.target.value || undefined)}
                        className="px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 focus:ring-teal-400 focus:border-teal-400"
                    >
                        <option value="">{t('All categories')}</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Posts grid */}
            {posts.data.length === 0 ? (
                <EmptyState
                    title={t("No posts yet")}
                    description={t("Write your first blog post or news article.")}
                    actionHref="/admin/posts/create"
                    actionLabel={t("New Post")}
                    borderColor="border-t-slate-500"
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {posts.data.map((post) => (
                            <div
                                key={post.id}
                                className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${post.status === 'draft' ? 'opacity-75' : ''}`}
                            >
                                {/* Cover image */}
                                <div className="relative aspect-video overflow-hidden">
                                    {post.image_url ? (
                                        <img
                                            src={post.image_url}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-600 to-gray-700 flex items-center justify-center">
                                            <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Status badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${post.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-gray-500 text-white'}`}>
                                            {post.status === 'published' ? t('Published') : t('Draft')}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    {/* Category + reading time */}
                                    <div className="flex items-center gap-2 mb-2">
                                        {post.category && (
                                            <span className="text-xs font-bold text-teal-500 uppercase tracking-wider">{post.category}</span>
                                        )}
                                        {post.category && post.reading_time && (
                                            <span className="text-gray-300 dark:text-gray-600">·</span>
                                        )}
                                        {post.reading_time && (
                                            <span className="text-xs text-gray-400">{post.reading_time} min</span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 mb-2">
                                        <Link href={`/admin/posts/${post.id}`} className="hover:text-teal-500 transition-colors">
                                            {post.title}
                                        </Link>
                                    </h3>

                                    {/* Excerpt */}
                                    {(post.excerpt || post.description) && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                            {post.excerpt || post.description}
                                        </p>
                                    )}

                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {post.tags.slice(0, 3).map((tag, i) => (
                                                <span key={i} className="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                                                    {tag}
                                                </span>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <span className="text-[10px] text-gray-400">+{post.tags.length - 3}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* Author + date */}
                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                                        <span>
                                            {post.author ? `${t('By')} ${post.author.name}` : '--'}
                                        </span>
                                        <span>{timeAgo(post.published_at || post.created_at)}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                        <Link
                                            href={`/admin/posts/${post.id}`}
                                            className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {t('View')}
                                        </Link>
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {t('Edit')}
                                        </Link>
                                        {deleteConfirm === post.id ? (
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    {t('Confirm')}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="px-2 py-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                                >
                                                    {t('Cancel')}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setDeleteConfirm(post.id)}
                                                className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                                            >
                                                {t('Delete')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Pagination links={posts.links} />
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
