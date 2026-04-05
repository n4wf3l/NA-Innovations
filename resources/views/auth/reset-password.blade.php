<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>body{opacity:0}</style>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Reset Password - NA Innovations</title>
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
        .input-field[readonly] {
            opacity: 0.5;
            cursor: not-allowed;
        }
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
    <div class="absolute top-1/3 left-2/3 w-48 h-48 bg-teal-400/5 rounded-full blur-3xl" style="animation: float 6s ease-in-out infinite 3s;"></div>

    <div class="w-full max-w-md relative z-10" x-data="{ submitting: false, showPassword: false, showConfirmPassword: false }">

        {{-- Logo --}}
        <div class="text-center mb-8 fade-in">
            <a href="{{ url('/') }}" class="inline-flex items-center space-x-3 group">
                <div>
                    <img src="{{ asset('white-logo-small.png') }}" alt="NA Innovations" class="h-12 w-auto">
                </div>
                <span class="font-display text-white text-2xl tracking-wide">NA Innovations</span>
            </a>
        </div>

        {{-- Card --}}
        <div class="bg-slate-800/60 backdrop-blur-2xl border border-slate-700/40 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
            <div class="h-1 bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400"></div>

            <div class="p-8 sm:p-10">
                {{-- Icon with glow --}}
                <div class="fade-in flex justify-center mb-6">
                    <div class="relative">
                        <div class="absolute inset-0 rounded-full" style="animation: pulse-glow 3s ease-in-out infinite;"></div>
                        <div class="relative w-16 h-16 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                            <svg class="w-8 h-8 text-teal-400" style="animation: float 3s ease-in-out infinite;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {{-- Header --}}
                <h2 class="font-display text-3xl text-white tracking-wide mb-2 text-center fade-in-d1">{{ __('New Password') }}</h2>
                <p class="text-slate-400 text-sm leading-relaxed mb-6 text-center fade-in-d2">
                    {{ __('Choose a strong password for your account.') }}
                </p>

                {{-- Error banner --}}
                @if ($errors->any())
                    <div class="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-400">
                        @foreach ($errors->all() as $error)
                            <p>{{ $error }}</p>
                        @endforeach
                    </div>
                @endif

                <form method="POST" action="{{ route('password.store') }}" class="space-y-5 fade-in-d3" @submit="submitting = true">
                    @csrf

                    {{-- Token --}}
                    <input type="hidden" name="token" value="{{ $request->route('token') }}">

                    {{-- Email (readonly) --}}
                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-300 mb-2">{{ __('Email') }}</label>
                        <input id="email" type="email" name="email" value="{{ old('email', $request->email) }}" required readonly autocomplete="username" class="input-field w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none" />
                    </div>

                    {{-- Password --}}
                    <div>
                        <label for="password" class="block text-sm font-medium text-slate-300 mb-2">{{ __('Password') }}</label>
                        <div class="relative">
                            <input
                                id="password"
                                :type="showPassword ? 'text' : 'password'"
                                name="password"
                                required
                                autofocus
                                autocomplete="new-password"
                                placeholder="••••••••"
                                class="input-field w-full px-4 py-3 pr-12 rounded-xl text-white text-sm focus:outline-none"
                            />
                            <button
                                type="button"
                                @click="showPassword = !showPassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                            >
                                {{-- Eye open --}}
                                <svg x-show="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {{-- Eye closed --}}
                                <svg x-show="showPassword" x-cloak class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {{-- Confirm Password --}}
                    <div>
                        <label for="password_confirmation" class="block text-sm font-medium text-slate-300 mb-2">{{ __('Confirm Password') }}</label>
                        <div class="relative">
                            <input
                                id="password_confirmation"
                                :type="showConfirmPassword ? 'text' : 'password'"
                                name="password_confirmation"
                                required
                                autocomplete="new-password"
                                placeholder="••••••••"
                                class="input-field w-full px-4 py-3 pr-12 rounded-xl text-white text-sm focus:outline-none"
                            />
                            <button
                                type="button"
                                @click="showConfirmPassword = !showConfirmPassword"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                            >
                                {{-- Eye open --}}
                                <svg x-show="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {{-- Eye closed --}}
                                <svg x-show="showConfirmPassword" x-cloak class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {{-- Submit --}}
                    <button type="submit" :disabled="submitting" class="btn-submit w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm tracking-wide flex items-center justify-center space-x-2">
                        <template x-if="!submitting">
                            <span>{{ __('Reset Password') }}</span>
                        </template>
                        <template x-if="submitting">
                            <span class="flex items-center space-x-2">
                                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>{{ __('Resetting...') }}</span>
                            </span>
                        </template>
                    </button>
                </form>
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
