export interface OnboardingState {
    client_dashboard?: boolean;
    partner_dashboard?: boolean;
    dev_dashboard?: boolean;
    admin_dashboard?: boolean;
}

export interface UserPreferences {
    email_notifications: boolean;
    name_display: 'full' | 'abbreviated';
    currency: string;
    privacy_full_name: boolean;
    onboarding?: OnboardingState;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    initial: string;
    is_active?: boolean;
    phone?: string;
    company_name?: string;
    vat_number?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
    avatar?: string | null;
    preferences?: UserPreferences;
    created_at?: string;
}

export interface Lead {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    company_name?: string;
    status: string;
    source: string;
    referral_partner_id?: number;
    converted_client_id?: number;
    service_interest?: string;
    estimated_budget?: number;
    notes?: string;
    lost_reason?: string;
    created_at: string;
    updated_at: string;
    referral_partner?: ReferralPartner;
}

export interface ReferralPartner {
    id: number;
    user_id: number;
    referral_code: string;
    default_commission_rate: number;
    is_active: boolean;
    user?: User;
}

export interface Project {
    id: number;
    nom_societe?: string;
    type_societe?: string;
    type_site?: string;
    lieu?: string;
    image?: string | null;
    client_id?: number;
    developer_id?: number;
    lead_id?: number;
    status: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    deadline?: string;
    budget?: number;
    total_billed?: number;
    jours_developpement?: number;
    langage_programmation?: string;
    created_at: string;
    client?: User;
    developer?: User;
}

export interface Quote {
    id: number;
    quote_number: string;
    title: string;
    client_name: string;
    client_email: string;
    client_company?: string;
    status: string;
    subtotal: number;
    tax_amount: number;
    total: number;
    deposit_amount: number;
    issue_date: string;
    valid_until?: string;
    locale?: string;
    is_external?: boolean;
    created_at: string;
    items?: QuoteItem[];
    client?: User;
    lead?: Lead;
}

export interface QuoteItem {
    id: number;
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    total: number;
    is_optional: boolean;
    sort_order: number;
}

export interface Invoice {
    id: number;
    invoice_number: string;
    title: string;
    client_name: string;
    client_email: string;
    type: string;
    status: string;
    subtotal: number;
    tax_amount: number;
    total: number;
    amount_paid: number;
    amount_due: number;
    issue_date: string;
    due_date: string;
    locale?: string;
    is_external?: boolean;
    created_at: string;
    client?: User;
    quote?: Quote;
    payments?: Payment[];
}

export interface Payment {
    id: number;
    amount: number;
    method: string;
    reference?: string;
    payment_date: string;
    status: string;
}

export interface Commission {
    id: number;
    base_amount: number;
    commission_rate: number;
    commission_amount: number;
    status: string;
    scheduled_payment_date?: string;
    paid_date?: string;
    referral_partner?: ReferralPartner;
    lead?: Lead;
    invoice?: Invoice;
}

export interface RecurringService {
    id: number;
    name: string;
    type: string;
    provider?: string;
    status: string;
    expiry_date: string;
    frequency: string;
    real_cost: number;
    billed_price: number;
    margin: number;
    client?: User;
}

export interface TimelineEvent {
    id: number;
    event_type: string;
    title: string;
    description?: string;
    old_value?: string;
    new_value?: string;
    created_at: string;
    user?: User;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    action_url?: string;
    created_at: string;
    is_read: boolean;
}

export interface PageProps {
    auth: { user: User | null };
    locale: string;
    flash: { success: string | null; error: string | null };
    notifications: Notification[];
    financialUnlocked: boolean;
    teamCounts: { partners: number; developers: number; admins: number };
}
