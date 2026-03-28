import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

function CountUp({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const startTime = Date.now();
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * end));
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
                observer.disconnect();
            }
        }, { threshold: 0.3 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

interface Props {
    publicStats: {
        projects_delivered: number;
        active_clients: number;
        technologies: number;
        years_experience: number;
    };
    sectionRef: React.RefObject<HTMLDivElement>;
    isVisible: boolean;
}

export default function StatsSection({ publicStats, sectionRef, isVisible }: Props) {
    const { t } = useTranslation();

    return (
        <section className="py-16 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden" ref={sectionRef}>
            <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(94,234,212,0.3),transparent_50%)]" />
            </div>
            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { value: publicStats.projects_delivered, suffix: '+', label: t('Projects Delivered') },
                        { value: publicStats.active_clients, suffix: '+', label: t('Active Clients') },
                        { value: publicStats.technologies, suffix: '+', label: t('Technologies') },
                        { value: publicStats.years_experience, suffix: '+', label: t('Years Experience') },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-5xl md:text-6xl font-bold text-teal-400 bebas" style={{ letterSpacing: '2px' }}>
                                {isVisible ? <CountUp end={stat.value} suffix={stat.suffix} /> : `0${stat.suffix}`}
                            </div>
                            <div className="mt-2 text-sm md:text-base text-gray-400 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
