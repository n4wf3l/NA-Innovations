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

interface Props {
    post: Post;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export default function PostShow({ post }: Props) {
    return (
        <PublicLayout title={post.title}>
            {/* Hero */}
            <section className="bg-gray-900 relative overflow-hidden py-24">
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <Link href="/posts" className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition mb-8 bebas" style={{ letterSpacing: '1px' }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back to News
                    </Link>
                    <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-4">{post.subject || 'News'}</p>
                    <h1 className="text-5xl md:text-7xl font-bold text-white bebas" style={{ letterSpacing: '2px' }}>
                        {post.title}
                    </h1>
                    <p className="mt-4 text-gray-400">
                        Published on {formatDate(post.created_at)}
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    {post.photo && (
                        <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={`/storage/${post.photo}`}
                                alt={post.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-teal-500 prose-a:no-underline hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: post.description }}
                    />

                    <div className="mt-16 pt-8 border-t border-gray-200 text-center">
                        <Link
                            href="/posts"
                            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-black text-black font-bold rounded-full hover:bg-teal-300 hover:border-teal-300 hover:text-white transition-all duration-300 bebas"
                            style={{ letterSpacing: '2px' }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            BACK TO ALL NEWS
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
