import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from 'react-i18next';
import SectionNav from '@/Components/landing/SectionNav';
import SpinnerLink from '@/Components/landing/SpinnerLink';

interface ServiceData {
    id: number;
    title: string;
    description: string;
    icon: string;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    services: ServiceData[];
}

const iconMap: Record<string, JSX.Element> = {
    globe: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
    ),
    mobile: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
    ),
    server: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
        </svg>
    ),
    code: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
    ),
    rocket: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-8.42a14.927 14.927 0 00-2.58 5.841m0 0a3 3 0 104.243 4.243" />
        </svg>
    ),
    shield: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    ),
};

function getIcon(iconName: string): JSX.Element {
    return iconMap[iconName] || iconMap['code'];
}

export default function Services({ services }: Props) {
    const { t } = useTranslation();
    useScrollReveal();

    return (
        <PublicLayout title="Services" description="Web development, mobile apps, SaaS platforms - end-to-end digital solutions tailored to your business needs.">
            {/* Hero Section */}
            <section className="bg-gray-900 relative overflow-hidden py-32">
                <div aria-hidden="true">
                    <span className="hero-word hero-word-1">SERVICES</span>
                    <span className="hero-word hero-word-2">WEB</span>
                    <span className="hero-word hero-word-3">MOBILE</span>
                    <span className="hero-word hero-word-4">SAAS</span>
                    <span className="hero-word hero-word-5">DESIGN</span>
                    <span className="hero-word hero-word-6">CODE</span>
                </div>
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <h1 className="text-7xl md:text-9xl font-bold text-white bebas hero-fade" style={{ letterSpacing: '3px' }}>
                        {t('Our Services')}
                    </h1>
                    <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto hero-fade hero-fade-delay-1">
                        {t('We deliver end-to-end digital solutions tailored to your business needs.')}
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section id="section-services-grid" className="py-20 bg-white dark:bg-gray-900 scroll-mt-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-stagger">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-400/10 hover:-translate-y-2 hover:border-teal-300 fade-in-up"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-teal-500 mb-6 transition-all duration-300 group-hover:bg-teal-400 group-hover:text-white group-hover:scale-110">
                                    {getIcon(service.icon)}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bebas" style={{ letterSpacing: '1px' }}>
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {services.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-2xl text-gray-400 dark:text-gray-500 bebas" style={{ letterSpacing: '2px' }}>{t('No services available at the moment.')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us */}
            <section id="section-why-us" className="py-20 bg-gray-100 dark:bg-gray-800 scroll-mt-20">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white bebas text-center mb-16 reveal" style={{ letterSpacing: '2px' }}>
                        {t('Why Choose NA Innovations?')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal-stagger">
                        {[
                            { title: t('Full-Stack Expertise'), desc: t('From frontend to backend, databases to deployment, we handle the complete technology stack.') },
                            { title: t('Quality First'), desc: t('Clean code, thorough testing, and best practices ensure your product stands the test of time.') },
                            { title: t('Agile Process'), desc: t('Regular updates, transparent communication, and iterative development keep you in control.') },
                            { title: t('Post-Launch Support'), desc: t('Our relationship does not end at deployment. We provide ongoing maintenance and support.') },
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-14 h-14 rounded-full bg-teal-400 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold bebas">
                                    {index + 1}
                                </div>
                                <h3 className="text-xl font-bold dark:text-white mb-2">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="section-cta" className="py-20 bg-gray-900 relative overflow-hidden scroll-mt-20">
                <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center" aria-hidden="true">
                    <span className="text-[20vw] font-bold text-white bebas whitespace-nowrap">{t("LET'S BUILD")}</span>
                </div>
                <div className="max-w-3xl mx-auto text-center px-4 relative z-10 reveal">
                    <h2 className="text-5xl md:text-7xl font-bold text-white bebas mb-6" style={{ letterSpacing: '2px' }}>
                        {t('Have a project in mind?')}
                    </h2>
                    <p className="text-lg text-gray-400 mb-10">
                        {t("Get in touch and let's discuss how we can bring your vision to life.")}
                    </p>
                    <SpinnerLink
                        href="/contact#quote"
                        className="inline-flex items-center gap-3 px-12 py-6 bg-teal-400 text-gray-900 text-2xl font-bold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-teal-300 hover:shadow-[0_0_60px_rgba(94,234,212,0.4)] bebas"
                        style={{ letterSpacing: '3px' }}
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        {t('REQUEST A QUOTE')}
                    </SpinnerLink>
                </div>
            </section>

            <SectionNav sections={[
                { id: 'section-services-grid', label: 'Services' },
                { id: 'section-why-us', label: 'Why Choose Us' },
                { id: 'section-cta', label: 'Get Started' },
            ]} />
        </PublicLayout>
    );
}
