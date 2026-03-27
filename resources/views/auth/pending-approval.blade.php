<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Pending Approval - NA Innovations</title>
    <link rel="icon" href="{{ asset('NAlogo2.png') }}" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=bebas-neue:400|figtree:400,500,600,700&display=swap" rel="stylesheet" />
    @vite('resources/js/public.ts')
    <style>
        .font-display { font-family: 'Bebas Neue', cursive; }
        .font-body { font-family: 'Figtree', sans-serif; }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .bg-animated {
            background: linear-gradient(-45deg, #0f172a, #1e293b, #134e4a, #0f172a);
            background-size: 400% 400%;
            animation: gradientShift 20s ease infinite;
        }
        @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
    </style>
</head>
<body class="font-body antialiased bg-animated min-h-screen flex items-center justify-center p-6">

    <div class="w-full max-w-md">
        {{-- Logo --}}
        <div class="text-center mb-8">
            <a href="{{ url('/') }}" class="inline-flex items-center space-x-3">
                <div class="w-12 h-12 bg-teal-300 rounded-xl flex items-center justify-center shadow-lg shadow-teal-300/20">
                    <span class="font-display text-gray-900 text-2xl font-bold leading-none">NA</span>
                </div>
                <span class="font-display text-white text-2xl tracking-wide">NA Innovations</span>
            </a>
        </div>

        {{-- Card --}}
        <div class="bg-slate-800/60 backdrop-blur-2xl border border-slate-700/40 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
            <div class="h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400"></div>

            <div class="p-8 sm:p-10 text-center">
                {{-- Icon --}}
                <div class="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <svg class="w-8 h-8 text-amber-400" style="animation: pulse-slow 2s ease-in-out infinite;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h2 class="font-display text-3xl text-white tracking-wide mb-3">{{ __('Pending Approval') }}</h2>
                <p class="text-slate-400 text-sm leading-relaxed mb-6">
                    {{ __('Your account has been created successfully! It is currently pending admin approval.') }}
                </p>
                <p class="text-slate-500 text-sm leading-relaxed">
                    {{ __("You'll receive an email notification once your account has been approved. This usually takes less than 24 hours.") }}
                </p>

                {{-- Divider --}}
                <div class="border-t border-slate-700/40 my-6"></div>

                <div class="flex items-center justify-center space-x-4 text-sm">
                    <a href="{{ url('/') }}" class="text-slate-400 hover:text-teal-300 transition-colors inline-flex items-center space-x-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                        <span>{{ __('Back to website') }}</span>
                    </a>
                    <span class="text-slate-700">|</span>
                    <a href="{{ route('login') }}" class="text-slate-400 hover:text-teal-300 transition-colors">
                        {{ __('Sign in') }}
                    </a>
                </div>
            </div>
        </div>
    </div>

</body>
</html>
