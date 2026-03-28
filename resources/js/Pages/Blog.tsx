import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PaginatedData } from '@/types';
import { useTranslation } from 'react-i18next';
import OriginalLanguageBadge from '@/Components/ui/OriginalLanguageBadge';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    description?: string;
    category?: string;
    tags?: string[];
    image_url?: string;
    reading_time?: number;
    author?: { id: number; name: string };
    published_at?: string;
    created_at: string;
}

interface Props {
    posts: PaginatedData<Post>;
    categories: string[];
    seo: { title: string; description: string };
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

function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
    const { t } = useTranslation();
    return (
        <Link
            href={`/posts/${post.slug}`}
            className={`group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${featured ? 'md:flex' : ''}`}
        >
            {/* Image */}
            <div className={`overflow-hidden ${featured ? 'md:w-1/2 h-64 md:h-auto' : 'h-52'}`}>
                {post.image_url ? (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center min-h-[13rem]">
                        <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={`p-6 ${featured ? 'md:w-1/2 md:p-8 md:flex md:flex-col md:justify-center' : ''}`}>
                <div className="flex items-center gap-2 mb-3">
                    {post.category && (
                        <span className="text-xs font-bold text-teal-500 uppercase tracking-widest">{post.category}</span>
                    )}
                    {post.category && post.reading_time && (
                        <span className="text-gray-300">·</span>
                    )}
                    {post.reading_time && (
                        <span className="text-xs text-gray-400">{post.reading_time} {t('min read')}</span>
                    )}
                </div>

                {featured && <OriginalLanguageBadge className="mb-2" />}
                <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                    {post.title}
                </h3>

                {(post.excerpt || post.description) && (
                    <p className={`text-gray-500 mb-4 ${featured ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'}`}>
                        {post.excerpt || post.description}
                    </p>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                        {post.author && (
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-[10px] font-bold text-teal-700">
                                    {post.author.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs text-gray-500">{post.author.name}</span>
                            </div>
                        )}
                        <span className="text-xs text-gray-400">
                            {timeAgo(post.published_at || post.created_at)}
                        </span>
                    </div>
                    <span className="text-sm font-bold text-teal-500 group-hover:text-teal-600 flex items-center gap-1 transition-colors">
                        {t('Read More')}
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function Blog({ posts, categories, seo }: Props) {
    const { t } = useTranslation();
    const currentCategory = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '').get('category') || '';

    const filterByCategory = (category: string) => {
        router.get('/posts', category ? { category } : {}, {
            preserveState: true,
            replace: true,
        });
    };

    const featured = posts.data.length > 0 ? posts.data[0] : null;
    const rest = posts.data.slice(1);

    return (
        <PublicLayout title={seo?.title || 'Blog'}>
            <Head>
                <meta name="description" content={seo?.description || 'Articles et actualités'} />
            </Head>

            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }
            `}</style>

            {/* Header */}
            <section className="bg-gray-900 py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(94,234,212,0.4),transparent_50%)]" />
                </div>
                <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-7xl md:text-9xl font-semibold text-white bebas" style={{ letterSpacing: '2px' }}>
                        {t('Blog')}
                    </h1>
                    <hr className="mt-6 border-white/10 max-w-md mx-auto" />
                    <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
                        Articles, guides et actualités sur le développement web, mobile et la transformation digitale.
                    </p>
                </div>
            </section>

            {/* Category filters */}
            {categories.length > 0 && (
                <div className="bg-gray-100 border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 py-4">
                        <div className="flex items-center gap-2 overflow-x-auto">
                            <button
                                onClick={() => filterByCategory('')}
                                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${!currentCategory ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                            >
                                {t('All')}
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => filterByCategory(cat)}
                                    className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${currentCategory === cat ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Posts */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    {posts.data.length === 0 ? (
                        <div className="text-center py-20">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                            </svg>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">{t('No articles found')}</h3>
                            <p className="text-gray-500">Revenez bientôt pour découvrir nos prochains articles.</p>
                        </div>
                    ) : (
                        <>
                            {/* Featured post */}
                            {featured && posts.current_page === 1 && (
                                <div className="mb-10">
                                    <PostCard post={featured} featured />
                                </div>
                            )}

                            {/* Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {(posts.current_page === 1 ? rest : posts.data).map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {posts.last_page > 1 && (
                                <nav className="flex items-center justify-center space-x-2 mt-12">
                                    {posts.links.map((link, i) => (
                                        <span key={i}>
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    className={`px-4 py-2 text-sm rounded-full transition-colors ${
                                                        link.active
                                                            ? 'bg-gray-900 text-white'
                                                            : 'bg-white text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span className="px-4 py-2 text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </span>
                                    ))}
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
