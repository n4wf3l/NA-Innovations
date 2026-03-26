import { Link } from '@inertiajs/react';

interface ModuleBannerProps {
    breadcrumb: string;
    title: string;
    description: string;
    gradient: string;
    icon: string;
    actionHref?: string;
    actionLabel?: string;
}

export default function ModuleBanner({ breadcrumb, title, description, gradient, icon, actionHref, actionLabel }: ModuleBannerProps) {
    return (
        <div className={`bg-gradient-to-r ${gradient} rounded-xl p-6 mb-6 relative overflow-hidden`}>
            <div className="relative z-10">
                <p className="text-white/60 text-sm mb-1">{breadcrumb}</p>
                <h2 className="font-display text-2xl text-white tracking-wide" style={{ fontFamily: "'Bebas Neue', cursive" }}>{title}</h2>
                <p className="text-white/60 text-sm mt-1">{description}</p>
            </div>
            <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 text-white/10 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            {actionHref && actionLabel && (
                <div className="absolute right-6 bottom-6 z-20">
                    <Link href={actionHref} className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium rounded-lg transition">
                        + {actionLabel}
                    </Link>
                </div>
            )}
        </div>
    );
}
