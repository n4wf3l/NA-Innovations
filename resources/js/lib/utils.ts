// Currency locale mapping
const CURRENCY_LOCALES: Record<string, string> = {
    EUR: 'de-DE',
    USD: 'en-US',
    GBP: 'en-GB',
    PKR: 'en-PK',
    BDT: 'en-BD',
    INR: 'en-IN',
    MAD: 'fr-MA',
};

// Global currency state - set by layouts from user preferences
let _currency = 'EUR';

export function setCurrency(currency: string) {
    _currency = currency;
}

export function getCurrency(): string {
    return _currency;
}

export function formatCurrency(amount: number, currency?: string): string {
    const cur = currency || _currency;
    const locale = CURRENCY_LOCALES[cur] || 'de-DE';
    return new Intl.NumberFormat(locale, { style: 'currency', currency: cur }).format(amount);
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
}

export function formatStatus(status: string): string {
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function cn(...classes: (string | false | null | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

export const STATUS_COLORS: Record<string, string> = {
    new: 'bg-violet-100 text-violet-700',
    contacted: 'bg-blue-100 text-blue-700',
    brief_pending: 'bg-indigo-100 text-indigo-700',
    brief_completed: 'bg-indigo-100 text-indigo-700',
    call_scheduled: 'bg-cyan-100 text-cyan-700',
    qualified: 'bg-cyan-100 text-cyan-700',
    not_qualified: 'bg-gray-100 text-gray-700',
    quote_draft: 'bg-amber-100 text-amber-700',
    quote_sent: 'bg-amber-100 text-amber-700',
    won: 'bg-emerald-100 text-emerald-700',
    lost: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    viewed: 'bg-indigo-100 text-indigo-700',
    accepted: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    expired: 'bg-amber-100 text-amber-700',
    paid: 'bg-emerald-100 text-emerald-700',
    partially_paid: 'bg-teal-100 text-teal-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-700',
    refunded: 'bg-amber-100 text-amber-700',
    planning: 'bg-violet-100 text-violet-700',
    in_progress: 'bg-blue-100 text-blue-700',
    review: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    on_hold: 'bg-gray-100 text-gray-700',
    estimated: 'bg-gray-100 text-gray-700',
    confirmed: 'bg-blue-100 text-blue-700',
    scheduled: 'bg-amber-100 text-amber-700',
    active: 'bg-emerald-100 text-emerald-700',
    expiring_soon: 'bg-amber-100 text-amber-700',
    suspended: 'bg-red-100 text-red-700',
    inactive: 'bg-gray-100 text-gray-700',
};
