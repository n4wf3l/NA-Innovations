import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SignaturePad from '@/Components/ui/SignaturePad';

function CopyButton({ text }: { text: string }) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/50 transition-colors"
        >
            {copied ? (
                <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {t('Copié !')}
                </>
            ) : (
                <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    {t('Copier')}
                </>
            )}
        </button>
    );
}

function StrategyCard({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-rose-500/20">
                        {number}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-1.5">{title}</h2>
                </div>
                {children}
            </div>
        </div>
    );
}

function TipBox({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50">
            <div className="flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">{children}</p>
            </div>
        </div>
    );
}

function ScriptBox({ label, text }: { label: string; text: string }) {
    return (
        <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
                </div>
                <CopyButton text={text} />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{text}</p>
        </div>
    );
}

function EmailTemplate({ title, body }: { title: string; body: string }) {
    return (
        <div className="mt-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</span>
                <CopyButton text={body} />
            </div>
            <div className="p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line font-mono">{body}</p>
            </div>
        </div>
    );
}

function StepList({ steps }: { steps: string[] }) {
    return (
        <ol className="space-y-3">
            {steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-0.5">{step}</span>
                </li>
            ))}
        </ol>
    );
}

interface ProspectingEmailTemplateItem {
    id: number;
    title: string;
    body: string;
}

interface Props {
    kbAccessStatus?: string;
    kbNdaSignedAt?: string;
    ndaMode?: 'text' | 'pdf';
    ndaText?: string;
    ndaPdfUrl?: string | null;
    emailTemplates?: ProspectingEmailTemplateItem[];
    coldCallScript?: string;
}

