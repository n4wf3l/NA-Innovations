<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PublicService;

class PublicServiceSeeder extends Seeder
{
    public function run(): void
    {
        PublicService::updateOrCreate(
            ['title' => 'Custom Development'],
            [
                'description' => 'We specialize in building high-performing, conversion-focused digital solutions - from custom websites and software to mobile applications. Whether it\'s a showcase site, e-commerce platform, interactive web app, or SaaS, we take your idea from concept to deployment.',
                'icon' => 'globe',
                'sort_order' => 1,
                'is_active' => true,
            ]
        );

        PublicService::updateOrCreate(
            ['title' => 'Mobile Applications'],
            [
                'description' => 'We design and develop native, hybrid, and PWA applications with seamless user experiences across all devices. Our process includes planning, design, development, testing, and ongoing maintenance.',
                'icon' => 'mobile',
                'sort_order' => 2,
                'is_active' => true,
            ]
        );

        PublicService::updateOrCreate(
            ['title' => 'SaaS & Platforms'],
            [
                'description' => 'We build complete SaaS platforms, internal tools, and custom dashboards tailored to your business logic. From user management to payment integration and real-time data - we handle the full stack.',
                'icon' => 'server',
                'sort_order' => 3,
                'is_active' => true,
            ]
        );
    }
}
