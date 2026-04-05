import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/lib/utils';

interface Testimonial {
    id: number;
    message: string;
    rating: number | null;
    status: 'pending' | 'approved' | 'rejected';
    show_on_landing: boolean;
    created_at: string;
    user: { id: number; name: string; email: string; company_name: string | null; avatar: string | null };
}

interface Props { testimonials: Testimonial[]; }

const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
    approved: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    rejected: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30',
};

export default function Testimonials({ testimonials }: Props) {
    const { t } = useTranslation();

    return (
        <AdminLayout header={t('Témoignages clients')}>
            <Head title={t('Témoignages clients')} />

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 p-6 sm:p-8 mb-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('Témoignages clients')}</h1>
                    <p className="text-rose-200 text-sm">{t('Gérez les témoignages soumis par vos clients. Approuvez-les pour les afficher sur la landing page.')}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 text-center">
                    <p className="text-2xl font-black text-amber-500">{testimonials.filter(t => t.status === 'pending').length}</p>
                    <p className="text-xs text-gray-400">{t('En attente')}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 text-center">
                    <p className="text-2xl font-black text-emerald-500">{testimonials.filter(t => t.status === 'approved').length}</p>
                    <p className="text-xs text-gray-400">{t('Approuvés')}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 text-center">
                    <p className="text-2xl font-black text-rose-500">{testimonials.filter(t => t.show_on_landing).length}</p>
                    <p className="text-xs text-gray-400">{t('Sur la landing')}</p>
                </div>
            </div>

            {testimonials.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-16 text-center">
                    <p className="text-gray-400">{t('Aucun témoignage soumis.')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {testimonial.user.avatar ? (
                                            <img src={testimonial.user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-sm">
                                                {testimonial.user.name[0]?.toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{testimonial.user.name}</p>
                                            <p className="text-xs text-gray-400">{testimonial.user.company_name || testimonial.user.email} · {formatDate(testimonial.created_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${statusColors[testimonial.status]}`}>
                                            {testimonial.status === 'pending' ? t('En attente') : testimonial.status === 'approved' ? t('Approuvé') : t('Rejeté')}
                                        </span>
                                        {testimonial.show_on_landing && (
                                            <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30">
                                                Landing
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Rating */}
                                {testimonial.rating && (
                                    <div className="flex gap-1 mb-3">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <svg key={star} className={`w-4 h-4 ${star <= testimonial.rating! ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                            </svg>
                                        ))}
                                    </div>
                                )}

                                {/* Message */}
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">"{testimonial.message}"</p>
                            </div>

                            {/* Actions */}
                            <div className="flex border-t border-gray-50 dark:border-gray-700 divide-x divide-gray-50 dark:divide-gray-700">
                                {testimonial.status === 'pending' && (
                                    <>
                                        <button onClick={() => router.patch(`/admin/testimonials/${testimonial.id}/approve`)} className="flex-1 py-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                                            {t('Approuver')}
                                        </button>
                                        <button onClick={() => router.patch(`/admin/testimonials/${testimonial.id}/reject`)} className="flex-1 py-3 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                                            {t('Rejeter')}
                                        </button>
                                    </>
                                )}
                                {testimonial.status === 'approved' && (
                                    <button onClick={() => router.patch(`/admin/testimonials/${testimonial.id}/toggle-landing`)} className="flex-1 py-3 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-500/10 transition-colors">
                                        {testimonial.show_on_landing ? t('Retirer de la landing') : t('Afficher sur la landing')}
                                    </button>
                                )}
                                <button onClick={() => { if (confirm(t('Supprimer ce témoignage ?'))) router.delete(`/admin/testimonials/${testimonial.id}`); }} className="flex-1 py-3 text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    {t('Supprimer')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
