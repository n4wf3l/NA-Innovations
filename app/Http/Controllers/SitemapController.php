<?php

namespace App\Http\Controllers;

use App\Models\PortfolioProject;
use App\Models\Post;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $urls = collect();

        // Static pages
        $staticPages = [
            ['loc' => '/', 'priority' => '1.0', 'changefreq' => 'weekly'],
            ['loc' => '/services', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => '/projects', 'priority' => '0.8', 'changefreq' => 'weekly'],
            ['loc' => '/pricing', 'priority' => '0.8', 'changefreq' => 'monthly'],
            ['loc' => '/about', 'priority' => '0.6', 'changefreq' => 'monthly'],
            ['loc' => '/contact', 'priority' => '0.9', 'changefreq' => 'monthly'],
            ['loc' => '/posts', 'priority' => '0.7', 'changefreq' => 'weekly'],
            ['loc' => '/terms', 'priority' => '0.3', 'changefreq' => 'yearly'],
            ['loc' => '/privacy', 'priority' => '0.3', 'changefreq' => 'yearly'],
        ];

        foreach ($staticPages as $page) {
            $urls->push($page + ['lastmod' => now()->toDateString()]);
        }

        // Portfolio projects
        PortfolioProject::where('is_published', true)->get()->each(function ($project) use ($urls) {
            $urls->push([
                'loc' => "/projects/{$project->slug}",
                'lastmod' => $project->updated_at->toDateString(),
                'priority' => '0.7',
                'changefreq' => 'monthly',
            ]);
        });

        // Blog posts
        Post::where('status', 'published')->latest('published_at')->get()->each(function ($post) use ($urls) {
            $urls->push([
                'loc' => "/posts/{$post->slug}",
                'lastmod' => $post->updated_at->toDateString(),
                'priority' => '0.6',
                'changefreq' => 'monthly',
            ]);
        });

        $baseUrl = rtrim(config('app.url', 'https://nainnovations.be'), '/');

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$baseUrl}{$url['loc']}</loc>\n";
            $xml .= "    <lastmod>{$url['lastmod']}</lastmod>\n";
            $xml .= "    <changefreq>{$url['changefreq']}</changefreq>\n";
            $xml .= "    <priority>{$url['priority']}</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
