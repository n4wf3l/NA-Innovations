<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>body{opacity:0;transition:opacity .2s ease-in}body.ready{opacity:1}</style>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>{{ config('app.name', 'NA Innovations') }}</title>
    <link rel="icon" href="{{ asset('NAlogo2.png') }}" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=bebas-neue:400|figtree:400,500,600,700&display=swap" rel="stylesheet" />
    @viteReactRefresh
    @vite('resources/js/app.tsx')
    @inertiaHead
</head>
<script>
    (function(){
        var t = localStorage.getItem('na_theme');
        if (t === 'dark' || t === null || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    })();
</script>
<body class="font-sans antialiased bg-gray-50 dark:bg-gray-950 transition-colors">
    @inertia
</body>
</html>
