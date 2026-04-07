/**
 * Returns the platform branding (company name + logo) shared globally
 * via Inertia. Falls back to "NA Innovations" if nothing is configured.
 */
import { usePage } from '@inertiajs/react';

interface BrandingShape {
    logo_path?: string;
    company_name?: string;
    tagline?: string;
}

interface PageProps {
    branding?: BrandingShape;
}

export function useBranding() {
    const page = usePage<PageProps>();
    const b = page.props.branding || {};
    return {
        companyName: b.company_name || 'NA Innovations',
        tagline: b.tagline || '',
        logoUrl: b.logo_path ? `/storage/${b.logo_path}` : null,
    };
}
