import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import { PaginatedData } from '@/types';
import { formatDate } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    status: string;
    category?: string;
    author?: { id: number; name: string };
    published_at?: string;
    created_at: string;
}

interface Props {
    posts: PaginatedData<Post>;
}

export default function PostsIndex({ posts }: Props) {
    const { t } = useTranslation();
    const columns = [
        {
            header: t('Title'),
            accessor: (post: Post) => (
                <div>
                    <Link href={`/admin/posts/${post.id}`} className="font-medium text-gray-900 dark:text-white hover:text-slate-600">{post.title}</Link>
                    {post.excerpt && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{post.excerpt}</p>}
                </div>
            ),
        },
        { header: t('Category'), accessor: (post: Post) => <span className="text-gray-500 capitalize">{post.category || '--'}</span> },
        { header: t('Author'), accessor: (post: Post) => <span className="text-gray-500">{post.author?.name || '--'}</span> },
        { header: t('Status'), accessor: (post: Post) => <Badge status={post.status} /> },
        { header: t('Published'), accessor: (post: Post) => <span className="text-gray-500">{post.published_at ? formatDate(post.published_at) : '--'}</span> },
        {
            header: t('Actions'),
            className: 'text-right',
            accessor: (post: Post) => (
                <span>
                    <Link href={`/admin/posts/${post.id}`} className="text-gray-400 hover:text-slate-600 mr-2">{t('View')}</Link>
                    <Link href={`/admin/posts/${post.id}/edit`} className="text-gray-400 hover:text-gray-600">{t('Edit')}</Link>
                </span>
            ),
        },
    ];

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

            {/* Table */}
            {posts.data.length === 0 ? (
                <EmptyState title={t("No posts yet")} description={t("Write your first blog post or news article.")} actionHref="/admin/posts/create" actionLabel={t("New Post")} borderColor="border-t-slate-500" />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={posts.data}
                        keyExtractor={post => post.id}
                    />
                    <div className="mt-2">
                        <Pagination links={posts.links} />
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
