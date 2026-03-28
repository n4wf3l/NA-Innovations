<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login - NA Innovations</title>
    <link rel="icon" href="{{ asset('NAlogo2.png') }}" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=bebas-neue:400|figtree:400,500,600,700&display=swap" rel="stylesheet" />
    @vite('resources/js/public.ts')
    @if(config('services.turnstile.site_key'))
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
    @endif
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js"></script>
    <style>
        [x-cloak] { display: none !important; }
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
        .input-field:-webkit-autofill:focus {
            -webkit-text-fill-color: #ffffff;
            -webkit-box-shadow: 0 0 0 1000px rgba(15, 23, 42, 0.9) inset;
            border-color: rgba(71, 85, 105, 0.4);
            transition: background-color 5000s ease-in-out 0s;
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
<body class="font-body antialiased bg-animated min-h-screen">

    <div class="min-h-screen flex">

        {{-- Left side: branding --}}
        <div class="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
            {{-- Decorative blobs --}}
            <div class="absolute top-20 right-20 w-72 h-72 bg-teal-300/5 rounded-full blur-3xl" style="animation: float 6s ease-in-out infinite;"></div>
            <div class="absolute bottom-32 left-10 w-56 h-56 bg-teal-300/5 rounded-full blur-3xl" style="animation: float 6s ease-in-out infinite 2s;"></div>

            {{-- Logo --}}
            <a href="{{ url('/') }}" class="flex items-center space-x-3 group">
                <div class="w-12 h-12 bg-teal-300 rounded-xl flex items-center justify-center shadow-lg shadow-teal-300/20 group-hover:shadow-teal-300/40 transition-shadow">
                    <span class="font-display text-gray-900 text-2xl font-bold leading-none">NA</span>
                </div>
                <span class="font-display text-white text-2xl tracking-wide">NA Innovations</span>
            </a>

            {{-- Tagline --}}
            <div class="max-w-md">
                <h1 class="font-display text-7xl xl:text-8xl text-white leading-none tracking-wide">
                    Innovative<br>
                    <span class="text-teal-300">solutions</span><br>
                    designed<br>
                    for you.
                </h1>
                <p class="mt-6 text-slate-400 text-lg">Web Development, Mobile & Software</p>
            </div>

            {{-- Copyright --}}
            <p class="text-slate-600 text-sm">&copy; {{ date('Y') }} NA Innovations. All rights reserved.</p>
        </div>

        {{-- Right side: login form --}}
        <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8" x-data="{
            submitting: false,
            showPassword: false,
            msgIndex: 0,
            messages: [
                '{{ __('Signing in...') }}',
                '{{ __('Verifying credentials...') }}',
                '{{ __('Preparing your dashboard...') }}',
                '{{ __('Almost there...') }}',
                '{{ __('Loading your data...') }}',
                '{{ __('Just a moment...') }}'
            ],
            startMessages() {
                this.submitting = true;
                this.msgIndex = 0;
                setInterval(() => {
                    if (this.msgIndex < this.messages.length - 1) this.msgIndex++;
                }, 2500);
            }
        }">
            <div class="w-full max-w-[420px]">

                {{-- Mobile logo --}}
                <div class="lg:hidden text-center mb-10">
                    <a href="{{ url('/') }}" class="inline-flex items-center space-x-3">
                        <div class="w-10 h-10 bg-teal-300 rounded-xl flex items-center justify-center">
                            <span class="font-display text-gray-900 text-xl font-bold leading-none">NA</span>
                        </div>
                        <span class="font-display text-white text-xl tracking-wide">NA Innovations</span>
                    </a>
                </div>

                {{-- Card --}}
                <div class="bg-slate-800/60 backdrop-blur-2xl border border-slate-700/40 rounded-2xl shadow-2xl shadow-black/20 overflow-hidden">
                    <div class="h-1 bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400"></div>

                    <div class="p-8 sm:p-10">
                        {{-- Header --}}
                        <div class="mb-8">
                            <h2 class="font-display text-3xl text-white tracking-wide">{{ __('Welcome back') }}</h2>
                            <p class="mt-1.5 text-slate-400 text-sm">{{ __('Sign in to your dashboard') }}</p>
                        </div>

                        {{-- Session Status --}}
                        @if (session('status'))
                            <div class="mb-6 rounded-lg bg-teal-300/10 border border-teal-300/20 p-3.5 text-sm text-teal-300">
                                {{ session('status') }}
                            </div>
                        @endif

                        {{-- Error banner --}}
                        @if ($errors->any())
                            <div class="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-3.5 text-sm text-red-400">
                                {{ __('Invalid credentials. Please try again.') }}
                            </div>
                        @endif

                        <form method="POST" action="{{ route('login') }}" class="space-y-5" @submit="startMessages()">
                            @csrf

                            {{-- Email --}}
                            <div>
                                <label for="email" class="block text-sm font-medium text-slate-300 mb-2">{{ __('Email') }}</label>
                                <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus autocomplete="username" placeholder="you@example.com" class="input-field w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none" />
                            </div>

                            {{-- Password --}}
                            <div>
                                <div class="flex items-center justify-between mb-2">
                                    <label for="password" class="block text-sm font-medium text-slate-300">{{ __('Password') }}</label>
                                    @if (Route::has('password.request'))
                                        <a href="{{ route('password.request') }}" class="text-xs text-teal-300/70 hover:text-teal-300 transition-colors">{{ __('Forgot password?') }}</a>
                                    @endif
                                </div>
                                <div class="relative">
                                    <input
                                        id="password"
                                        :type="showPassword ? 'text' : 'password'"
                                        name="password"
                                        required
                                        autocomplete="current-password"
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

                            {{-- Remember me --}}
                            <label for="remember_me" class="inline-flex items-center cursor-pointer group">
                                <input id="remember_me" type="checkbox" name="remember" class="w-4 h-4 rounded border-slate-600 bg-slate-700/50 text-teal-300 focus:ring-teal-300/20 focus:ring-offset-0" />
                                <span class="ml-2.5 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{{ __('Remember me') }}</span>
                            </label>

                            {{-- Cloudflare Turnstile --}}
                            @if(config('services.turnstile.site_key'))
                                <div class="cf-turnstile flex justify-center" data-sitekey="{{ config('services.turnstile.site_key') }}" data-theme="dark" data-callback="onTurnstileSuccess"></div>
                                @error('captcha')
                                    <p class="text-sm text-red-400 text-center">{{ $message }}</p>
                                @enderror
                            @endif

                            {{-- Submit --}}
                            <button type="submit" :disabled="submitting" class="btn-submit w-full py-3.5 px-4 rounded-xl text-white font-semibold text-sm tracking-wide flex items-center justify-center space-x-2">
                                <template x-if="!submitting">
                                    <span>{{ __('Sign in') }}</span>
                                </template>
                                <template x-if="submitting">
                                    <span class="flex items-center space-x-2">
                                        <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span x-text="messages[msgIndex]" style="transition: opacity 0.3s ease;"></span>
                                    </span>
                                </template>
                            </button>
                        </form>
                    </div>
                </div>

                {{-- Footer --}}
                <div class="mt-6 flex items-center justify-between text-xs text-slate-500">
                    <a href="{{ url('/') }}" class="hover:text-teal-300 transition-colors inline-flex items-center space-x-1">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
                        <span>{{ __('Back to website') }}</span>
                    </a>
                    <span class="lg:hidden">&copy; {{ date('Y') }} NA Innovations</span>
                </div>

            </div>
        </div>

    </div>

</body>
</html>
