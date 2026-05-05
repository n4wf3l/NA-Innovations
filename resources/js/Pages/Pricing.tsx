import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionNav from '@/Components/landing/SectionNav';
import SpinnerLink from '@/Components/landing/SpinnerLink';
import {
    projectTypeOptions,
    formatEUR,
} from './Contact/SimulatorData';

interface Props {
    seo?: { title: string; description: string };
}

const packs = [
    {
        id: 'essentiel',
        name: 'Essentiel',
        popular: false,
        types: ['static_site', 'showcase_site', 'blog_portfolio'],
        startPrice: 500,
        features: [
            { text: 'Responsive design', included: true },
            { text: 'SEO', included: true },
            { text: 'Contact form', included: true },
            { text: 'SSL', included: true },
            { text: 'Hosting setup', included: true },
            { text: 'Analytics', included: true },
        ],
        color: 'teal',
    },
    {
        id: 'professionnel',
        name: 'Professionnel',
        popular: true,
        types: ['ecommerce', 'custom_cms'],
        startPrice: 3500,
        features: [
            { text: 'Tout Essentiel', included: true },
            { text: 'Payment integration', included: true },
            { text: 'Product catalog', included: true },
            { text: 'Inventory management', included: true },
            { text: 'Customer accounts', included: true },
            { text: 'Multilingual', included: true },
        ],
        color: 'indigo',
    },
    {
        id: 'sur_mesure',
        name: 'Sur mesure',
        popular: false,
        types: ['platform_saas', 'mobile_app', 'desktop_app', 'api_backend'],
        startPrice: 6000,
        features: [
            { text: 'Tout Professionnel', included: true },
            { text: 'Dashboard / admin panel', included: true },
            { text: 'API integration', included: true },
            { text: 'User accounts & roles', included: true },
            { text: 'Real-time notifications', included: true },
            { text: 'Multi-tenancy', included: true },
        ],
        color: 'rose',
    },
];

export default function Pricing({ seo }: Props) {
    const { t } = useTranslation();
    useScrollReveal();

    return (
        <PublicLayout title={seo?.title || t('Pricing')} description={seo?.description || 'Transparent pricing for web development, mobile apps and SaaS platforms.'}>
            <Head>
                <title>{seo?.title || t('Pricing')}</title>
                <meta name="description" content={seo?.description || t('Our indicative pricing by project type.')} />
            </Head>

            {/* Hero */}
            <section className="bg-gray-900 py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
                    <p className="text-teal-400 text-sm font-semibold uppercase tracking-widest mb-3">{t('Pricing')}</p>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 hero-fade" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}>
                        {t('Transparent pricing')}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg hero-fade hero-fade-delay-1">
                        {t('Indicative rates for every type of project. Each project is unique -- use our simulator for a personalized estimate.')}
                    </p>
                </div>
            </section>

            {/* Pricing cards */}
            <section id="section-pricing" className="bg-gray-50 dark:bg-gray-800 py-20 scroll-mt-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-stagger">
                        {packs.map((pack) => {
                            const borderColor = pack.color === 'teal' ? 'border-teal-400' : pack.color === 'indigo' ? 'border-indigo-500' : 'border-rose-500';
                            const bgPopular = pack.popular ? 'ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/10' : 'shadow-lg';
                            const btnBg = pack.color === 'teal'
                                ? 'bg-teal-400 hover:bg-teal-300 text-gray-900'
                                : pack.color === 'indigo'
                                ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                                : 'bg-rose-500 hover:bg-rose-400 text-white';

                            return (
                                <div key={pack.id} className={`relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden ${bgPopular} flex flex-col`}>
                                    {pack.popular && (
                                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                                            {t('Popular')}
                                        </div>
                                    )}
                                    <div className={`border-t-4 ${borderColor}`} />
                                    <div className="p-8 flex-1 flex flex-col">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{t(pack.name)}</h3>
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {pack.types.map((typeId) => {
                                                const typeObj = projectTypeOptions.find(t => t.id === typeId);
                                                return typeObj ? (
                                                    <span key={typeId} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full font-medium">
                                                        {t(typeObj.name)}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                        <div className="mb-6">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{t('Starting from')}</span>
                                            <div className="text-4xl font-black text-gray-900 dark:text-white mt-1">
                                                {formatEUR(pack.startPrice)}
                                            </div>
                                        </div>
                                        <ul className="space-y-3 flex-1">
                                            {pack.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                                                    <svg className="w-5 h-5 text-teal-500 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                    {t(feature.text)}
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="mt-8">
                                            <SpinnerLink
                                                href="/contact#simulator"
                                                className={`block w-full text-center px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${btnBg}`}
                                            >
                                                {t('Get a quote')}
                                            </SpinnerLink>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Detailed price table */}
            <section id="section-table" className="bg-white dark:bg-gray-900 py-20 scroll-mt-20">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-3 reveal">{t('Price per project type')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-10">{t('Indicative starting prices for each type of project')}</p>
                    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm reveal">
                        <div className="overflow-x-auto">
                        <table className="w-full min-w-[420px]">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800">
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Project type')}</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('Starting from')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectTypeOptions.filter(opt => opt.id !== 'no_idea' && opt.basePrice > 0).map((type, idx) => (
                                    <tr key={type.id} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'}>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t(type.name)}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(type.description)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">{formatEUR(type.basePrice)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section id="section-cta" className="bg-gray-900 py-16 scroll-mt-20">
                <div className="max-w-3xl mx-auto px-4 text-center reveal">
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-4">
                        {t('These prices are indicative')}
                    </h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        {t('Every project is unique. Use our simulator for a personalized estimate, or contact us directly to discuss your needs.')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <SpinnerLink
                            href="/contact#simulator"
                            className="inline-flex items-center justify-center px-8 py-4 bg-teal-400 text-gray-900 font-bold rounded-full hover:bg-teal-300 hover:shadow-[0_0_20px_rgba(94,234,212,0.3)] transition-all duration-300 text-sm"
                        >
                            {t('Try the price simulator')}
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                        </SpinnerLink>
                        <SpinnerLink
                            href="/contact#contact"
                            className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-bold rounded-full hover:border-white/40 hover:bg-white/5 transition-all duration-300 text-sm"
                        >
                            {t('Contact us')}
                        </SpinnerLink>
                    </div>
                </div>
            </section>

            <SectionNav sections={[
                { id: 'section-pricing', label: 'Pricing' },
                { id: 'section-table', label: 'Price Table' },
                { id: 'section-cta', label: 'Get Started' },
            ]} />
        </PublicLayout>
    );
}