export default function Prospecting({ kbAccessStatus = 'none', kbNdaSignedAt, ndaMode = 'text', ndaText = '', ndaPdfUrl = null, emailTemplates = [], coldCallScript: coldCallScriptProp }: Props) {
    const { t } = useTranslation();
    const [prospectTab, setProspectTab] = useState('strategies');
    const [ndaFullName, setNdaFullName] = useState('');
    const [ndaSignature, setNdaSignature] = useState('');
    const [ndaSubmitting, setNdaSubmitting] = useState(false);
    const [ndaAgreed, setNdaAgreed] = useState(false);

    const submitNdaRequest = () => {
        if (!ndaFullName.trim() || !ndaSignature || !ndaAgreed) return;
        setNdaSubmitting(true);
        router.post('/partner/prospecting/request-access', {
            full_name: ndaFullName,
            signature_data: ndaSignature,
        }, {
            onFinish: () => setNdaSubmitting(false),
        });
    };

    // If access not approved, show NDA gate
    if (kbAccessStatus !== 'approved') {
        return (
            <PartnerLayout title={t('Prospecting')}>
                <Head title={t('Prospecting')} />
                <div className="max-w-2xl mx-auto py-16 px-4">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 mx-auto mb-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('Contenu restreint')}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                            {t('Cette section contient des informations confidentielles et stratégiques. Un accord de non-divulgation (NDA) est requis pour y accéder.')}
                        </p>
                    </div>

                    {kbAccessStatus === 'pending' ? (
                        /* Waiting for approval */
                        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-8 text-center">
                            <svg className="w-12 h-12 mx-auto mb-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-300 mb-2">{t('Demande en cours de traitement')}</h3>
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                {t('Vous avez signé l\'accord de confidentialité. L\'administrateur examinera votre demande dans les plus brefs délais.')}
                            </p>
                            {kbNdaSignedAt && (
                                <p className="text-xs text-amber-600 dark:text-amber-500 mt-4">
                                    {t('Signé le')} {new Date(kbNdaSignedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            )}
                        </div>
                    ) : kbAccessStatus === 'rejected' ? (
                        /* Rejected */
                        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-8 text-center">
                            <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">{t('Demande refusée')}</h3>
                            <p className="text-sm text-red-700 dark:text-red-400">
                                {t('Votre demande d\'accès a été refusée. Contactez l\'administrateur pour plus d\'informations.')}
                            </p>
                        </div>
                    ) : (
                        /* NDA Form */
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                            {/* NDA Document */}
                            {/* NDA Content - dynamic from admin settings */}
                            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                    </svg>
                                    {t('Accord de Non-Divulgation (NDA)')}
                                </h2>

                                {ndaMode === 'pdf' && ndaPdfUrl ? (
                                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <iframe src={ndaPdfUrl} className="w-full" style={{ height: '500px' }} title="NDA" />
                                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                            <span className="text-xs text-gray-500">{t('Lisez attentivement le document ci-dessus avant de signer')}</span>
                                        </div>
                                    </div>
                                ) : ndaText ? (
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: ndaText }} />
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">{t('Aucun contenu NDA configuré. Contactez l\'administrateur.')}</p>
                                )}
                            </div>

                            {/* Signature form */}
                            <div className="p-8 bg-gray-50 dark:bg-gray-800/50 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('Nom complet (tel que sur votre pièce d\'identité)')}</label>
                                    <input
                                        type="text"
                                        value={ndaFullName}
                                        onChange={e => setNdaFullName(e.target.value)}
                                        placeholder={t('Prénom et nom de famille')}
                                        className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('Votre signature')}</label>
                                    <SignaturePad
                                        value={ndaSignature || null}
                                        onChange={(data) => setNdaSignature(data || '')}
                                    />
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={ndaAgreed}
                                        onChange={e => setNdaAgreed(e.target.checked)}
                                        className="mt-1 rounded border-gray-300 dark:border-gray-600 text-rose-500 focus:ring-rose-500"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('Je déclare avoir lu et compris l\'intégralité de l\'accord de non-divulgation ci-dessus. Je m\'engage à respecter toutes les clauses mentionnées et j\'accepte les conséquences en cas de violation.')}
                                    </span>
                                </label>

                                <button
                                    onClick={submitNdaRequest}
                                    disabled={!ndaFullName.trim() || !ndaSignature || !ndaAgreed || ndaSubmitting}
                                    className="w-full py-3.5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-rose-500/20"
                                >
                                    {ndaSubmitting ? t('Envoi en cours...') : t('Signer et demander l\'accès')}
                                </button>

                                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                                    {t('Votre signature sera enregistrée avec votre adresse IP et la date exacte. Ce document a valeur juridique.')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </PartnerLayout>
        );
    }

    const coldCallScript = coldCallScriptProp || t(`Bonjour, je m'appelle [votre nom]. Je travaille avec NA Innovations, une agence web belge.

Je vous appelle car j'ai vu que votre [restaurant/club/entreprise] n'a pas encore de site web professionnel - et je pense qu'on peut vous aider à attirer plus de clients.

Nous avons une solution [site web / plateforme] spécialement conçue pour les [restaurants / clubs de football / entreprises comme la vôtre], déjà utilisée par plusieurs [restaurants / clubs] en Belgique.

Est-ce que je pourrais vous envoyer une courte présentation par e-mail ? Cela ne vous engage à rien.`);

    return (
        <PartnerLayout title={t('Prospecting')}>
            <Head title={t('Prospecting')} />

            <div className="space-y-5">

                {/* Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 p-6 sm:p-8">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-black text-white mb-1">{t('Comment trouver des clients')}</h1>
                            <p className="text-rose-100 text-sm max-w-xl">{t('Stratégies, templates et outils pour trouver des prospects qualifiés')}</p>
                        </div>
                        <Link href="/partner/leads/submit" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white text-rose-600 font-bold rounded-xl hover:bg-rose-50 transition-colors shadow-lg text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            {t('Soumettre un client')}
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                    {[
                        { id: 'strategies', label: t('Stratégies'), icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
                        { id: 'templates', label: t('Templates'), icon: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75' },
                        { id: 'scripts', label: t('Scripts d\'appel'), icon: 'M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setProspectTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                prospectTab === tab.id
                                    ? 'bg-white dark:bg-gray-700 text-rose-600 dark:text-rose-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} /></svg>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div key={prospectTab} className="animate-tab-in">

                {/* === STRATEGIES TAB === */}
                {prospectTab === 'strategies' && (<>
                {/* Strategy 1: Google Search */}
                <StrategyCard number={1} title={t('Recherche Google - Restaurants sans site web')}>
                    <StepList steps={[
                        t('Allez sur Google Maps et recherchez "restaurant" dans votre zone (Bruxelles, Anvers, Liège, etc.)'),
                        t('Triez par note - concentrez-vous sur les restaurants avec 4+ étoiles'),
                        t('Vérifiez s\'ils ont un site web - s\'ils n\'ont qu\'une page Google Business ou Facebook, c\'est un client potentiel'),
                        t('Trouvez leur numéro de téléphone ou e-mail depuis leur fiche Google'),
                        t('Contactez-les : expliquez qu\'un site web professionnel peut augmenter leurs commandes en ligne et réservations'),
                    ]} />
                    <TipBox>
                        {t('Les restaurants avec de bons avis mais sans site web perdent des clients chaque jour. Ils ont déjà la qualité - il leur manque juste la présence en ligne.')}
                    </TipBox>
                    <ScriptBox
                        label={t('Que dire')}
                        text={t('Bonjour, j\'ai vu votre restaurant sur Google et vos avis sont excellents. J\'ai remarqué que vous n\'avez pas encore de site web pour la commande en ligne. Nous avons une plateforme qui permet à vos clients de commander directement chez vous, sans passer par Uber Eats. Puis-je vous envoyer plus d\'informations ?')}
                    />
                </StrategyCard>

                {/* Strategy 2: TikTok */}
                <StrategyCard number={2} title={t('TikTok - Nouvelles entreprises')}>
                    <StepList steps={[
                        t('Ouvrez TikTok et recherchez "nouveau restaurant" ou "new restaurant [ville]"'),
                        t('Utilisez les filtres : triez par "Plus récent" pour trouver les entreprises qui viennent d\'ouvrir'),
                        t('Vérifiez leur bio/liens - s\'il n\'y a pas de site web, ils en ont besoin'),
                        t('Contactez-les via : DM TikTok, numéro de téléphone dans la bio, ou e-mail'),
                        t('Fonctionne aussi pour : "nouveau salon de coiffure", "nouvelle boutique", "nouveau café", etc.'),
                    ]} />
                    <TipBox>
                        {t('Les nouvelles entreprises sont les MEILLEURS prospects - elles ont du budget, elles ont besoin de visibilité, et elles n\'ont pas encore engagé une agence web.')}
                    </TipBox>
                </StrategyCard>

                {/* Strategy 3: Football & Futsal Clubs */}
                <StrategyCard number={3} title={t('Clubs de football et futsal - Plateforme SaaS')}>
                    <div className="mb-5 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700/50">
                        <p className="text-sm text-rose-800 dark:text-rose-200 leading-relaxed">
                            {t('Nous avons déjà une plateforme SaaS prête pour les clubs de football/futsal. Ce n\'est PAS un projet sur mesure - c\'est un produit que nous pouvons déployer immédiatement.')}
                        </p>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('Ce que la plateforme offre :')}</h3>
                    <ul className="space-y-2 mb-5">
                        {[
                            t('Inscription en ligne pour les nouveaux membres'),
                            t('Planification des tests de sélection'),
                            t('Certificats médicaux (certificat de guérison)'),
                            t('Déclarations d\'accident'),
                            t('Décharges de responsabilité'),
                            t('Gestion des équipes, calendrier des matchs'),
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('Comment les trouver :')}</h3>
                    <StepList steps={[
                        t('Recherchez "club football [ville]" ou "académie football belgique"'),
                        t('Consultez le site de l\'ACFF/KBVB (fédération belge de football) pour les listes de clubs'),
                        t('Vérifiez si le club a un site web moderne avec inscription en ligne'),
                        t('S\'ils utilisent encore des formulaires papier ou l\'e-mail pour les inscriptions, ils ont besoin de notre plateforme'),
                    ]} />
                    <ScriptBox
                        label={t('Que dire')}
                        text={t('Nous avons une plateforme spécialement conçue pour les clubs de football qui gère les inscriptions, les documents médicaux et la gestion des équipes. Plusieurs clubs l\'utilisent déjà.')}
                    />
                </StrategyCard>

                {/* Strategy 4: Restaurant SaaS */}
                <StrategyCard number={4} title={t('Plateforme SaaS pour restaurants')}>
                    <div className="mb-5 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700/50">
                        <p className="text-sm text-rose-800 dark:text-rose-200 leading-relaxed">
                            {t('Nous avons aussi un SaaS prêt pour les restaurants - commande en ligne, gestion du menu, réservations.')}
                        </p>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('Comment trouver des cibles :')}</h3>
                    <StepList steps={[
                        t('Google Maps : restaurants sans site web ou avec un mauvais site web'),
                        t('Uber Eats / Deliveroo : restaurants qui paient des frais de commission élevés (30%) - notre plateforme les aide à prendre des commandes directement'),
                        t('Comptes Instagram food : nouveaux restaurants qui font leur promotion sur les réseaux sociaux sans système de commande en ligne'),
                    ]} />
                    <ScriptBox
                        label={t('Que dire')}
                        text={t('Nous avons une plateforme qui permet à vos clients de commander directement depuis votre propre site web - plus besoin de payer 30% de commission à Uber Eats.')}
                    />
                </StrategyCard>
                </>)}

                {/* === TEMPLATES TAB === */}
                {prospectTab === 'templates' && (<>
                {/* Strategy 5: Email Templates */}
                <StrategyCard number={5} title={t('Modèles d\'e-mails prêts à l\'emploi')}>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {t('Copiez-collez ces modèles pour contacter vos prospects. Personnalisez le nom et les détails avant d\'envoyer.')}
                    </p>

                    {emailTemplates.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            {t("Aucun modèle d'e-mail disponible pour le moment.")}
                        </p>
                    )}
                    {emailTemplates.map((tpl) => (
                        <EmailTemplate
                            key={tpl.id}
                            title={tpl.title}
                            body={tpl.body}
                        />
                    ))}
                </StrategyCard>
                </>)}

                {/* === SCRIPTS TAB === */}
                {prospectTab === 'scripts' && (<>
                {/* Strategy 6: Cold Call Script */}
                <StrategyCard number={6} title={t('Script d\'appel téléphonique')}>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {t('Un script étape par étape pour vos appels de prospection :')}
                    </p>

                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold">1</span>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('Introduction (10 secondes)')}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('Qui vous êtes et pourquoi vous appelez')}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold">2</span>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('L\'accroche (observation)')}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('Une observation spécifique sur leur entreprise')}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold">3</span>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('La proposition de valeur (20 secondes)')}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('Ce que nous pouvons faire pour eux, concrètement')}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs font-bold">4</span>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{t('La demande')}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('Puis-je vous envoyer une proposition ?')}</p>
                            </div>
                        </div>
                    </div>

                    <ScriptBox
                        label={t('Script complet')}
                        text={coldCallScript}
                    />

                    <TipBox>
                        {t('Gardez l\'appel en dessous de 60 secondes. Ne vendez pas - obtenez juste la permission d\'envoyer plus d\'informations.')}
                    </TipBox>
                </StrategyCard>
                </>)}

                </div>{/* end animate-tab-in wrapper */}

                {/* Bottom CTA - always visible */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('Vous avez trouvé un client potentiel ?')}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        {t('Soumettez-le ici et nous nous occupons du reste.')}
                    </p>
                    <Link
                        href="/partner/leads/submit"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        {t('Soumettre un client')}
                    </Link>
                </div>
            </div>
        </PartnerLayout>
    );
}
