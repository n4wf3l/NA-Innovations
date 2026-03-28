import { useTranslation } from 'react-i18next';

interface Props {
    value: string;
    onChange: (locale: string) => void;
    label?: string;
    size?: 'sm' | 'md';
}

function Flag({ locale, className }: { locale: string; className?: string }) {
    const colors: Record<string, string[]> = {
        fr: ['#002395', '#FFFFFF', '#ED2939'],
        en: ['#012169', '#C8102E', '#FFFFFF'],
        nl: ['#AE1C28', '#FFFFFF', '#21468B'],
    };
    const c = colors[locale] || colors.en;
    return (
        <svg className={className || 'w-5 h-3.5'} viewBox="0 0 30 20" style={{ borderRadius: 2 }}>
            {locale === 'en' ? (
                <>
                    <rect width="30" height="20" fill={c[0]} />
                    <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFF" strokeWidth="4" />
                    <path d="M0,0 L30,20 M30,0 L0,20" stroke={c[1]} strokeWidth="2.5" />
                    <rect x="12" width="6" height="20" fill="#FFF" />
                    <rect y="7.5" width="30" height="5" fill="#FFF" />
                    <rect x="13" width="4" height="20" fill={c[1]} />
                    <rect y="8" width="30" height="4" fill={c[1]} />
                </>
            ) : locale === 'nl' ? (
                <>
                    <rect width="30" height="7" fill={c[0]} />
                    <rect y="7" width="30" height="6" fill={c[1]} />
                    <rect y="13" width="30" height="7" fill={c[2]} />
                </>
            ) : (
                <>
                    <rect width="10" height="20" fill={c[0]} />
                    <rect x="10" width="10" height="20" fill={c[1]} />
                    <rect x="20" width="10" height="20" fill={c[2]} />
                </>
            )}
        </svg>
    );
}

export default function LocalePicker({ value, onChange, label, size = 'md' }: Props) {
    const { t } = useTranslation();

    return (
        <div>
            {label && <p className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</p>}
            <div className="inline-flex items-center rounded-xl bg-gray-100 dark:bg-gray-700/50 p-1 gap-0.5">
                {['fr', 'en', 'nl'].map(loc => (
                    <button
                        key={loc}
                        type="button"
                        onClick={() => onChange(loc)}
                        className={`flex items-center gap-1.5 rounded-lg font-semibold transition-all ${
                            size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
                        } ${
                            value === loc
                                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                    >
                        <Flag locale={loc} />
                        <span>{loc.toUpperCase()}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
