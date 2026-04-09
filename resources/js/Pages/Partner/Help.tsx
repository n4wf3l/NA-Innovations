import PartnerLayout from '@/Layouts/PartnerLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Faq {
    id: number;
    question: string;
    answer: string;
    category: string;
}

interface Props {
    faqs: Faq[];
    contactEmail?: string;
}

const categoryMeta: Record<string, { label: string; color: string; icon: string }> = {
    commissions: { label: 'Commissions', color: 'from-emerald-500 to-teal-600', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    pipeline: { label: 'Pipeline', color: 'from-blue-500 to-indigo-600', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' },
    leads: { label: 'Leads', color: 'from-violet-500 to-purple-600', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07' },
    objections: { label: 'Objections', color: 'from-amber-500 to-orange-600', icon: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z' },
    rules: { label: 'Règles', color: 'from-rose-500 to-pink-600', icon: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z' },
    general: { label: 'Général', color: 'from-gray-500 to-gray-600', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' },
};

function formatAnswer(text: string): React.ReactNode {
    // simple formatter: **bold**, line breaks, lines starting with - become bullets
    const lines = text.split('\n');
    const out: React.ReactNode[] = [];
    let bullets: string[] = [];
    const flushBullets = (key: number) => {
        if (bullets.length === 0) return;
        out.push(
            <ul key={`ul-${key}`} className="list-disc ml-6 my-2 space-y-1">
                {bullets.map((b, i) => <li key={i} dangerouslySetInnerHTML={{ __html: renderInline(b) }} />)}
            </ul>
        );
        bullets = [];
    };
    lines.forEach((line, idx) => {
        if (line.trim().startsWith('- ')) {
            bullets.push(line.trim().slice(2));
        } else {
            flushBullets(idx);
            if (line.trim() === '') {
                out.push(<div key={idx} className="h-2" />);
            } else {
                out.push(<p key={idx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />);
            }
        }
    });
    flushBullets(9999);
    return out;
}

function renderInline(s: string): string {
    // Escape HTML then apply **bold**
    const escaped = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return escaped.replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white font-semibold">$1</strong>');
}

export default function PartnerHelp({ faqs, contactEmail = 'info@nainnovations.be' }: Props) {
    const { t } = useTranslation();
    const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);
    const [search, setSearch] = useState('');

    const filtered = faqs.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <PartnerLayout title={t('Centre d\'aide')}>
            <Head title={t('Centre d\'aide partenaire')} />

            <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
                {/* Hero */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 p-8 text-white shadow-lg shadow-rose-500/20">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm mb-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                            <span className="text-xs font-semibold uppercase tracking-wider">{t('FAQ Partenaires')}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('Tout ce que vous devez savoir')}</h1>
                        <p className="text-rose-100 text-sm max-w-2xl">
                            {t("Les réponses aux questions les plus fréquentes sur les commissions, le pipeline, la gestion des leads et les règles du programme partenaire NA Innovations.")}
                        </p>
                    </div>
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10" />
                    <div className="absolute -right-4 -top-12 w-32 h-32 rounded-full bg-white/10" />
                </div>

                {/* Search */}
                <div className="relative">
                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t('Rechercher une question…')}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-transparent shadow-sm"
                    />
                </div>

                {/* FAQs */}
                <div className="space-y-3">
                    {filtered.length === 0 && (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <p className="text-gray-500 dark:text-gray-400">{t('Aucune question ne correspond à votre recherche.')}</p>
                        </div>
                    )}
                    {filtered.map((faq) => {
                        const meta = categoryMeta[faq.category] || categoryMeta.general;
                        const isOpen = openId === faq.id;
                        return (
                            <div
                                key={faq.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                                    className="w-full flex items-start gap-4 p-5 sm:p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors"
                                >
                                    <div className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white shadow-lg`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={meta.icon} />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                                            {t(meta.label)}
                                        </span>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-snug">
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <svg
                                        className={`flex-shrink-0 w-5 h-5 text-gray-400 mt-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                                {isOpen && (
                                    <div className="px-5 sm:px-6 pb-6 pt-1 ml-0 sm:ml-15">
                                        <div className="ml-0 sm:ml-15 pl-0 sm:pl-4 sm:border-l-2 sm:border-rose-200 dark:sm:border-rose-500/30 text-sm text-gray-700 dark:text-gray-300 space-y-1 animate-fade-in">
                                            {formatAnswer(faq.answer)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 text-center text-white">
                    <h3 className="text-lg font-bold mb-1">{t("Vous n'avez pas trouvé votre réponse ?")}</h3>
                    <p className="text-gray-400 text-sm mb-4">{t("Contactez l'équipe NA Innovations directement, on vous répond sous 24h.")}</p>
                    <a
                        href={`mailto:${contactEmail}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        {t('Nous contacter')}
                    </a>
                </div>
            </div>
        </PartnerLayout>
    );
}
