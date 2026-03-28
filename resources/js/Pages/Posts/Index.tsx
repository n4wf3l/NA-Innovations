import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Post {
    id: number;
    title: string;
    subject: string;
    description: string;
    photo: string | null;
    created_at: string;
}

interface PaginatedPosts {
    data: Post[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    posts: PaginatedPosts;
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
}

function truncate(text: string, maxLength: number): string {
    const stripped = text.replace(/<[^>]*>/g, '');
    if (stripped.length <= maxLength) return stripped;
    return stripped.substring(0, maxLength) + '...';
}

export default function PostsIndex({ posts }: Props) {
    return (
        <PublicLayout title="News">
            {/* Hero Section */}
            <section className="bg-gray-900 relative overflow-hidden py-32">
                <div aria-hidden="true">
                    <span className="hero-word hero-word-1">NEWS</span>
                    <span className="hero-word hero-word-2">BLOG</span>
                    <span className="hero-word hero-word-3">UPDATES</span>
                    <span className="hero-word hero-word-4">ARTICLES</span>
                </div>
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <h1 className="text-7xl md:text-9xl font-bold text-white bebas" style={{ letterSpacing: '3px' }}>
                        News &amp; Updates
                    </h1>
                    <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
                        Stay up to date with the latest from NA Innovations. Company news, tech insights, and project highlights.
                    </p>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-20 bg-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    {posts.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.data.map((post) => (
                                    <div key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
                                        {post.photo ? (
                                            <div className="overflow-hidden h-52">
                                                <img
                                                    src={`/storage/${post.photo}`}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-52 bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                                                <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className="p-6">
                                            <p className="text-xs font-bold text-teal-500 uppercase tracking-widest mb-2">
                                                {post.subject || 'News'}
                                            </p>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                                                {truncate(post.description, 150)}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
                                                <Link
                                                    href={`/posts/${post.id}`}
                                                    className="text-sm font-bold text-teal-500 hover:text-teal-600 flex items-center gap-1 transition-colors"
                                                >
                                                    Read more
                                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {posts.last_page > 1 && (
                                <div className="flex justify-center gap-2 mt-12">
                                    {posts.links.map((link, index) => (
                                        <span key={index}>
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                        link.active
                                                            ? 'bg-teal-400 text-white'
                                                            : 'bg-white text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-200'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                            </svg>
                            <p className="text-2xl text-gray-400 bebas" style={{ letterSpacing: '2px' }}>No posts yet. Stay tuned!</p>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
