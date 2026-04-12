<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ __('Vérification 2FA') }} - {{ config('app.name') }}</title>
    <link rel="icon" href="{{ asset('NAlogo2.png') }}" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />
    @vite('resources/js/public.ts')
    <style>
        body { font-family: 'Figtree', sans-serif; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #050812; color: #fff; }
        .card { width: 100%; max-width: 440px; margin: 1rem; padding: 2.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; backdrop-filter: blur(20px); }
        h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem; text-align: center; }
        .subtitle { font-size: 0.875rem; color: rgba(255,255,255,0.6); text-align: center; margin-bottom: 2rem; line-height: 1.5; }
        .icon-wrap { width: 64px; height: 64px; margin: 0 auto 1.5rem; border-radius: 18px; background: linear-gradient(135deg, #14b8a6, #0d9488); display: flex; align-items: center; justify-content: center; box-shadow: 0 12px 40px -12px rgba(20, 184, 166, 0.5); }
        label { display: block; font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; }
        .code-boxes { display: flex; gap: 0.5rem; justify-content: center; }
        .code-box { width: 52px; height: 64px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: #fff; font-size: 1.75rem; font-weight: 800; text-align: center; outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; font-family: 'Figtree', monospace; caret-color: #14b8a6; }
        .code-box:focus { border-color: #14b8a6; background: rgba(20,184,166,0.08); box-shadow: 0 0 0 3px rgba(20,184,166,0.2); }
        .code-box.filled { border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.06); }
        .code-input-hidden { position: absolute; opacity: 0; pointer-events: none; }
        .recovery-input { width: 100%; padding: 1rem 1.25rem; font-size: 1.1rem; font-weight: 700; text-align: center; letter-spacing: 0.1em; border-radius: 14px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); color: #fff; outline: none; transition: border-color 0.2s; font-family: 'Figtree', monospace; }
        .recovery-input:focus { border-color: #14b8a6; box-shadow: 0 0 0 3px rgba(20,184,166,0.2); }
        .recovery-input::placeholder { color: rgba(255,255,255,0.2); }
        .btn { width: 100%; padding: 1rem; margin-top: 1.5rem; border: none; border-radius: 14px; background: linear-gradient(135deg, #14b8a6, #0d9488); color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer; transition: box-shadow 0.2s, transform 0.1s; box-shadow: 0 8px 30px -8px rgba(20,184,166,0.5); }
        .btn:hover { box-shadow: 0 12px 40px -8px rgba(20,184,166,0.7); }
        .btn:active { transform: scale(0.98); }
        .error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 12px; padding: 0.75rem 1rem; margin-bottom: 1.5rem; color: #fca5a5; font-size: 0.85rem; text-align: center; }
        .help { font-size: 0.75rem; color: rgba(255,255,255,0.4); text-align: center; margin-top: 1.25rem; line-height: 1.5; }
        .help a { color: rgba(255,255,255,0.6); text-decoration: underline; }
        .toggle-link { display: block; text-align: center; margin-top: 1rem; font-size: 0.8rem; color: #14b8a6; cursor: pointer; background: none; border: none; text-decoration: underline; font-family: inherit; }
        .recovery-hint { font-size: 0.8rem; color: rgba(255,255,255,0.5); text-align: center; margin-top: 0.5rem; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon-wrap">
            <svg width="28" height="28" fill="none" stroke="#fff" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
        </div>

        <h1>{{ __('Vérification en deux étapes') }}</h1>
        <p class="subtitle" id="subtitle">{{ __("Ouvrez votre application Authenticator et entrez le code à 6 chiffres pour continuer.") }}</p>

        @if ($errors->any())
            <div class="error">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('two-factor.verify') }}" id="2fa-form">
            @csrf
            <input type="hidden" name="code" id="code-hidden" />

            <div id="totp-mode">
                <label id="code-label">{{ __('Code de vérification') }}</label>
                <div class="code-boxes" id="code-boxes">
                    <input type="text" class="code-box" maxlength="1" inputmode="numeric" autocomplete="one-time-code" data-idx="0" autofocus />
                    <input type="text" class="code-box" maxlength="1" inputmode="numeric" data-idx="1" />
                    <input type="text" class="code-box" maxlength="1" inputmode="numeric" data-idx="2" />
                    <input type="text" class="code-box" maxlength="1" inputmode="numeric" data-idx="3" />
                    <input type="text" class="code-box" maxlength="1" inputmode="numeric" data-idx="4" />
                    <input type="text" class="code-box" maxlength="1" inputmode="numeric" data-idx="5" />
                </div>
            </div>

            <div id="recovery-mode" style="display:none;">
                <label>{{ __('Code de récupération') }}</label>
                <input type="text" class="recovery-input" id="recovery-input" maxlength="10" placeholder="{{ __('Votre code de récupération') }}" />
                <p class="recovery-hint">{{ __("Entrez un de vos 8 codes de récupération à usage unique.") }}</p>
            </div>

            <button type="submit" class="btn">{{ __('Vérifier') }}</button>
        </form>

        <button class="toggle-link" id="toggle-btn" onclick="toggleRecovery()">{{ __('Utiliser un code de récupération') }}</button>

        <p class="help">
            {{ __("Vous n'avez plus accès à votre application ?") }}<br>
            <a href="/login">{{ __('Retour à la connexion') }}</a>
        </p>
    </div>

    <script>
        const boxes = document.querySelectorAll('.code-box');
        const hiddenInput = document.getElementById('code-hidden');
        const form = document.getElementById('2fa-form');

        function getCode() {
            return Array.from(boxes).map(b => b.value).join('');
        }

        function syncHidden() {
            hiddenInput.value = getCode();
        }

        boxes.forEach((box, i) => {
            box.addEventListener('input', (e) => {
                const val = e.target.value.replace(/\D/g, '');
                box.value = val.slice(0, 1);
                box.classList.toggle('filled', box.value !== '');
                syncHidden();
                if (val && i < 5) boxes[i + 1].focus();
                // Auto-submit when all 6 digits entered
                if (getCode().length === 6) form.submit();
            });
            box.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !box.value && i > 0) {
                    boxes[i - 1].focus();
                    boxes[i - 1].value = '';
                    boxes[i - 1].classList.remove('filled');
                    syncHidden();
                }
            });
            box.addEventListener('paste', (e) => {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
                paste.split('').forEach((ch, j) => {
                    if (boxes[j]) { boxes[j].value = ch; boxes[j].classList.add('filled'); }
                });
                syncHidden();
                if (paste.length >= 6) form.submit();
                else if (boxes[paste.length]) boxes[paste.length].focus();
            });
            box.addEventListener('focus', () => box.select());
        });

        let recoveryMode = false;
        function toggleRecovery() {
            recoveryMode = !recoveryMode;
            const totpDiv = document.getElementById('totp-mode');
            const recDiv = document.getElementById('recovery-mode');
            const subtitle = document.getElementById('subtitle');
            const btn = document.getElementById('toggle-btn');
            if (recoveryMode) {
                totpDiv.style.display = 'none';
                recDiv.style.display = 'block';
                subtitle.textContent = '{{ __("Entrez un de vos codes de récupération à usage unique.") }}';
                btn.textContent = '{{ __("Utiliser le code Authenticator") }}';
                document.getElementById('recovery-input').focus();
            } else {
                totpDiv.style.display = 'block';
                recDiv.style.display = 'none';
                subtitle.textContent = '{{ __("Ouvrez votre application Authenticator et entrez le code à 6 chiffres pour continuer.") }}';
                btn.textContent = '{{ __("Utiliser un code de récupération") }}';
                boxes[0].focus();
            }
        }

        // Sync recovery input to hidden field on submit
        form.addEventListener('submit', () => {
            if (recoveryMode) {
                hiddenInput.value = document.getElementById('recovery-input').value;
            } else {
                syncHidden();
            }
        });
    </script>
</body>
</html>
