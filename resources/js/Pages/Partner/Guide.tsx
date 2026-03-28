import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/utils';

interface ProjectTypeRate {
    value: string;
    label: string;
    commission_rate: number;
}

interface Props {
    referralCode: string;
    commissionRate: number;
    projectTypes: ProjectTypeRate[];
}

function getRateBarColor(rate: number): { bg: string; text: string } {
    if (rate >= 15) return { bg: 'bg-green-500', text: 'text-green-700 dark:text-green-400' };
    if (rate >= 10) return { bg: 'bg-teal-500', text: 'text-teal-700 dark:text-teal-400' };
    if (rate >= 8) return { bg: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' };
    return { bg: 'bg-red-500', text: 'text-red-700 dark:text-red-400' };
}

export default function Guide({ referralCode, commissionRate, projectTypes }: Props) {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const commissionExample = 5000 * commissionRate / 100;

    const steps = [
        {
            number: 1,
            color: 'rose',
            borderColor: 'border-rose-500',
            bgColor: 'bg-rose-100 dark:bg-rose-900/30',
            textColor: 'text-rose-600 dark:text-rose-400',
            numBg: 'bg-rose-500',
            title: t('Vous trouvez un client'),
            description: t('Vous identifiez une personne ou une entreprise qui a besoin d\'un site web, d\'une application ou d\'un service digital. Pas besoin d\'être expert : il suffit de connaître quelqu\'un qui a un projet.'),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            ),
        },
        {
            number: 2,
            color: 'amber',
            borderColor: 'border-amber-500',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
            textColor: 'text-amber-600 dark:text-amber-400',
            numBg: 'bg-amber-500',
            title: t('Vous le soumettez sur la plateforme'),
            description: t('Remplissez le formulaire de soumission avec les informations du client. C\'est rapide, simple et confidentiel.'),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
            ),
            cta: true,
        },
        {
            number: 3,
            color: 'violet',
            borderColor: 'border-violet-500',
            bgColor: 'bg-violet-100 dark:bg-violet-900/30',
            textColor: 'text-violet-600 dark:text-violet-400',
            numBg: 'bg-violet-500',
            title: t('Nous protégeons le projet'),
            description: t('Un accord de confidentialité (NDA) est automatiquement mis en place pour protéger toutes les parties. Vous êtes couvert dès la soumission.'),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
            ),
        },
        {
            number: 4,
            color: 'green',
            borderColor: 'border-green-500',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            textColor: 'text-green-600 dark:text-green-400',
            numBg: 'bg-green-500',
            title: t('Le client accepte le devis'),
            description: t('Notre équipe contacte le client, analyse ses besoins et lui envoie un devis. Quand le client accepte, le projet démarre automatiquement.'),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            number: 5,
            color: 'blue',
            borderColor: 'border-blue-500',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            textColor: 'text-blue-600 dark:text-blue-400',
            numBg: 'bg-blue-500',
            title: t('Le projet se réalise'),
            description: t('Nous développons le projet. Vous pouvez suivre l\'avancement en temps réel depuis votre tableau de bord partenaire.'),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
            ),
        },
        {
            number: 6,
            color: 'emerald',
            borderColor: 'border-emerald-500',
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
            textColor: 'text-emerald-600 dark:text-emerald-400',
            numBg: 'bg-emerald-500',
            title: t('Vous êtes payé'),
            description: t('Votre commission est calculée automatiquement. Pour un projet de 5 000 € HT, vous recevez {{amount}} € ({{rate}}% de commission).', { amount: commissionExample.toLocaleString('fr-FR'), rate: commissionRate }),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    const platformFeatures = [
        {
            title: t('Soumettre un client'),
            description: t('Envoyez un nouveau lead en quelques clics via le formulaire de soumission.'),
            color: 'rose',
            bgColor: 'bg-rose-100 dark:bg-rose-900/30',
            textColor: 'text-rose-600 dark:text-rose-400',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
            ),
        },
        {
            title: t('Suivre mes leads'),
            description: t('Consultez le statut de chaque lead en temps réel : nouveau, contacté, devis envoyé, gagné.'),
            color: 'amber',
            bgColor: 'bg-amber-100 dark:bg-amber-900/30',
            textColor: 'text-amber-600 dark:text-amber-400',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
        {
            title: t('Voir mes commissions'),
            description: t('Suivez vos gains : commissions confirmées, en attente et payées.'),
            color: 'emerald',
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
            textColor: 'text-emerald-600 dark:text-emerald-400',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: t('Mon code partenaire'),
            description: referralCode
                ? t('Votre code unique :')
                : t('Aucun code partenaire attribué pour le moment.'),
            color: 'violet',
            bgColor: 'bg-violet-100 dark:bg-violet-900/30',
            textColor: 'text-violet-600 dark:text-violet-400',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
            ),
            referralCode: referralCode,
        },
    ];

    const faqItems = [
        {
            question: t('Quand est-ce que je suis payé ?'),
            answer: t('Vous êtes payé une fois que le client a réglé sa facture. Dès que le paiement est confirmé, votre commission est calculée et ajoutée à votre solde. Les paiements sont effectués mensuellement.'),
        },
        {
            question: t('Que se passe-t-il si le client refuse le devis ?'),
            answer: t('Si le client refuse le devis, aucune commission n\'est due. Vous pouvez toujours soumettre ce client à nouveau si ses besoins évoluent.'),
        },
        {
            question: t('Est-ce que je peux soumettre un client que j\'ai déjà soumis ?'),
            answer: t('Oui, si le client a un nouveau projet ou si sa situation a changé. Chaque soumission est traitée indépendamment.'),
        },
        {
            question: t('C\'est quoi un NDA ?'),
            answer: t('Un NDA (Non-Disclosure Agreement) est un accord de confidentialité. Il protège les informations échangées entre toutes les parties : vous, le client et NA Innovations.'),
        },
        {
            question: t('Est-ce que le client sait que je l\'ai recommandé ?'),
            answer: t('Par défaut, nous ne divulguons pas votre identité au client. Vous pouvez cependant choisir d\'être mentionné si vous le souhaitez.'),
        },
        {
            question: t('Ma commission est calculée sur quoi exactement ?'),
            answer: t('Votre commission est calculée sur le montant hors taxes (HT) du projet. La TVA n\'est pas incluse dans le calcul. Par exemple, pour une facture de 6 050 € TTC (TVA 21%), la base de calcul est 5 000 € HT.'),
        },
    ];

    return (
        <PartnerLayout title={t('Guide')}>
            <Head title={t('Guide partenaire')} />

            <div className="max-w-4xl mx-auto space-y-10">

                {/* BANNER */}
                <div className="animate-fade-in bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl p-8 sm:p-10 text-white shadow-lg">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                        {t('Comment ça marche ?')}
                    </h1>
                    <p className="text-rose-100 text-lg leading-relaxed max-w-2xl">
                        {t('Ce guide vous explique étape par étape comment fonctionne le programme partenaire. De la recommandation d\'un client jusqu\'au versement de votre commission.')}
                    </p>
                </div>

                {/* SECTION 1: Le parcours en 6 étapes */}
                <section className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                        {t('Le parcours de votre client en 6 étapes')}
                    </h2>

                    <div className="relative">
                        {/* Vertical connecting line */}
                        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700 hidden sm:block" />

                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <div key={index} className="relative flex items-start gap-4 sm:gap-6">
                                    {/* Number circle */}
                                    <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${step.numBg} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                        {step.number}
                                    </div>

                                    {/* Card */}
                                    <div className={`flex-1 bg-white dark:bg-gray-800 rounded-2xl border-l-4 ${step.borderColor} border border-gray-100 dark:border-gray-700 shadow-sm p-5 sm:p-6`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${step.bgColor} ${step.textColor} flex items-center justify-center`}>
                                                {step.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                    {step.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                    {step.description}
                                                </p>
                                                {step.cta && (
                                                    <Link
                                                        href="/partner/leads/submit"
                                                        className="inline-flex items-center mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                        </svg>
                                                        {t('Soumettre un client')}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 2: Commission en détail */}
                <section className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {t('Votre commission en détail')}
                    </h2>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            {t('Voici comment votre commission est calculée sur un exemple concret :')}
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 font-mono text-sm sm:text-base space-y-3">
                            <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                                <span>{t('Montant facturé')}</span>
                                <span className="font-semibold">6 050 €</span>
                                <span className="text-xs text-gray-500 dark:text-gray-500">{t('(TTC)')}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-500 dark:text-gray-500">
                                <span>÷</span>
                                <span>1,21</span>
                                <span className="text-xs">{t('(TVA 21%)')}</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex items-center justify-between text-gray-700 dark:text-gray-300">
                                <span>=</span>
                                <span className="font-semibold">5 000 €</span>
                                <span className="text-xs text-gray-500 dark:text-gray-500">{t('(HT)')}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-500 dark:text-gray-500">
                                <span>×</span>
                                <span>{commissionRate}%</span>
                                <span className="text-xs">{t('(votre taux)')}</span>
                            </div>
                            <div className="border-t-2 border-emerald-300 dark:border-emerald-600 pt-3 flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold text-lg">
                                <span>=</span>
                                <span>{commissionExample.toLocaleString('fr-FR')} €</span>
                                <span className="text-xs font-normal">← {t('votre commission')}</span>
                            </div>
                        </div>

                        <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-start gap-3">
                            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-emerald-800 dark:text-emerald-300">
                                {t('Ce calcul se fait automatiquement. Vous n\'avez rien à calculer vous-même.')}
                            </p>
                        </div>

                        {/* Commission rates by project type */}
                        {projectTypes && projectTypes.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t('Taux de commission par type de projet')}
                                </h3>
                                <div className="space-y-3">
                                    {projectTypes.map((pt) => {
                                        const color = getRateBarColor(pt.commission_rate);
                                        const barWidth = Math.min((pt.commission_rate / 20) * 100, 100);
                                        return (
                                            <div key={pt.value} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                <div className="sm:w-56 flex-shrink-0">
                                                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                        {t(pt.label)}
                                                    </span>
                                                </div>
                                                <div className="flex-1 flex items-center gap-3">
                                                    <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${color.bg} rounded-full transition-all duration-300`}
                                                            style={{ width: `${barWidth}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-sm font-semibold ${color.text} w-12 text-right`}>
                                                        {pt.commission_rate}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* SECTION 3: Ce que vous pouvez faire */}
                <section className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {t('Ce que vous pouvez faire sur la plateforme')}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {platformFeatures.map((feature, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 sm:p-6">
                                <div className={`w-10 h-10 rounded-xl ${feature.bgColor} ${feature.textColor} flex items-center justify-center mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                                {feature.referralCode && (
                                    <div className="mt-3 inline-flex items-center px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-lg font-mono text-sm font-semibold">
                                        {feature.referralCode}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 4: FAQ */}
                <section className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        {t('Questions fréquentes')}
                    </h2>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden">
                        {faqItems.map((item, index) => (
                            <div key={index}>
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white pr-4">
                                        {item.question}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-200 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 5: Besoin d'aide ? */}
                <section className="animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 sm:p-8 text-center">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {t('Besoin d\'aide ?')}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {t('Notre équipe est disponible pour répondre à toutes vos questions.')}
                        </p>
                        <a
                            href="mailto:info@nawfelajari.be"
                            className="inline-flex items-center px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                            info@nawfelajari.be
                        </a>
                    </div>
                </section>

            </div>
        </PartnerLayout>
    );
}
