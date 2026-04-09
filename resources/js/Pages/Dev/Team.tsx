import DevLayout from '@/Layouts/DevLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface Admin {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
}

interface Props {
    admins: Admin[];
}

export default function DevTeam({ admins }: Props) {
    const { t } = useTranslation();

    return (
        <DevLayout title={t('Équipe')}>
            <Head title={t('Équipe')} />

            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">{t('Contacts administrateurs')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {admins.length === 0 && <p className="text-xs text-gray-400">{t('Aucun contact')}</p>}
                        {admins.map(a => (
                            <div key={a.id} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                                <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                                    {a.avatar ? <img src={a.avatar} alt={a.name} className="w-12 h-12 rounded-full object-cover" /> : a.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{a.name}</p>
                                    <a href={`mailto:${a.email}`} className="text-xs text-indigo-500 hover:underline truncate block">{a.email}</a>
                                    {a.phone && <p className="text-xs text-gray-400">{a.phone}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DevLayout>
    );
}
