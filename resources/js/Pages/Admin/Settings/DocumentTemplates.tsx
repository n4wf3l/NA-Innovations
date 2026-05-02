import AdminLayout from '@/Layouts/AdminLayout';
import AdminManagementTabs from '@/Components/Admin/AdminManagementTabs';
import { Head, router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import RichTextEditor from '@/Components/ui/RichTextEditor';

interface DocumentTemplate {
    id: number;
    name: string;
    slug: string;
    category: string;
    body: string;
    available_variables: string[];
    requires_signature: boolean;
    is_active: boolean;
    sort_order: number;
}

interface Props {
    templates: DocumentTemplate[];
}

const categoryColors: Record<string, string> = {
    legal: 'from-rose-500 to-pink-600',
    project: 'from-teal-500 to-emerald-600',
    delivery: 'from-blue-500 to-indigo-600',
};

const categoryIcons: Record<string, string> = {
    legal: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    project: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    delivery: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

type InfoLang = { purpose: string; audience: string; consequences: string; avoided: string };
type InfoEntry = { fr: InfoLang; nl: InfoLang; en: InfoLang };

const templateInfo: Record<string, InfoEntry> = {
    'nda': {
        fr: {
            purpose: 'Modèle signé par chaque client payant avant qu\'on ne partage specs, accès back-office, maquettes ou données business.',
            audience: 'Nous (NA Innovations) et le client dont on développe la plateforme - dès la phase devis.',
            consequences: 'Sans NDA signé côté client, aucun recours si le client diffuse nos specs techniques à un concurrent, ou si on est accusé de fuite de ses données.',
            avoided: 'Fuites de données client, réutilisation de notre savoir-faire par des tiers, litiges sur la propriété des idées.',
        },
        nl: {
            purpose: 'Sjabloon dat elke betalende klant ondertekent vóór we specs, back-office toegang, mockups of businessdata delen.',
            audience: 'Wij (NA Innovations) en de klant voor wie we het platform bouwen - al vanaf de offertefase.',
            consequences: 'Zonder ondertekende NDA geen verhaal als de klant onze technische specs aan een concurrent doorspeelt, of als wij beschuldigd worden van een datalek.',
            avoided: 'Lekken van klantdata, hergebruik van onze knowhow door derden, geschillen over eigenaarschap.',
        },
        en: {
            purpose: 'Template signed by every paying client before we share specs, back-office access, mockups or business data.',
            audience: 'Us (NA Innovations) and the client whose platform we build - starting from the quote stage.',
            consequences: 'Without a signed NDA on the client side, no recourse if the client passes our specs to a competitor or accuses us of leaking their data.',
            avoided: 'Client data leaks, third-party reuse of our know-how, disputes over idea ownership.',
        },
    },
    'service-contract': {
        fr: {
            purpose: 'Contrat de prestation qu\'on fait signer au client pour cadrer chaque mission facturée : périmètre, prix, délais, responsabilités.',
            audience: 'Nous et le client payant - à signer avant tout démarrage de développement.',
            consequences: 'Sans ce contrat, impayés non recouvrables, scope creep non refacturable, et le client peut contester ce qui était inclus.',
            avoided: 'Missions qui dérapent sans budget supplémentaire, factures contestées, procédures au tribunal de commerce.',
        },
        nl: {
            purpose: 'Dienstenovereenkomst die we de klant laten tekenen om elke gefactureerde opdracht te kaderen: scope, prijs, deadlines, verantwoordelijkheden.',
            audience: 'Wij en de betalende klant - te ondertekenen vóór elke ontwikkelingsstart.',
            consequences: 'Zonder dit contract onbetaalde facturen niet inbaar, scope creep niet door te factureren, en kan de klant betwisten wat inbegrepen was.',
            avoided: 'Opdrachten die ontsporen zonder extra budget, betwiste facturen, handelsrechtbankprocedures.',
        },
        en: {
            purpose: 'Service agreement we have the client sign to frame each billed engagement: scope, price, deadlines, responsibilities.',
            audience: 'Us and the paying client - to sign before any development kickoff.',
            consequences: 'Without this contract, unpaid invoices can\'t be recovered, scope creep can\'t be rebilled, and the client can contest what was included.',
            avoided: 'Runaway engagements with no extra budget, contested invoices, commercial court proceedings.',
        },
    },
    'delivery-report': {
        fr: {
            purpose: 'Procès-verbal de livraison qui formalise que le client a bien reçu et accepté la plateforme livrée.',
            audience: 'Nous (preuve pour facturer le solde) et le client (acceptation explicite du livrable).',
            consequences: 'Sans ce PV signé, impossible de débloquer la facture de solde, et le client peut demander indéfiniment des modifs en prétendant que ce n\'était pas « terminé ».',
            avoided: 'Support gratuit infini, blocage du paiement final, corrections demandées des mois après mise en prod.',
        },
        nl: {
            purpose: 'Opleveringsproces-verbaal dat formaliseert dat de klant het opgeleverde platform ontvangen en aanvaard heeft.',
            audience: 'Wij (bewijs om het saldo te factureren) en de klant (expliciete aanvaarding van de oplevering).',
            consequences: 'Zonder dit ondertekende PV kunnen we de eindfactuur niet deblokkeren en kan de klant eindeloos wijzigingen vragen door te beweren dat het niet "af" was.',
            avoided: 'Gratis eindeloze support, geblokkeerde eindbetaling, correctieverzoeken maanden na de productiezetting.',
        },
        en: {
            purpose: 'Delivery sign-off that formalises the client has received and accepted the delivered platform.',
            audience: 'Us (evidence to bill the balance) and the client (explicit acceptance of the deliverable).',
            consequences: 'Without this signed report, we can\'t unblock the final invoice and the client can endlessly request changes, claiming it wasn\'t "finished".',
            avoided: 'Endless free support, blocked final payment, correction requests months after go-live.',
        },
    },
    'technical-spec': {
        fr: {
            purpose: 'Cahier des charges détaillé qui fige noir sur blanc ce qu\'on livrera au client : fonctionnalités, stack, intégrations, limites.',
            audience: 'Notre équipe dev, le client qui valide le périmètre, et le chef de projet - référence commune pour toute la mission.',
            consequences: 'Sans specs validées, le client dira « je pensais que c\'était inclus », on redéveloppera des features à nos frais et on explosera le budget.',
            avoided: 'Refontes gratuites, mésentente sur le périmètre, dépassement de budget, conflits en fin de projet.',
        },
        nl: {
            purpose: 'Gedetailleerd lastenboek dat zwart op wit vastlegt wat we aan de klant leveren: functies, stack, integraties, beperkingen.',
            audience: 'Ons devteam, de klant die de scope valideert, en de projectleider - gemeenschappelijke referentie voor de hele opdracht.',
            consequences: 'Zonder gevalideerde specs zal de klant zeggen "ik dacht dat dat inbegrepen was", herontwikkelen we functies op onze kosten en ontploft het budget.',
            avoided: 'Gratis herzieningen, scope-onenigheid, budgetoverschrijding, conflicten op het einde van het project.',
        },
        en: {
            purpose: 'Detailed specification that locks down in writing what we\'ll deliver to the client: features, stack, integrations, limits.',
            audience: 'Our dev team, the client validating the scope, and the project manager - shared reference for the whole engagement.',
            consequences: 'Without validated specs, the client will say "I thought that was included", we\'ll rebuild features at our expense and blow the budget.',
            avoided: 'Free rebuilds, scope disagreements, budget overruns, end-of-project conflicts.',
        },
    },
    'cgv': {
        fr: {
            purpose: 'Conditions Générales de Vente qui s\'appliquent automatiquement à toutes nos ventes : paiement, garanties, responsabilité, rétractation.',
            audience: 'Nous (obligation légale en B2B et B2C) et nos clients (cadre leurs droits et les nôtres par défaut).',
            consequences: 'Sans CGV à jour, non-conformité légale, les clients sont protégés par défaut à notre désavantage, et on s\'expose à des amendes SPF Économie.',
            avoided: 'Annulations abusives, litiges de paiement, sanctions administratives, procès où le client a toutes les présomptions pour lui.',
        },
        nl: {
            purpose: 'Algemene Verkoopsvoorwaarden die automatisch gelden voor al onze verkopen: betaling, garanties, aansprakelijkheid, herroeping.',
            audience: 'Wij (wettelijke verplichting in B2B en B2C) en onze klanten (kadert standaard hun en onze rechten).',
            consequences: 'Zonder actuele AV zijn we wettelijk niet in orde, zijn klanten standaard beschermd in ons nadeel, en riskeren we boetes van de FOD Economie.',
            avoided: 'Onrechtmatige annuleringen, betalingsgeschillen, administratieve sancties, rechtszaken waarin de klant alle vermoedens vóór zich heeft.',
        },
        en: {
            purpose: 'General Terms of Sale that automatically apply to all our sales: payment, warranties, liability, withdrawal rights.',
            audience: 'Us (legal obligation in B2B and B2C) and our clients (frames their rights and ours by default).',
            consequences: 'Without up-to-date T&Cs, we\'re legally non-compliant, clients are protected by default at our expense, and we face consumer authority fines.',
            avoided: 'Wrongful cancellations, payment disputes, administrative sanctions, lawsuits where the client has every presumption on their side.',
        },
    },
};

export default function DocumentTemplates({ templates }: Props) {
    const { t, i18n } = useTranslation();
    const [editing, setEditing] = useState<DocumentTemplate | null>(null);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', body: '', requires_signature: false });
    const [previewMode, setPreviewMode] = useState(false);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [loadingIframes, setLoadingIframes] = useState<Record<number, boolean>>({});
    const [infoTemplate, setInfoTemplate] = useState<DocumentTemplate | null>(null);
    const iframeRefs = useRef<Record<number, HTMLIFrameElement | null>>({});
    const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

    const currentLang: 'fr' | 'nl' | 'en' = ((i18n.language || 'en').slice(0, 2) as 'fr' | 'nl' | 'en');
    const infoLang: 'fr' | 'nl' | 'en' = ['fr', 'nl', 'en'].includes(currentLang) ? currentLang : 'en';

    const toggleExpand = (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
            return;
        }
        setLoadingIframes(prev => ({ ...prev, [id]: true }));
        setExpandedId(id);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const el = cardRefs.current[id];
                if (!el) return;
                el.scrollIntoView({ block: 'end', behavior: 'smooth' });
            });
        });
    };

    const categoryLabels: Record<string, string> = {
        legal: t('Juridique'),
        project: t('Projet'),
        delivery: t('Livraison'),
    };

    const openEditor = (tpl: DocumentTemplate) => {
        setEditing(tpl);
        setEditForm({ name: tpl.name, body: tpl.body, requires_signature: tpl.requires_signature });
        setPreviewMode(false);
    };

    const closeEditor = () => { setEditing(null); };

    const refreshIframe = (id: number) => {
        const iframe = iframeRefs.current[id];
        if (iframe) {
            const src = iframe.src;
            setLoadingIframes(prev => ({ ...prev, [id]: true }));
            iframe.src = '';
            setTimeout(() => { iframe.src = src; }, 50);
        }
    };

    const handleSave = () => {
        if (!editing) return;
        setSaving(true);
        const editingId = editing.id;
        router.put(`/admin/settings/document-templates/${editing.id}`, editForm, {
            onFinish: () => setSaving(false),
            onSuccess: () => {
                closeEditor();
                setTimeout(() => refreshIframe(editingId), 300);
            },
            preserveScroll: true,
        });
    };

    const handleToggle = (tpl: DocumentTemplate) => {
        router.patch(`/admin/settings/document-templates/${tpl.id}/toggle`, {}, { preserveScroll: true });
    };

    const grouped = templates.reduce<Record<string, DocumentTemplate[]>>((acc, tpl) => {
        const cat = tpl.category || 'project';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(tpl);
        return acc;
    }, {});

    const categoryOrder = ['legal', 'project', 'delivery'];
    const sortedCategories = Object.entries(grouped).sort(
        ([a], [b]) => (categoryOrder.indexOf(a) === -1 ? 99 : categoryOrder.indexOf(a)) - (categoryOrder.indexOf(b) === -1 ? 99 : categoryOrder.indexOf(b))
    );

    return (
        <AdminLayout title={t('Settings')} header={t('Settings')}>
            <Head title={t('Modèles de documents')} />

            <AdminManagementTabs active="document-templates" />

            {/* Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
                <div className="relative">
                    <p className="text-teal-200 text-xs font-medium tracking-wider uppercase mb-1">{t('Système')} / {t('Settings')}</p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Modèles de documents')}</h1>
                    <p className="text-teal-200 text-sm">{t('Gérez les modèles utilisés pour générer les documents projet (contrats, NDA, PV, etc.).')}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-end mb-6">
                <p className="text-sm text-gray-400 dark:text-gray-500">{templates.length} {t('modèles')}</p>
            </div>

            {/* Template cards by category */}
            <div className="space-y-10">
                {sortedCategories.map(([category, tpls]) => (
                    <div key={category}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryColors[category] || categoryColors.project} flex items-center justify-center flex-shrink-0`}>
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[category] || categoryIcons.project} />
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{categoryLabels[category] || category}</h2>
                            <span className="text-xs text-gray-400 dark:text-gray-500">({tpls.length})</span>
                        </div>

                        <div className="space-y-3">
                            {tpls.map(tpl => {
                                const isOpen = expandedId === tpl.id;
                                return (
                                <div
                                    key={tpl.id}
                                    ref={el => { cardRefs.current[tpl.id] = el; }}
                                    className={`bg-white dark:bg-gray-800 rounded-2xl border shadow-sm overflow-hidden transition-all ${
                                        isOpen ? 'shadow-md' : 'hover:shadow-md'
                                    } ${tpl.is_active ? 'border-gray-100 dark:border-gray-700' : 'border-gray-100 dark:border-gray-700 opacity-60'}`}
                                >
                                    {/* Color bar */}
                                    <div className={`h-1.5 bg-gradient-to-r ${categoryColors[category] || categoryColors.project}`} />

                                    {/* Header row: clickable to expand */}
                                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                                        <button
                                            type="button"
                                            onClick={() => toggleExpand(tpl.id)}
                                            className="flex items-center gap-3 min-w-0 flex-1 text-left group"
                                            aria-expanded={isOpen}
                                        >
                                            <svg
                                                className={`w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{tpl.name}</h3>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{tpl.slug}</span>
                                                </div>
                                                {/* Badges */}
                                                <div className="flex flex-wrap gap-1.5">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                        category === 'legal' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                                        category === 'delivery' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                                                        'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                                    }`}>
                                                        {categoryLabels[category] || category}
                                                    </span>
                                                    {tpl.requires_signature && (
                                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                                            </svg>
                                                            {t('Signature requise')}
                                                        </span>
                                                    )}
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                                        tpl.is_active
                                                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                        {tpl.is_active ? t('Actif') : t('Inactif')}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            {/* Info button */}
                                            {templateInfo[tpl.slug] && (
                                                <button
                                                    type="button"
                                                    onClick={e => { e.stopPropagation(); setInfoTemplate(tpl); }}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-colors"
                                                    title={t('À quoi sert ce document ?')}
                                                    aria-label={t('À quoi sert ce document ?')}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                    </svg>
                                                </button>
                                            )}
                                            {/* Active toggle */}
                                            <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={tpl.is_active}
                                                    onChange={() => handleToggle(tpl)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500" />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Expandable body */}
                                    {isOpen && (
                                        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-5 animate-fade-in">
                                            {/* PDF Preview */}
                                            <div className="mb-4">
                                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Aperçu PDF')}</p>
                                                <div className="relative w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 overflow-hidden" style={{ height: 500 }}>
                                                    <iframe
                                                        ref={el => { iframeRefs.current[tpl.id] = el; }}
                                                        src={`/admin/settings/document-templates/${tpl.id}/preview`}
                                                        onLoad={() => setLoadingIframes(prev => ({ ...prev, [tpl.id]: false }))}
                                                        className="w-full h-full"
                                                        title={tpl.name}
                                                    />
                                                    {loadingIframes[tpl.id] && (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-100 dark:bg-gray-900 pointer-events-none">
                                                            <svg className="w-10 h-10 text-teal-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                                            </svg>
                                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('Chargement de l\'aperçu...')}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditor(tpl)}
                                                    className="flex-1 py-2.5 text-sm font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                    {t('Modifier le contenu')}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => refreshIframe(tpl.id)}
                                                    className="flex-1 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                                                    </svg>
                                                    {t('Actualiser l\'aperçu')}
                                                </button>
                                            </div>

                                            {/* Variables */}
                                            {Array.isArray(tpl.available_variables) && tpl.available_variables.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Variables disponibles')}</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {tpl.available_variables.map(v => (
                                                            <span key={v} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400">{`{{ ${v} }}`}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty state */}
            {templates.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-12 text-center">
                    <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('Aucun modèle')}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('Aucun modèle de document configuré.')}</p>
                </div>
            )}

            {/* Info Modal */}
            {infoTemplate && templateInfo[infoTemplate.slug] && createPortal(
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}
                    className="flex items-start justify-center overflow-y-auto py-8 px-4"
                >
                    <div
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        className="bg-black/70 backdrop-blur-md animate-fade-in"
                        onClick={() => setInfoTemplate(null)}
                    />
                    <div className="relative z-10 bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl animate-modal my-auto">
                        {/* Header */}
                        <div className={`px-6 py-4 bg-gradient-to-r ${categoryColors[infoTemplate.category] || categoryColors.project} rounded-t-2xl flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{infoTemplate.name}</h3>
                                    <p className="text-white/70 text-xs mt-0.5">{t('À propos de ce document')}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setInfoTemplate(null)}
                                className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                                aria-label={t('Fermer')}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            {(() => {
                                const info = templateInfo[infoTemplate.slug][infoLang];
                                return (
                                    <>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t('À quoi sert ce document ?')}</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 pl-9">{info.purpose}</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t('Pour qui est-il important ?')}</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 pl-9">{info.audience}</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t('Conséquences si non fait')}</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 pl-9">{info.consequences}</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t('Ce que vous évitez')}</h4>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 pl-9">{info.avoided}</p>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end rounded-b-2xl">
                            <button
                                type="button"
                                onClick={() => setInfoTemplate(null)}
                                className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {t('Fermer')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Editor Modal */}
            {editing && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto py-8 px-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={() => !saving && closeEditor()} />

                    <div className="relative z-10 bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl animate-modal my-auto">
                        {/* Header */}
                        <div className={`px-6 py-4 bg-gradient-to-r ${categoryColors[editing.category] || categoryColors.project} rounded-t-2xl flex items-center justify-between`}>
                            <div>
                                <h3 className="text-lg font-bold text-white">{editing.name}</h3>
                                <p className="text-white/70 text-xs font-mono mt-0.5">{editing.slug}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Preview toggle */}
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                        previewMode
                                            ? 'bg-white text-gray-900'
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    {previewMode ? t('Modifier') : t('Aperçu')}
                                </button>
                                <button onClick={() => !saving && closeEditor()} className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            {/* Template name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Nom')}</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-400"
                                />
                            </div>

                            {/* Available variables */}
                            {Array.isArray(editing.available_variables) && editing.available_variables.length > 0 && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('Variables disponibles')}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {editing.available_variables.map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => {
                                                    setEditForm(f => ({ ...f, body: f.body + `{{ ${v} }}` }));
                                                }}
                                                className="text-xs font-mono px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-500/20 transition-colors cursor-pointer border border-teal-200 dark:border-teal-500/20"
                                                title={t('Cliquer pour insérer')}
                                            >
                                                {`{{ ${v} }}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Body -- editor or preview */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    {previewMode ? t('Aperçu') : t('Contenu du document')}
                                </label>
                                {previewMode ? (
                                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                        <div className="bg-gray-100 dark:bg-gray-900/50 px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                            </div>
                                        </div>
                                        <div
                                            className="bg-white dark:bg-gray-800 px-8 py-6 prose prose-sm dark:prose-invert max-w-none"
                                            style={{ minHeight: 200 }}
                                            dangerouslySetInnerHTML={{ __html: editForm.body }}
                                        />
                                    </div>
                                ) : (
                                    <RichTextEditor
                                        value={editForm.body}
                                        onChange={body => setEditForm(f => ({ ...f, body }))}
                                        placeholder={t('Rédigez le contenu du template ici...')}
                                        minHeight={300}
                                    />
                                )}
                            </div>

                            {/* Requires signature toggle */}
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editForm.requires_signature}
                                        onChange={e => setEditForm(f => ({ ...f, requires_signature: e.target.checked }))}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                                </label>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('Signature requise')}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-3 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={closeEditor}
                                disabled={saving}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {t('Annuler')}
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center gap-2"
                            >
                                {saving ? (
                                    <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>{t('Enregistrement...')}</>
                                ) : t('Enregistrer')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </AdminLayout>
    );
}
