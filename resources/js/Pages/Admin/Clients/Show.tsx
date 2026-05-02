import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { formatDate, formatProjectType } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import NotesSection from '@/Components/ui/NotesSection';
import WhatsAppButton from '@/Components/ui/WhatsAppButton';

interface Props {
    client: any;
}

export default function ClientShow({ client }: Props) {
    const { t } = useTranslation();
    const projects = client.projects || [];
    const quotes = client.quotes || [];
    const invoices = client.invoices || [];
    const services = client.recurring_services || [];

    return (
        <AdminLayout title={client.name} header={t('Client Management')}>
            <Head title={client.name} />

            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/clients" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">&larr; {t("Back to Clients")}</Link>
                <Link href={`/admin/clients/${client.id}/edit`} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">{t('Edit')}</Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left - main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Client header */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                                    <span className="text-2xl font-black text-white">{client.name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">{client.name}</h1>
                                    {client.company_name && <p className="text-teal-100 text-sm">{client.company_name}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t('Email')}</span>
                                <a href={`mailto:${client.email}`} className="font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700">{client.email}</a>
                            </div>
                            {client.phone && <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t('Phone')}</span>
                                <div className="flex items-center gap-2">
                                    <a href={`tel:${client.phone}`} className="font-medium text-gray-900 dark:text-white hover:text-teal-600">{client.phone}</a>
                                    <WhatsAppButton phone={client.phone} message={t('Bonjour {{name}}, je reviens vers vous concernant votre projet.', { name: client.name } as any)} />
                                </div>
                            </div>}
                            {client.vat_number && <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t('VAT')}</span>
                                <span className="font-medium text-gray-900 dark:text-white">{client.vat_number}</span>
                            </div>}
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 block">{t('Status')}</span>
                                <span className={`font-semibold ${client.is_active ? 'text-emerald-500' : 'text-red-500'}`}>{client.is_active ? t('Active') : t('Inactive')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Projects */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Projects')} <span className="text-gray-400 font-normal">({projects.length})</span></h3>
                        </div>
                        {projects.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('No projects yet.')}</div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {projects.map((p: any) => (
                                    <Link key={p.id} href={`/admin/projects/${p.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{p.nom_societe}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">{formatProjectType(p.type_site)} {p.start_date ? `· ${formatDate(p.start_date)}` : ''}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {p.budget && <ProtectedAmount amount={p.budget} className="text-sm" />}
                                            <Badge status={p.status} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Invoices */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t('Invoices')} <span className="text-gray-400 font-normal">({invoices.length})</span></h3>
                        </div>
                        {invoices.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-500">{t('No invoices yet.')}</div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                                        <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Number')}</th>
                                        <th className="text-left px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Title')}</th>
                                        <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Total')}</th>
                                        <th className="text-right px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Amount Due')}</th>
                                        <th className="text-center px-6 py-3 font-medium text-gray-500 dark:text-gray-400">{t('Status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoices.map((inv: any) => (
                                        <tr key={inv.id} className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                            <td className="px-6 py-3"><Link href={`/admin/invoices/${inv.id}`} className="font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700">{inv.invoice_number}</Link></td>
                                            <td className="px-6 py-3 text-gray-700 dark:text-gray-300">{inv.title}</td>
                                            <td className="px-6 py-3 text-right"><ProtectedAmount amount={inv.total} /></td>
                                            <td className="px-6 py-3 text-right"><ProtectedAmount amount={inv.amount_due} /></td>
                                            <td className="px-6 py-3 text-center"><Badge status={inv.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    {/* Contact info card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('Contact Information')}</h4>
                        {client.address && <Info label={t('Address')} value={[client.address, client.city, client.postal_code, client.country].filter(Boolean).join(', ')} />}
                        {client.last_login_at && <Info label={t('Last login')} value={formatDate(client.last_login_at)} />}
                        <Info label={t('Created')} value={formatDate(client.created_at)} />
                    </div>

                    {/* Quotes */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-gray-50 dark:border-gray-700">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t('Quotes')} <span className="text-gray-400 font-normal">({quotes.length})</span></h4>
                        </div>
                        {quotes.length === 0 ? (
                            <div className="p-6 text-center text-xs text-gray-400 dark:text-gray-500">{t('No quotes yet.')}</div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {quotes.map((q: any) => (
                                    <Link key={q.id} href={`/admin/quotes/${q.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{q.quote_number}</p>
                                            <p className="text-xs text-gray-400">{q.title}</p>
                                        </div>
                                        <Badge status={q.status} />
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recurring services */}
                    {services.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                            <div className="px-5 py-3 border-b border-gray-50 dark:border-gray-700">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t('Recurring Services')}</h4>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {services.map((s: any) => (
                                    <Link key={s.id} href={`/admin/services/${s.id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</p>
                                            <p className="text-xs text-gray-400">{s.provider} · {s.expiry_date ? formatDate(s.expiry_date) : '--'}</p>
                                        </div>
                                        <Badge status={s.status} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <NotesSection notes={client.notes || []} notableType="client" notableId={client.id} />
                </div>
            </div>
        </AdminLayout>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{value}</p>
        </div>
    );
}
