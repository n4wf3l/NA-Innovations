import PublicLayout from '@/Layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getTermsContent } from './termsContent';

export default function Terms() {
    useScrollReveal();
    const { locale } = usePage<{ locale?: string }>().props;
    const content = getTermsContent(locale);

    return (
        <PublicLayout title={content.title} description={content.title + ' — NA Innovations BV'}>
            <Head title={content.title} />

            <style>{`
                .bebas { font-family: 'Bebas Neue', sans-serif; }
                .legal-content h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #111827;
                    margin-top: 2rem;
                    margin-bottom: 0.75rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                .legal-content p {
                    color: #4b5563;
                    line-height: 1.8;
                    margin-bottom: 1rem;
                }
                .legal-content ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                .legal-content li {
                    color: #4b5563;
                    line-height: 1.8;
                    margin-bottom: 0.25rem;
                }
                .legal-content a {
                    color: #0d9488;
                    text-decoration: underline;
                }

                /* Dark mode */
                .dark .legal-content h2 {
                    color: #f9fafb;
                    border-color: #374151;
                }
                .dark .legal-content p {
                    color: #9ca3af;
                }
                .dark .legal-content li {
                    color: #9ca3af;
                }
            `}</style>

            {/* Hero */}
            <section className="bg-gray-900 py-24">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-white bebas hero-fade" style={{ letterSpacing: '3px' }}>
                        {content.title}
                    </h1>
                </div>
            </section>

            {/* Content */}
            <div className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-3xl mx-auto px-4 reveal">
                    <div
                        className="legal-content"
                        style={{ lineHeight: 1.8 }}
                        dangerouslySetInnerHTML={{ __html: content.html }}
                    />
                </div>
            </div>
        </PublicLayout>
    );
}
