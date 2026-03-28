<?php

namespace App\Enums;

class ProjectType
{
    public const TYPES = [
        'static_site' => 'Site statique / Landing page',
        'showcase_site' => 'Site vitrine',
        'blog_portfolio' => 'Blog / Portfolio',
        'ecommerce' => 'E-commerce',
        'custom_cms' => 'Site sur mesure avec CMS',
        'platform_saas' => 'Plateforme web / SaaS',
        'mobile_app' => 'Application mobile',
        'desktop_app' => 'Application desktop',
        'api_backend' => 'API / Backend',
        'maintenance' => 'Maintenance / Support mensuel',
        'redesign' => 'Refonte / Migration',
    ];

    public static function getCommissionRate(string $type): float
    {
        return (float) \App\Models\Setting::get("commission.rate.{$type}", 10);
    }

    public static function allWithRates(): array
    {
        $result = [];
        foreach (self::TYPES as $key => $label) {
            $result[] = [
                'value' => $key,
                'label' => $label,
                'commission_rate' => self::getCommissionRate($key),
            ];
        }
        return $result;
    }
}
