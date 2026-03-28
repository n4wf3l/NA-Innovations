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
    new: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    contacted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    brief_pending: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    brief_completed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    call_scheduled: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    qualified: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    not_qualified: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    quote_draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    quote_sent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    won: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    lost: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    published: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    viewed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
    accepted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    expired: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    partially_paid: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    refunded: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    planning: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    review: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    on_hold: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    estimated: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    scheduled: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    expiring_soon: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    suspended: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

export const PROJECT_TYPES: Record<string, string> = {
    static_site: 'Site statique / Landing page',
    showcase_site: 'Site vitrine',
    blog_portfolio: 'Blog / Portfolio',
    ecommerce: 'E-commerce',
    custom_cms: 'Site sur mesure avec CMS',
    platform_saas: 'Plateforme web / SaaS',
    mobile_app: 'Application mobile',
    desktop_app: 'Application desktop',
    api_backend: 'API / Backend',
    maintenance: 'Maintenance / Support mensuel',
    redesign: 'Refonte / Migration',
};

export function formatProjectType(type: string | null | undefined): string {
    if (!type) return '--';
    return PROJECT_TYPES[type] || type;
}
