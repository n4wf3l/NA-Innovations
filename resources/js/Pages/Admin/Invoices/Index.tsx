import { useState, useRef, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import ModuleBanner from '@/Components/ui/ModuleBanner';
import StatCard from '@/Components/ui/StatCard';
import Badge from '@/Components/ui/Badge';
import Pagination from '@/Components/ui/Pagination';
import EmptyState from '@/Components/ui/EmptyState';
import DataTable from '@/Components/ui/DataTable';
import ProtectedAmount, { protectedValue } from '@/Components/ui/ProtectedAmount';
import { Invoice, PaginatedData, PageProps } from '@/types';
import { formatDate, formatStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useConfirm } from '@/hooks/useConfirm';

interface Props {
    invoices: PaginatedData<Invoice>;
    totalInvoices: number;
    totalBilled: number;
    totalPaid: number;
    totalOverdue: number;
}

const invoiceStatuses = [
    { value: 'draft', label: 'Brouillon' },
    { value: 'sent', label: 'Envoyée' },
    { value: 'paid', label: 'Payée' },
    { value: 'cancelled', label: 'Annulée' },
];

export default function InvoicesIndex({ invoices, totalInvoices, totalBilled, totalPaid, totalOverdue }: Props) {
    const { t } = useTranslation();
    const { confirm, ConfirmDialog } = useConfirm();
    const { financialUnlocked } = usePage<PageProps>().props;
    const [exportOpen, setExportOpen] = useState(false);
    const exportRef = useRef<HTMLDivElement>(null);

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
    const bulkStatusRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
                setExportOpen(false);
            }
            if (bulkStatusRef.current && !bulkStatusRef.current.contains(e.target as Node)) {
                setBulkStatusOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === invoices.data.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(invoices.data.map(i => i.id)));
        }
    };

    const handleBulkStatus = (status: string) => {
        router.patch('/admin/invoices/bulk-status', {
            ids: [...selectedIds],
            status,
        } as any, {
            onSuccess: () => {
                setSelectedIds(new Set());
                setBulkStatusOpen(false);
            },
        });
    };

    const handleBulkDelete = async () => {
        const ok = await confirm({
            title: t('Delete'),
            message: t('Are you sure? Only draft invoices will be deleted.'),
            confirmText: t('Delete'),
            variant: 'danger',
        });
        if (!ok) return;
        router.post('/admin/invoices/bulk-delete', {
            ids: [...selectedIds],
        } as any, {
            onSuccess: () => setSelectedIds(new Set()),
        });
    };

    const buildExportUrl = (format: 'pdf' | 'csv') => {
        const params = new URLSearchParams(window.location.search);
        const exportParams = new URLSearchParams();
        if (params.get('status')) exportParams.set('status', params.get('status')!);
        if (params.get('type')) exportParams.set('type', params.get('type')!);
        if (params.get('from')) exportParams.set('from', params.get('from')!);
        if (params.get('to')) exportParams.set('to', params.get('to')!);
        const qs = exportParams.toString();
        return `/admin/exports/invoices/${format}${qs ? '?' + qs : ''}`;
    };

    const columns = [
        {
            header: (
                <input
                    type="checkbox"
                    checked={invoices.data.length > 0 && selectedIds.size === invoices.data.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
                />
            ),
            accessor: (invoice: Invoice) => (
                <input
                    type="checkbox"
                    checked={selectedIds.has(invoice.id)}
                    onChange={() => toggleSelect(invoice.id)}
                    className="rounded border-gray-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
                    onClick={(e) => e.stopPropagation()}
                />
            ),
        },
        {
            header: t('Number'),
            accessor: (invoice: Invoice) => (
                <Link href={`/admin/invoices/${invoice.id}`} className="font-medium text-gray-900 dark:text-white hover:text-emerald-600">{invoice.invoice_number}</Link>
            ),
        },
        { header: t('Title'), accessor: (invoice: Invoice) => <span className="text-gray-700 dark:text-gray-200">{invoice.title}</span> },
        { header: t('Client'), accessor: (invoice: Invoice) => <span className="text-gray-500">{invoice.client_name}</span> },
        { header: t('Type'), accessor: (invoice: Invoice) => <span className="text-gray-500">{formatStatus(invoice.type)}</span> },
        { header: t('Status'), accessor: (invoice: Invoice) => <Badge status={invoice.status} /> },
        { header: t('Total'), className: 'text-right', accessor: (invoice: Invoice) => <span className="font-medium text-gray-900 dark:text-white"><ProtectedAmount amount={invoice.total} /></span> },
        { header: t('Due'), className: 'text-right', accessor: (invoice: Invoice) => <span className="text-gray-700 dark:text-gray-200"><ProtectedAmount amount={invoice.amount_due} /></span> },
        { header: t('Due Date'), accessor: (invoice: Invoice) => <span className="text-gray-500">{formatDate(invoice.due_date)}</span> },
        {
            header: t('Actions'),
            className: 'text-right',
            accessor: (invoice: Invoice) => (
                <span>
                    <Link href={`/admin/invoices/${invoice.id}`} className="text-gray-400 hover:text-emerald-600 mr-2">{t('View')}</Link>
                    <Link href={`/admin/invoices/${invoice.id}/edit`} className="text-gray-400 hover:text-gray-600">{t('Edit')}</Link>
                </span>
            ),
        },
    ];

    return (
        <AdminLayout title={t("Invoices")} header={t("Invoices")}>
            <Head title={t("Invoices")} />

            <ModuleBanner
                breadcrumb={`${t("Finance")} / ${t("Invoices")}`}
                title={t("Invoice Management")}
                description={t("Create and track invoices. Monitor payments, overdue amounts, and cash flow.")}
                gradient="from-emerald-600 to-teal-600"
                icon="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                actionHref="/admin/invoices/create"
                actionLabel={t("New Invoice")}
            />

            {/* Export dropdown */}
            <div className="flex justify-end mb-4">
                <div className="relative" ref={exportRef}>
                    <button
                        onClick={() => setExportOpen(!exportOpen)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                        {t('Export')}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {exportOpen && (
                        <div className="absolute right-0 z-20 mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                            <a
                                href={buildExportUrl('pdf')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg transition"
                                onClick={() => setExportOpen(false)}
                            >
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                {t('Export PDF')}
                            </a>
                            <a
                                href={buildExportUrl('csv')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg transition"
                                onClick={() => setExportOpen(false)}
                            >
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" /></svg>
                                {t('Export CSV')}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label={t("Total Invoices")} value={totalInvoices} borderColor="border-l-emerald-500" />
                <StatCard label={t("Total Billed")} value={protectedValue(totalBilled, financialUnlocked)} borderColor="border-l-blue-500" />
                <StatCard label={t("Total Paid")} value={protectedValue(totalPaid, financialUnlocked)} borderColor="border-l-teal-500" />
                <StatCard label={t("Overdue")} value={protectedValue(totalOverdue, financialUnlocked)} borderColor="border-l-red-500" />
            </div>

            {/* Table */}
            {invoices.data.length === 0 ? (
                <EmptyState title={t("No invoices yet")} description={t("Create your first invoice to get started.")} actionHref="/admin/invoices/create" actionLabel={t("New Invoice")} borderColor="border-t-emerald-500" />
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={invoices.data}
                        keyExtractor={invoice => invoice.id}
                    />
                    <div className="mt-2">
                        <Pagination links={invoices.links} />
                    </div>
                </>
            )}

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 text-white p-4 shadow-2xl border-t border-gray-700">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <span className="text-sm font-medium">
                            {selectedIds.size} facture(s) {t('selected')}
                        </span>
                        <div className="flex items-center gap-3">
                            {/* Change Status */}
                            <div className="relative" ref={bulkStatusRef}>
                                <button
                                    onClick={() => setBulkStatusOpen(!bulkStatusOpen)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    {t('Change Status')}
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {bulkStatusOpen && (
                                    <div className="absolute bottom-full mb-2 left-0 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                                        {invoiceStatuses.map(s => (
                                            <button
                                                key={s.value}
                                                onClick={() => handleBulkStatus(s.value)}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Delete (drafts only) */}
                            <button
                                onClick={handleBulkDelete}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                {t('Delete')} ({t('drafts only')})
                            </button>

                            {/* Deselect */}
                            <button
                                onClick={() => setSelectedIds(new Set())}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                {t('Deselect')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmDialog />
        </AdminLayout>
    );
}
