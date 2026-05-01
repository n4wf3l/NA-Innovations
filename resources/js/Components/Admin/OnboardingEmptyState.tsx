import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Step {
    n: number;
    titleKey: string;
    descKey: string;
    href: string;
    cta: string;
    icon: JSX.Element;
    color: string;
}

interface Props {
    /** Admin's first name to personalise the greeting. */
    name: string;
}

export default function OnboardingEmptyState({ name }: Props) {
    const { t } = useTranslation();

    const steps: Step[] = [
        {
            n: 1,
            titleKey: 'Personnaliser ton branding',
            descKey: 'Logo, couleurs, nom de société — appliqué automatiquement sur le site, les emails et tes PDF.',
            href: '/admin/settings/branding',
            cta: 'Configurer le branding',
            color: 'from-violet-500 to-purple-600',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
            ),
        },
        {
            n: 2,
            titleKey: 'Ajouter ton premier client',
            descKey: 'Crée la fiche client (nom, email, société). Tu pourras lui rattacher des projets, devis et factures.',
            href: '/admin/clients/create',
            cta: 'Créer un client',
            color: 'from-blue-500 to-cyan-600',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
            ),
        },
        {
            n: 3,
            titleKey: 'Lancer ton premier projet',
            descKey: 'Crée le projet, lie-le au client, configure le budget et le développeur en charge.',
            href: '/admin/projects/create',
            cta: 'Créer un projet',
            color: 'from-teal-500 to-emerald-600',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
            ),
        },
        {
            n: 4,
            titleKey: 'Inviter ton équipe',
            descKey: 'Ajoute des développeurs et partenaires affiliés. Ils recevront un email avec un lien pour définir leur mot de passe.',
            href: '/admin/team',
            cta: 'Gérer l\'équipe',
            color: 'from-rose-500 to-pink-600',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
            ),
        },
    ];

    const firstName = (name || '').split(' ')[0] || '';

    return (
        <div className="mb-8">
            {/* Hero greeting */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-600 p-8 sm:p-10 mb-6 shadow-xl shadow-teal-500/20">
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                <div className="absolute bottom-0 left-20 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 blur-xl" />
                <div className="relative">
                    <p className="text-teal-100 text-xs font-bold tracking-wider uppercase mb-2 bebas" style={{ letterSpacing: '3px' }}>{t('Bienvenue')}</p>
                    <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight">
                        {firstName ? `${t('Hey')} ${firstName} 👋` : t('Hey 👋')}
                    </h1>
                    <p className="text-teal-50 text-base sm:text-lg max-w-2xl leading-relaxed">
                        {t('Ton espace est tout neuf. Suis ces 4 étapes rapides pour configurer ta plateforme et commencer à gérer tes premiers projets.')}
                    </p>
                </div>
            </div>

            {/* 4 steps grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {steps.map(step => (
                    <Link
                        key={step.n}
                        href={step.href}
                        className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:border-transparent hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                        <div className="relative">
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg flex-shrink-0`}>
                                    {step.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{t('Étape')} {step.n}</p>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t(step.titleKey)}</h3>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{t(step.descKey)}</p>
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 dark:text-teal-400 group-hover:gap-3 transition-all">
                                {t(step.cta)}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer hint */}
            <div className="mt-6 flex items-center gap-3 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('Cet écran disparaîtra automatiquement dès que tu auras créé ton premier client ou projet.')}
                </p>
            </div>
        </div>
    );
}
