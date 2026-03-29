import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import OriginalLanguageBadge from '@/Components/ui/OriginalLanguageBadge';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    description?: string;
    content?: string;
    category?: string;
    tags?: string[];
    image_url?: string;
    reading_time?: number;
    meta_title?: string;
    meta_description?: string;
    author?: { id: number; name: string };
    published_at?: string;
    created_at: string;
}

interface Props {
    post: Post;
    relatedPosts: Post[];
}

function formatDateFr(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
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

export default function BlogShow({ post, relatedPosts }: Props) {
    const { t } = useTranslation();
    useScrollReveal();
    const metaTitle = post.meta_title || post.title;
    const metaDescription = post.meta_description || post.excerpt || post.description || '';
    const articleJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: metaDescription,
        author: post.author ? { '@type': 'Person', name: post.author.name } : undefined,
        datePublished: post.published_at || post.created_at,
        image: post.image_url || undefined,
        publisher: { '@type': 'Organization', name: 'NA Innovations' },
    };

    return (
        <PublicLayout title={metaTitle} description={metaDescription} ogImage={post.image_url || undefined} jsonLd={articleJsonLd}>

            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }

                .article-content h2 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #111827;
                    margin-top: 2.5rem;
                    margin-bottom: 1rem;
                    line-height: 1.3;
                }
                .article-content h3 {
                    font-size: 1.375rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin-top: 2rem;
                    margin-bottom: 0.75rem;
                    line-height: 1.4;
                }
                .article-content p {
                    color: #4b5563;
                    line-height: 1.8;
                    margin-bottom: 1.25rem;
                    font-size: 1.0625rem;
                }
                .article-content ul, .article-content ol {
                    margin: 1rem 0;
                    padding-left: 1.5rem;
                }
                .article-content ul {
                    list-style-type: disc;
                }
                .article-content ol {
                    list-style-type: decimal;
                }
                .article-content li {
                    color: #4b5563;
                    line-height: 1.8;
                    margin-bottom: 0.5rem;
                    font-size: 1.0625rem;
                }
                .article-content strong {
                    color: #111827;
                    font-weight: 600;
                }
                .article-content a {
                    color: #14b8a6;
                    text-decoration: none;
                }
                .article-content a:hover {
                    text-decoration: underline;
                }
                .article-content blockquote {
                    border-left: 4px solid #14b8a6;
                    background: #f9fafb;
                    padding: 1rem 1.5rem;
                    margin: 1.5rem 0;
                    border-radius: 0 0.75rem 0.75rem 0;
                    font-style: italic;
                    color: #374151;
                }
                .article-content code {
                    background: #f3f4f6;
                    padding: 0.125rem 0.375rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                    font-family: ui-monospace, SFMono-Regular, monospace;
                    color: #374151;
                }
                .article-content pre {
                    background: #1f2937;
                    color: #e5e7eb;
                    padding: 1.25rem;
                    border-radius: 0.75rem;
                    overflow-x: auto;
                    margin: 1.5rem 0;
                }
                .article-content pre code {
                    background: transparent;
                    color: inherit;
                    padding: 0;
                }
                .article-content img {
                    width: 100%;
                    border-radius: 0.75rem;
                    margin: 1.5rem 0;
                }

                /* Dark mode */
                .dark .article-content h2 {
                    color: #f9fafb;
                    border-color: #374151;
                }
                .dark .article-content h3 {
                    color: #e5e7eb;
                }
                .dark .article-content p {
                    color: #9ca3af;
                }
                .dark .article-content li {
                    color: #9ca3af;
                }
                .dark .article-content strong {
                    color: #f9fafb;
                }
                .dark .article-content blockquote {
                    background: #1f2937;
                    color: #d1d5db;
                }
                .dark .article-content code {
                    background: #374151;
                    color: #d1d5db;
                }
            `}</style>

            {/* Hero with cover image */}
            <section className="relative">
                {post.image_url ? (
                    <div className="relative h-[400px] md:h-[500px]">
                        <img src={post.image_url} alt={post.title} loading="lazy" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                            <div className="max-w-3xl mx-auto hero-fade">
                                <div className="flex items-center gap-3 mb-4">
                                    {post.category && (
                                        <span className="inline-flex items-center rounded-full bg-teal-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                                            {post.category}
                                        </span>
                                    )}
                                    {post.reading_time && (
                                        <span className="text-sm text-white/70">{post.reading_time} {t('min read')}</span>
                                    )}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                                    {post.title}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-white/70">
                                    {post.author && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-teal-500/30 flex items-center justify-center text-xs font-bold text-white">
                                                {post.author.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-white">{post.author.name}</span>
                                        </div>
                                    )}
                                    {post.published_at && (
                                        <span>{formatDateFr(post.published_at)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-900 py-20">
                        <div className="max-w-3xl mx-auto px-4 text-center hero-fade">
                            <div className="flex items-center justify-center gap-3 mb-6">
                                {post.category && (
                                    <span className="inline-flex items-center rounded-full bg-teal-500 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                                        {post.category}
                                    </span>
                                )}
                                {post.reading_time && (
                                    <span className="text-sm text-gray-400">{post.reading_time} {t('min read')}</span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                                {post.title}
                            </h1>
                            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                                {post.author && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-teal-500/30 flex items-center justify-center text-xs font-bold text-teal-300">
                                            {post.author.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-white">{post.author.name}</span>
                                    </div>
                                )}
                                {post.published_at && (
                                    <span>{formatDateFr(post.published_at)}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Article body */}
            <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
                <div className="max-w-3xl mx-auto px-4 reveal">
                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 pb-10 border-b border-gray-200 dark:border-gray-700 font-light">
                            {post.excerpt}
                        </p>
                    )}

                    {/* Content */}
                    <OriginalLanguageBadge className="mb-6" />
                    {post.content ? (
                        <div
                            className="article-content"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    ) : post.description ? (
                        <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                            {post.description}
                        </div>
                    ) : null}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 reveal">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-500/10 hover:text-teal-600 transition-colors">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back to blog */}
                    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <Link
                            href="/posts"
                            className="inline-flex items-center gap-2 text-sm font-bold text-teal-500 hover:text-teal-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            {t('Back to blog')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
                <section className="py-16 bg-gray-100 dark:bg-gray-800">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-4xl md:text-5xl font-semibold text-black dark:text-white bebas text-center mb-12" style={{ letterSpacing: '2px' }}>
                            {t('Related Articles')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-stagger">
                            {relatedPosts.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/posts/${related.slug}`}
                                    className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                                >
                                    <div className="overflow-hidden h-48">
                                        {related.image_url ? (
                                            <img
                                                src={related.image_url}
                                                alt={related.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                                                <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        {related.category && (
                                            <span className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-2 block">{related.category}</span>
                                        )}
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-teal-600 transition-colors mb-2">
                                            {related.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                                            <span>{timeAgo(related.published_at || related.created_at)}</span>
                                            {related.reading_time && <span>{related.reading_time} min</span>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </PublicLayout>
    );
}
