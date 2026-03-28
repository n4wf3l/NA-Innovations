import { useTranslation } from 'react-i18next';

const flags: Record<string, string> = {
    fr: '🇫🇷',
    en: '🇬🇧',
    nl: '🇳🇱',
};

const labels: Record<string, string> = {
    fr: 'FR',
    en: 'EN',
    nl: 'NL',
};

interface Props {
    value: string;
    onChange: (locale: string) => void;
    label?: string;
    size?: 'sm' | 'md';
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
                        <span>{flags[loc]}</span>
                        <span>{labels[loc]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
