import { useTranslation } from 'react-i18next';
import OriginalLanguageBadge from '@/Components/ui/OriginalLanguageBadge';

interface Testimonial {
    text: string;
    author: string;
    role: string;
    project: string | null;
    logo: string | null;
}

interface Props {
    testimonials: Testimonial[];
    sectionRef: React.RefObject<HTMLDivElement>;
    isVisible: boolean;
}

export default function TestimonialsSection({ testimonials, sectionRef, isVisible }: Props) {
    const { t } = useTranslation();

    return (
        <section className="py-20 bg-gray-900 relative overflow-hidden" ref={sectionRef}>
            <div className="absolute inset-0 opacity-[0.02]" aria-hidden="true">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(94,234,212,0.4),transparent_50%)]" />
            </div>
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-7xl md:text-9xl font-semibold text-white bebas" style={{ letterSpacing: '2px' }}>{t('What Our Clients Say')}</h2>
                    <hr className="mt-6 border-white/10 max-w-md mx-auto" />
                    <OriginalLanguageBadge light className="mt-4 justify-center" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <div
                            key={i}
                            className={`bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 transition-all duration-700 hover:bg-white/10 ${
                                isVisible ? 'fade-in-up' : 'opacity-0'
                            }`}
                            style={{ animationDelay: `${i * 150}ms` }}
                        >
                            <svg className="w-10 h-10 text-teal-400/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                            </svg>
                            <p className="text-white/80 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
                            <div className="flex items-center gap-3">
                                {testimonial.logo && (
                                    <img src={`/storage/${testimonial.logo}`} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                )}
                                <div>
                                    <p className="text-white font-semibold text-sm">{testimonial.author}</p>
                                    <p className="text-gray-400 text-xs">{testimonial.role}</p>
                                    {testimonial.project && <p className="text-teal-400 text-xs mt-0.5">{testimonial.project}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
