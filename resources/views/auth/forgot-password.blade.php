<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>body{opacity:0}</style>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Forgot Password - NA Innovations</title>
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
            0%, 100% { box-shadow: 0 0 15px rgba(251, 191, 36, 0.15); }
            50% { box-shadow: 0 0 30px rgba(251, 191, 36, 0.3); }
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
        .input-field {
            background: rgba(15, 23, 42, 0.6);
            border: 1.5px solid rgba(71, 85, 105, 0.4);
            transition: all 0.25s ease;
        }
        .input-field:focus {
            background: rgba(15, 23, 42, 0.9);
            border-color: #5eead4;
            box-shadow: 0 0 0 4px rgba(94, 234, 212, 0.1), 0 0 20px rgba(94, 234, 212, 0.05);
        }
        .input-field::placeholder { color: #475569; }
        /* Fix Chrome/Edge autocomplete forcing white background */
        .input-field:-webkit-autofill,
        .input-field:-webkit-autofill:hover,
        .input-field:-webkit-autofill:focus,
        .input-field:-webkit-autofill:active {
            -webkit-text-fill-color: #ffffff !important;
            -webkit-box-shadow: 0 0 0 9999px #0f172a inset !important;
            box-shadow: 0 0 0 9999px #0f172a inset !important;
            background-color: #0f172a !important;
            border-color: rgba(71, 85, 105, 0.4) !important;
            transition: background-color 5000s ease-in-out 0s;
            caret-color: #ffffff;
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
    <div class="absolute top-1/2 left-1/3 w-40 h-40 bg-amber-300/5 rounded-full blur-3xl" style="animation: float 6s ease-in-out infinite 4s;"></div>

    <div class="w-full max-w-md relative z-10" x-data="{ submitting: false }">

        {{-- Logo --}}
        <div class="text-center mb-8 fade-in">
            <a href="{{ url('/') }}" class="inline-flex items-center space-x-3 group">
                <div class="w-12 h-12 bg-teal-300 rounded-xl flex items-center justify-center shadow-lg shadow-teal-300/20 group-hover:shadow-teal-300/40 transition-shadow">
                    <span class="font-display text-gray-900 text-2xl font-bold leading-none">NA</span>
                </div>
                <span class="font-display text-white text-2xl tracking-wide">NA Innovations</span>
            </a>
        </div>

        {{-- Card --}}
        <div class="bg-slate-800/60 backdrop-blur-2xl border border-slate-700/40 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
            <div class="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300"></div>

            <div class="p-8 sm:p-10">
                {{-- Icon with glow --}}
                <div class="fade-in flex justify-center mb-6">
                    <div class="relative">
                        <div class="absolute inset-0 rounded-full" style="animation: pulse-glow 3s ease-in-out infinite;"></div>
                        <div class="relative w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                            <svg class="w-8 h-8 text-amber-400" style="animation: float 3s ease-in-out infinite;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {{-- Header --}}
                <h2 class="font-display text-3xl text-white tracking-wide mb-2 text-center fade-in-d1">{{ __('Forgot Password') }}</h2>
                <p class="text-slate-400 text-sm leading-relaxed mb-6 text-center fade-in-d2">
                    {{ __('No problem. Enter your email and we\'ll send you a reset link.') }}
                </p>

                {{-- Status --}}
                @if (session('status'))
                    <div class="mb-6 rounded-lg bg-teal-300/10 border border-teal-300/20 p-3.5 text-sm text-teal-300">
                        {{ session('status') }}
                    </div>
                @endif

                {{-- Error banner --}}
                @if ($errors->any())
                    <div class="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-400">
                        @foreach ($errors->all() as $error)
                            <p>{{ $error }}</p>
                        @endforeach
                    </div>
                @endif

                <form method="POST" action="{{ route('password.email') }}" class="space-y-5 fade-in-d3" @submit="submitting = true">
                    @csrf

                    {{-- Email --}}
                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-300 mb-2">{{ __('Email') }}</label>
                        <div class="relative">
                            <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="username" placeholder="you@example.com" class="input-field w-full px-4 py-3 pr-10 rounded-xl text-white text-sm focus:outline-none" />
                            <button type="button" onclick="const e=document.getElementById('email');e.style.transition='opacity 0.15s,transform 0.15s';e.style.opacity='0';e.style.transform='translateX(8px)';setTimeout(()=>{e.value='';e.style.opacity='1';e.style.transform='translateX(0)';e.focus();},150);" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 hover:rotate-90 transition-all duration-200 p-1" title="Clear">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                    </div>

                    {{-- Submit --}}
                    <button type="submit" :disabled="submitting" class="btn-submit w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm tracking-wide flex items-center justify-center space-x-2">
                        <template x-if="!submitting">
                            <span>{{ __('Send Reset Link') }}</span>
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
                <div class="border-t border-slate-700/40 my-6 fade-in-d4"></div>

                {{-- Back to login --}}
                <div class="text-center fade-in-d4">
                    <a href="{{ route('login') }}" class="text-slate-400 hover:text-teal-300 transition-colors inline-flex items-center space-x-1.5 text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                        <span>{{ __('Back to login') }}</span>
                    </a>
                </div>
            </div>
        </div>

        {{-- Footer --}}
        <div class="mt-6 text-center text-xs text-slate-500 fade-in-d4">
            <span>&copy; {{ date('Y') }} NA Innovations</span>
        </div>
    </div>

<script>document.body.classList.add('ready');</script>
</body>
</html>
