<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title', 'Admin') - {{ config('app.name', 'NA Innovations') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=bebas-neue:400|figtree:400,500,600,700&display=swap" rel="stylesheet" />

    <!-- Turbo Drive (loads first, intercepts ALL link clicks for instant navigation) -->
    <script src="https://cdn.jsdelivr.net/npm/@hotwired/turbo@8.0.12/dist/turbo.es2017-umd.js" data-turbo-track="reload"></script>

    <!-- Styles -->
    @vite('resources/css/app.css')

    <!-- Alpine.js -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>

    <!-- SortableJS for drag-and-drop -->
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js"></script>

    <style>
        [x-cloak] { display: none !important; }
        .font-display { font-family: 'Bebas Neue', cursive; }
        .font-body { font-family: 'Figtree', sans-serif; }
        .turbo-progress-bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: #5eead4; z-index: 9999; transition: width 300ms ease; }

        /* Dark scrollbar for sidebar */
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #4b5563; }
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: #374151 transparent; }

        @keyframes pageIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="font-body antialiased bg-gray-50" x-data="{ sidebarOpen: false }">

    <div class="min-h-screen flex">

        {{-- Mobile sidebar overlay --}}
        <div
            x-show="sidebarOpen"
            x-transition:enter="transition-opacity ease-linear duration-300"
            x-transition:enter-start="opacity-0"
            x-transition:enter-end="opacity-100"
            x-transition:leave="transition-opacity ease-linear duration-300"
            x-transition:leave-start="opacity-100"
            x-transition:leave-end="opacity-0"
            class="fixed inset-0 z-40 bg-black/50 lg:hidden"
            @click="sidebarOpen = false"
            x-cloak
        ></div>

        {{-- Sidebar --}}
        <aside
            :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
            class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col h-screen overflow-hidden"
        >
            {{-- Logo area --}}
            <div class="flex-shrink-0 flex items-center justify-between h-14 px-5 border-b border-gray-800">
                <a href="{{ route('admin.dashboard') }}" class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-teal-300 rounded-lg flex items-center justify-center">
                        <span class="font-display text-gray-900 text-lg font-bold leading-none">NA</span>
                    </div>
                    <span class="font-display text-white text-xl tracking-wide">NA Innovations</span>
                </a>
                <button @click="sidebarOpen = false" class="lg:hidden text-gray-400 hover:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            {{-- Navigation --}}
            <nav class="flex-1 overflow-y-auto sidebar-scroll px-3 py-2 space-y-0.5">
                {{-- Dashboard --}}
                <a href="{{ route('admin.dashboard') }}"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.dashboard') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
                    </svg>
                    {{ __('Dashboard') }}
                </a>

                {{-- BUSINESS section --}}
                <div class="pt-2.5">
                    <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ __('Business') }}</p>
                </div>

                <a href="{{ route('admin.leads.index') }}"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.leads.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
                    </svg>
                    {{ __('Leads') }}
                </a>

                <a href="{{ route('admin.clients.index') }}"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.clients.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"/>
                    </svg>
                    {{ __('Clients') }}
                </a>

                <a href="{{ route('admin.projects.index') }}"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.projects.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/>
                    </svg>
                    {{ __('Projects') }}
                </a>

                <a href="{{ route('admin.projects.index') }}?view=kanban"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ml-8
                          text-gray-400 hover:text-white hover:bg-gray-800/50">
                    <svg class="w-4 h-4 mr-2.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z"/>
                    </svg>
                    {{ __('Team Board') }}
                </a>

                {{-- FINANCE section --}}
                <div class="pt-2.5">
                    <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ __('Finance') }}</p>
                </div>

                <a href="{{ route('admin.quotes.index') }}"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.quotes.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
                    </svg>
                    {{ __('Quotes') }}
                </a>

                <a href="{{ route('admin.invoices.index') }}"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.invoices.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>
                    </svg>
                    {{ __('Invoices') }}
                </a>

                <a href="{{ route('admin.commissions.index') }}"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.commissions.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>
                    </svg>
                    {{ __('Commissions') }}
                </a>

                {{-- CONTENT section --}}
                <div class="pt-2.5">
                    <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ __('Content') }}</p>
                </div>

                <a href="#"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.portfolio.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M2.25 15.75V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-2.25m0 0V6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v9.75"/>
                    </svg>
                    {{ __('Portfolio') }}
                </a>

                <a href="{{ route('admin.posts.index') }}"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.posts.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"/>
                    </svg>
                    {{ __('News / Blog') }}
                </a>

                <a href="{{ route('admin.messages.index') }}"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.messages.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/>
                    </svg>
                    {{ __('Messages') }}
                </a>

                {{-- PEOPLE section --}}
                <div class="pt-2.5">
                    <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ __('People') }}</p>
                </div>

                <a href="{{ route('admin.partners.index') }}"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.partners.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
                    </svg>
                    {{ __('Partners') }}
                </a>

                {{-- SYSTEM section --}}
                <div class="pt-2.5">
                    <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ __('System') }}</p>
                </div>

                <a href="{{ route('admin.services.index') }}"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.services.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"/>
                    </svg>
                    {{ __('Recurring Services') }}
                </a>

                <a href="#"
                   class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          {{ request()->routeIs('admin.settings.*') ? 'bg-teal-300/10 text-teal-300 border-r-2 border-teal-300' : 'text-gray-400 hover:text-white hover:bg-gray-800/50' }}">
                    <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ __('Settings') }}
                </a>
            </nav>

            {{-- View site link --}}
            <div class="flex-shrink-0 px-3 py-1">
                <a href="{{ url('/') }}" target="_blank"
                   class="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-teal-300 hover:bg-gray-800/50 transition-colors">
                    <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
                    </svg>
                    {{ __('View Site') }}
                </a>
            </div>

            {{-- Sidebar footer / user info --}}
            <div class="flex-shrink-0 border-t border-gray-800 px-4 py-3">
                <div class="flex items-center space-x-2.5">
                    <div class="w-7 h-7 rounded-full bg-teal-300/20 flex items-center justify-center">
                        <span class="text-teal-300 text-xs font-semibold">
                            {{ auth()->check() ? strtoupper(substr(auth()->user()->name, 0, 1)) : 'A' }}
                        </span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-medium text-white truncate">
                            {{ auth()->check() ? auth()->user()->name : 'Admin' }}
                        </p>
                        <p class="text-[10px] text-gray-500 truncate">{{ __('Administrator') }}</p>
                    </div>
                </div>
            </div>
        </aside>

        {{-- Main content area --}}
        <div class="flex-1 flex flex-col min-h-screen lg:ml-64">
            {{-- Top bar --}}
            <header class="sticky top-0 z-30 bg-white border-b border-gray-200">
                <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                    {{-- Left side: hamburger + page title --}}
                    <div class="flex items-center space-x-4">
                        <button
                            @click="sidebarOpen = true"
                            class="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                            </svg>
                        </button>
                        <h1 class="text-lg font-semibold text-gray-900">
                            @yield('header', '')
                        </h1>
                    </div>

                    {{-- Right side: search, notifications, profile --}}
                    <div class="flex items-center space-x-4">
                        {{-- Search --}}
                        <div class="hidden sm:block">
                            <div class="relative">
                                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="{{ __('Search...') }}"
                                    class="w-64 pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300/50 focus:border-teal-300"
                                />
                            </div>
                        </div>

                        {{-- Notifications bell --}}
                        <button class="relative text-gray-500 hover:text-gray-700 focus:outline-none">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
                            </svg>
                            {{-- Notification dot --}}
                            <span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full border-2 border-white"></span>
                        </button>

                        {{-- Profile dropdown --}}
                        <div class="relative" x-data="{ open: false }">
                            <button
                                @click="open = !open"
                                @click.outside="open = false"
                                class="flex items-center space-x-2 text-sm focus:outline-none"
                            >
                                <div class="w-8 h-8 rounded-full bg-teal-300/20 flex items-center justify-center">
                                    <span class="text-teal-600 text-sm font-semibold">
                                        {{ auth()->check() ? strtoupper(substr(auth()->user()->name, 0, 1)) : 'A' }}
                                    </span>
                                </div>
                                <span class="hidden sm:inline text-gray-700 font-medium">
                                    {{ auth()->check() ? auth()->user()->name : 'Admin' }}
                                </span>
                                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/>
                                </svg>
                            </button>

                            {{-- Dropdown menu --}}
                            <div
                                x-show="open"
                                x-transition:enter="transition ease-out duration-100"
                                x-transition:enter-start="transform opacity-0 scale-95"
                                x-transition:enter-end="transform opacity-100 scale-100"
                                x-transition:leave="transition ease-in duration-75"
                                x-transition:leave-start="transform opacity-100 scale-100"
                                x-transition:leave-end="transform opacity-0 scale-95"
                                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                                x-cloak
                            >
                                <a href="{{ route('profile.edit') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    {{ __('Your Profile') }}
                                </a>
                                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    {{ __('Settings') }}
                                </a>
                                <div class="border-t border-gray-100 my-1"></div>
                                {{-- Language switcher --}}
                                <div class="px-4 py-2">
                                    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{{ __('Language') }}</p>
                                    <div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                                        @foreach(['en' => 'EN', 'fr' => 'FR', 'nl' => 'NL'] as $code => $label)
                                            <a href="{{ route('locale.switch', $code) }}"
                                               data-turbo="false"
                                               class="flex-1 text-center py-1 text-xs font-semibold rounded-md transition-colors
                                                      {{ app()->getLocale() === $code ? 'bg-teal-300 text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700' }}">
                                                {{ $label }}
                                            </a>
                                        @endforeach
                                    </div>
                                </div>
                                <div class="border-t border-gray-100 my-1"></div>
                                <form method="POST" action="{{ route('logout') }}">
                                    @csrf
                                    <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        {{ __('Sign Out') }}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {{-- Flash messages --}}
            @if (session('success'))
                <div class="mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
                    {{ session('success') }}
                </div>
            @endif

            @if (session('error'))
                <div class="mx-4 sm:mx-6 lg:mx-8 mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    {{ session('error') }}
                </div>
            @endif

            {{-- Page content with entrance animation --}}
            <main class="flex-1 p-4 sm:p-6 lg:p-8">
                <div style="animation: pageIn 0.35s ease-out both;">
                    @yield('content')
                </div>
            </main>
        </div>
    </div>
</body>
</html>
