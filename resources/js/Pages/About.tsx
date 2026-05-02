import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useTranslation } from 'react-i18next';
import OriginalLanguageBadge from '@/Components/ui/OriginalLanguageBadge';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionNav from '@/Components/landing/SectionNav';
import SpinnerLink from '@/Components/landing/SpinnerLink';

interface AboutData {
    id: number;
    section_key: string;
    title: string | null;
    subtitle: string | null;
    description: string | null;
    is_active: boolean;
    metadata: {
        mission?: string;
        vision?: string;
        values?: string[];
    } | null;
}

interface Props {
    about?: AboutData | null;
    seo?: { title: string; description: string };
}

export default function About({ about, seo }: Props) {
    const { t } = useTranslation();
    useScrollReveal();
    const metadata = about?.metadata || {};
    const values = metadata.values || ['Innovation', 'Qualité', 'Transparence', 'Accompagnement'];

    const valueIcons = [
        <svg key="1" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
        <svg key="2" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
        <svg key="3" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>,
        <svg key="4" className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
    ];

    return (
        <PublicLayout title={seo?.title || t('About')} description={seo?.description || t('Belgian software company passionate about building digital products that make a difference.')}>
            {seo?.description && (
                <Head>
                    <meta name="description" content={seo.description} />
                </Head>
            )}

            {/* Hero Section */}
            <section className="bg-gray-900 relative overflow-hidden py-32">
                <div aria-hidden="true">
                    <span className="hero-word hero-word-1">ABOUT</span>
                    <span className="hero-word hero-word-2">TEAM</span>
                    <span className="hero-word hero-word-3">VISION</span>
                    <span className="hero-word hero-word-4">MISSION</span>
                    <span className="hero-word hero-word-5">VALUES</span>
                    <span className="hero-word hero-word-6">INNOVATION</span>
                </div>
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <h1 className="text-7xl md:text-9xl font-bold text-white bebas hero-fade" style={{ letterSpacing: '3px' }}>
                        {about?.title || t('About Us')}
                    </h1>
                    <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto hero-fade hero-fade-delay-1">
                        {about?.subtitle || t('We are a Belgian software company passionate about building digital products that make a difference.')}
                    </p>
                </div>
            </section>

            {/* Who We Are */}
            <section id="section-who" className="py-20 bg-white dark:bg-gray-900 scroll-mt-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="reveal-left">
                            <OriginalLanguageBadge className="mb-3" />
                            <h2 className="text-5xl font-bold text-gray-900 dark:text-white bebas mb-6" style={{ letterSpacing: '2px' }}>
                                {t('Who We Are')}
                            </h2>
                            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                                {about?.description ? (
                                    about.description.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
                                ) : (
                                    <>
                                        <p>
                                            <strong className="text-gray-900 dark:text-white">{t('NA Innovations conçoit des produits digitaux sur mesure')}</strong> {t('pour les entreprises qui veulent transformer une idée en réalité - site web, application mobile, SaaS ou logiciel métier.')}
                                        </p>
                                        <p>
                                            <strong className="text-gray-900 dark:text-white">{t('Notre promesse :')}</strong> {t('des solutions optimisées, sécurisées et maintenables, pensées pour générer du résultat business - pas juste « faire un site ».')}
                                        </p>
                                        <p>
                                            <strong className="text-gray-900 dark:text-white">{t('Ce qui nous rend différents :')}</strong> {t('un espace client intégré. Dès la signature, vous ouvrez un compte sur notre plateforme et suivez en direct l\'avancement de votre projet, les livrables, les échanges et la facturation - de A à Z. Zéro zone d\'ombre.')}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="space-y-6 reveal-right">
                            {metadata.mission && (
                                <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl p-8 text-white">
                                    <h3 className="text-2xl font-bold bebas mb-3" style={{ letterSpacing: '1px' }}>{t('Our Mission')}</h3>
                                    <p className="text-teal-50 leading-relaxed">{metadata.mission}</p>
                                </div>
                            )}
                            {metadata.vision && (
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 text-white">
                                    <h3 className="text-2xl font-bold bebas mb-3" style={{ letterSpacing: '1px' }}>{t('Our Vision')}</h3>
                                    <p className="text-gray-300 leading-relaxed">{metadata.vision}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section id="section-values" className="py-20 bg-gray-100 dark:bg-gray-800 scroll-mt-20">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white bebas text-center mb-16 reveal" style={{ letterSpacing: '2px' }}>
                        {t('Our Values')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 reveal-stagger">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-center">
                                <div className="w-14 h-14 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-500 flex items-center justify-center mb-6 mx-auto">
                                    {valueIcons[index % valueIcons.length]}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{value}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Tech Stack */}
            <section id="section-tech" className="py-20 bg-white dark:bg-gray-900 scroll-mt-20">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white bebas text-center mb-16 reveal" style={{ letterSpacing: '2px' }}>
                        {t('Our Tech Stack')}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 reveal-stagger">
                        {[
                            'Laravel', 'React', 'TypeScript', 'Tailwind CSS',
                            'Node.js', 'PostgreSQL', 'MySQL', 'Docker',
                            'Flutter', 'React Native', 'AWS', 'Git',
                        ].map((tech, index) => (
                            <div key={index} className="text-center py-6 px-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-all duration-300">
                                <span className="text-gray-700 dark:text-gray-300 font-semibold">{tech}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How We Work */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16 reveal">
                        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 bebas" style={{ letterSpacing: '2px' }}>
                            {t('How We Work')}
                        </h2>
                        <p className="mt-4 text-gray-500 max-w-2xl mx-auto">{t('A transparent, efficient process from first contact to delivery.')}</p>
                    </div>
                    <div className="relative">
                        {/* Connecting line */}
                        <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-gray-200" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 reveal-stagger">
                            {[
                                { num: '01', title: t('Discovery'), desc: t('We listen, analyze your needs and define the scope together.'), color: 'from-teal-400 to-teal-500' },
                                { num: '02', title: t('Design'), desc: t('Wireframes, mockups and architecture validated by you before any code.'), color: 'from-blue-400 to-blue-500' },
                                { num: '03', title: t('Development'), desc: t('We build with regular updates. Track progress via your client portal.'), color: 'from-violet-400 to-violet-500' },
                                { num: '04', title: t('Testing'), desc: t('Rigorous testing on all devices. Every detail polished.'), color: 'from-amber-400 to-amber-500' },
                                { num: '05', title: t('Launch'), desc: t('Deployment, training and ongoing support. We stay by your side.'), color: 'from-emerald-400 to-emerald-500' },
                            ].map((step) => (
                                <div key={step.num} className="flex flex-col items-center text-center group">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-xl font-bold bebas mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                        {step.num}
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="section-cta" className="py-20 bg-gray-900 relative overflow-hidden scroll-mt-20">
                <div className="absolute inset-0 opacity-[0.02] flex items-center justify-center" aria-hidden="true">
                    <span className="text-[20vw] font-bold text-white bebas whitespace-nowrap">{t("LET'S TALK")}</span>
                </div>
                <div className="max-w-3xl mx-auto text-center px-4 relative z-10 reveal">
                    <h2 className="text-5xl md:text-7xl font-bold text-white bebas mb-6" style={{ letterSpacing: '2px' }}>
                        {t('Want to work with us?')}
                    </h2>
                    <p className="text-lg text-gray-400 mb-10">
                        {t("Let's talk about your project.")}
                    </p>
                    <SpinnerLink
                        href="/contact#contact"
                        className="inline-flex items-center gap-3 px-12 py-6 bg-teal-400 text-gray-900 text-2xl font-bold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-teal-300 hover:shadow-[0_0_60px_rgba(94,234,212,0.4)] bebas"
                        style={{ letterSpacing: '3px' }}
                    >
                        {t('Contact Us').toUpperCase()}
                    </SpinnerLink>
                </div>
            </section>

            <SectionNav sections={[
                { id: 'section-who', label: 'Who We Are' },
                { id: 'section-values', label: 'Our Values' },
                { id: 'section-tech', label: 'Tech Stack' },
                { id: 'section-cta', label: 'Contact' },
            ]} />
        </PublicLayout>
    );
}
