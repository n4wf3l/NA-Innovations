import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import { PaginatedData } from '@/types';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useConfirm } from '@/hooks/useConfirm';

interface Message {
    id: number;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    status: string;
    created_at: string;
}

interface Props {
    messages: PaginatedData<Message>;
}

export default function MessagesIndex({ messages }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const [expanded, setExpanded] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        const ok = await confirm({
            title: t('Supprimer'),
            message: t('Supprimer ce message ?'),
            confirmText: t('Supprimer'),
            variant: 'danger',
        });
        if (!ok) return;
        router.delete(`/admin/messages/${id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout title={t("Messages")} header={t("Messages")}>
            <Head title={t("Messages")} />

            <ModuleBanner
                breadcrumb={`${t("Content")} / ${t("Messages")}`}
                title={t("Contact Messages")}
                description={t("View and manage messages received from the website contact form.")}
                gradient="from-teal-600 to-cyan-600"
                icon="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />

            {messages.data.length === 0 ? (
                <EmptyState title={t("No messages yet")} description={t("Messages from the contact form will appear here.")} borderColor="border-t-teal-500" />
            ) : (
                <div className="space-y-3">
                    {messages.data.map(msg => (
                        <div key={msg.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                                className="w-full p-5 text-left hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{msg.name}</h4>
                                            <Badge status={msg.status} />
                                        </div>
                                        {msg.subject && <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{msg.subject}</p>}
                                        {expanded !== msg.id && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{msg.message}</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-xs text-gray-400">{msg.email}</span>
                                            {msg.phone && <span className="text-xs text-gray-400">{msg.phone}</span>}
                                            <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                    <svg className={`w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 ml-4 transition-transform ${expanded === msg.id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </button>

                            {expanded === msg.id && (
                                <div className="px-5 pb-5 border-t border-gray-50 dark:border-gray-700">
                                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mt-4 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words">
                                        {msg.message}
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <a href={`mailto:${msg.email}`} className="inline-flex items-center gap-2 text-xs font-semibold text-teal-500 hover:text-teal-600 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                                            {t('Répondre par email')}
                                        </a>
                                        <button onClick={() => handleDelete(msg.id)} className="text-xs text-red-400 hover:text-red-500 font-medium transition-colors">
                                            {t('Supprimer')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="pt-2">
                        <Pagination links={messages.links} />
                    </div>
                </div>
            )}
            <ConfirmDialog />
        </AdminLayout>
    );
}
