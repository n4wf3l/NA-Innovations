import { Link } from '@inertiajs/react';
import Badge from '@/Components/ui/Badge';
import ProtectedAmount from '@/Components/ui/ProtectedAmount';
import { Quote, Invoice, RecurringService } from '@/types';
import { formatDate } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface Props {
    quotes: Quote[];
    invoices: Invoice[];
    services: RecurringService[];
}

export default function ProjectRelatedDocs({ quotes, invoices, services }: Props) {
    const { t } = useTranslation();

    return (
        <>
            {/* Related Quotes */}
            {quotes.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{t("Quotes")}</h3>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {quotes.map(quote => (
                            <Link key={quote.id} href={`/admin/quotes/${quote.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div>
                                    <span className="font-medium text-gray-900 dark:text-white">{quote.quote_number}</span>
                                    <span className="ml-2 text-sm text-gray-500">{quote.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge status={quote.status} />
                                    <ProtectedAmount amount={quote.total} className="font-medium text-sm" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Invoices */}
            {invoices.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{t("Invoices")}</h3>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {invoices.map(inv => (
                            <Link key={inv.id} href={`/admin/invoices/${inv.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div>
                                    <span className="font-medium text-gray-900 dark:text-white">{inv.invoice_number}</span>
                                    <span className="ml-2 text-sm text-gray-500">{inv.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge status={inv.status} />
                                    <ProtectedAmount amount={inv.total} className="font-medium text-sm" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Related Services */}
            {services.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{t("Recurring Services")}</h3>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {services.map(svc => (
                            <Link key={svc.id} href={`/admin/services/${svc.id}`} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div>
                                    <span className="font-medium text-gray-900 dark:text-white">{svc.name}</span>
                                    {svc.provider && <span className="ml-2 text-sm text-gray-500">({svc.provider})</span>}
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge status={svc.status} />
                                    <span className="text-sm text-gray-500">{formatDate(svc.expiry_date)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
