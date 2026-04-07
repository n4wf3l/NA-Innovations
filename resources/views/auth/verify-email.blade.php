<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>body{opacity:0}</style>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Verify Email - {{ $brandCompanyName }}</title>
    <link rel="icon" href="{{ asset('NAlogo2.png') }}" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=bebas-neue:400|figtree:400,500,600,700&display=swap" rel="stylesheet" />
    @vite('resources/js/public.ts')
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
    <style>
        [x-cloak] { display: none !important; }
        body.ready { opacity: 1; transition: opacity 0.15s ease-in; }
        .font-display { font-family: 'Bebas Neue', cursive; }
        .font-body { font-family: 'Figtree', sans-serif; }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 15px rgba(94, 234, 212, 0.15); }
            50% { box-shadow: 0 0 30px rgba(94, 234, 212, 0.3); }
        }
        @keyframes pulse-icon {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
        .fade-in-d1 { animation: fadeIn 0.6s ease-out 0.1s forwards; opacity: 0; }
        .fade-in-d2 { animation: fadeIn 0.6s ease-out 0.2s forwards; opacity: 0; }
        .fade-in-d3 { animation: fadeIn 0.6s ease-out 0.3s forwards; opacity: 0; }
        .fade-in-d4 { animation: fadeIn 0.6s ease-out 0.4s forwards; opacity: 0; }
        .bg-animated {
            background: linear-gradient(-45deg, #0f172a, #1e293b, #134e4a, #0f172a);
            background-size: 400% 400%;
            animation: gradientShift 20s ease infinite;
        }
        .btn-submit {
            background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
            transition: all 0.25s ease;
        }
        .btn-submit:not(:disabled):hover {
            background: linear-gradient(135deg, #0f766e 0%, #115e59 100%);
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(13, 148, 136, 0.4);
        }
        .btn-submit:not(:disabled):active { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
    </style>
</head>
<body class="font-body antialiased bg-animated min-h-screen flex items-center justify-center p-6 relative overflow-hidden">

    {{-- Floating decorative blobs --}}
    <div class="absolute top-20 right-20 w-72 h-72 bg-teal-300/5 rounded-full blur-3xl" style="animation: float 6s ease-in-out infinite;"></div>
    <div class="absolute bottom-32 left-10 w-56 h-56 bg-teal-300/5 rounded-full blur-3xl" style="animation: float 6s ease-in-out infinite 2s;"></div>
    <div class="absolute bottom-10 right-1/4 w-44 h-44 bg-emerald-300/5 rounded-full blur-3xl" style="animation: float 6s ease-in-out infinite 4s;"></div>

    <div class="w-full max-w-md relative z-10" x-data="{ submitting: false }">

        {{-- Logo --}}
        <div class="text-center mb-8 fade-in">
            <a href="{{ url('/') }}" class="inline-flex items-center space-x-3 group">
                <div>
                    <img src="{{ $brandLogoUrl }}" alt="{{ $brandCompanyName }}" class="h-12 w-auto">
                </div>
                <span class="font-display text-white text-2xl tracking-wide">{{ $brandCompanyName }}</span>
            </a>
        </div>

        {{-- Card --}}
        <div class="bg-slate-800/60 backdrop-blur-2xl border border-slate-700/40 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
            <div class="h-1 bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400"></div>

            <div class="p-8 sm:p-10 text-center">
                {{-- Icon with glow + pulse --}}
                <div class="fade-in flex justify-center mb-6">
                    <div class="relative">
                        <div class="absolute inset-0 rounded-full" style="animation: pulse-glow 3s ease-in-out infinite;"></div>
                        <div class="relative w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                            <svg class="w-8 h-8 text-teal-400" style="animation: pulse-icon 2s ease-in-out infinite;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                    </div>
                </div>

                {{-- Header --}}
                <h2 class="font-display text-3xl text-white tracking-wide mb-2 fade-in-d1">{{ __('Check Your Email') }}</h2>
                <p class="text-slate-400 text-sm leading-relaxed mb-6 fade-in-d2">
                    {{ __('Please verify your email address by clicking the link we sent you.') }}
                </p>

                {{-- Status --}}
                @if (session('status') == 'verification-link-sent')
                    <div class="mb-6 rounded-lg bg-teal-300/10 border border-teal-300/20 p-3.5 text-sm text-teal-300">
                        {{ __('A new verification link has been sent to the email address you provided during registration.') }}
                    </div>
                @endif

                <div class="space-y-4 fade-in-d3">
                    {{-- Resend button --}}
                    <form method="POST" action="{{ route('verification.send') }}" @submit="submitting = true">
                        @csrf
                        <button type="submit" :disabled="submitting" class="btn-submit w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm tracking-wide flex items-center justify-center space-x-2">
                            <template x-if="!submitting">
                                <span>{{ __('Resend Verification Email') }}</span>
                            </template>
                            <template x-if="submitting">
                                <span class="flex items-center space-x-2">
                                    <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>{{ __('Sending...') }}</span>
                                </span>
                            </template>
                        </button>
                    </form>

                    {{-- Divider --}}
                    <div class="border-t border-slate-700/40 my-2"></div>

                    {{-- Log out --}}
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="text-slate-400 hover:text-teal-300 transition-colors text-sm inline-flex items-center space-x-1.5 mx-auto">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            <span>{{ __('Log Out') }}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {{-- Footer --}}
        <div class="mt-6 text-center text-xs text-slate-500 fade-in-d4">
            <span>&copy; {{ date('Y') }} {{ $brandCompanyName }}</span>
        </div>
    </div>

<script>document.body.classList.add('ready');</script>
</body>
</html>
