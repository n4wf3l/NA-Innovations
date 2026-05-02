/**
 * Global custom form validation UI.
 *
 * Suppresses the native browser validation bubble (the ugly OS-themed
 * "Veuillez renseigner ce champ" tooltip) and replaces it with a styled
 * popover anchored to the invalid field. Works for every <form> on the
 * platform without having to touch each one.
 *
 * Server-side validation (Laravel + Inertia `errors` prop) continues to
 * handle post-submit errors as before - this only intercepts the native
 * client-side constraint validation popup.
 */

let currentPopover: HTMLDivElement | null = null;
let currentTarget: HTMLElement | null = null;

function removePopover() {
    if (currentPopover) {
        currentPopover.remove();
        currentPopover = null;
    }
    if (currentTarget) {
        currentTarget.classList.remove('na-invalid-ring');
        currentTarget = null;
    }
}

function positionPopover(target: HTMLElement, popover: HTMLDivElement) {
    const rect = target.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 8;
    const left = rect.left + window.scrollX;
    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
    popover.style.maxWidth = `${Math.max(rect.width, 240)}px`;
}

function showPopover(target: HTMLElement, message: string) {
    removePopover();

    const popover = document.createElement('div');
    popover.setAttribute('role', 'alert');
    popover.className = 'na-validation-popover';
    popover.innerHTML = `
        <div class="na-validation-popover__inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span></span>
        </div>
    `;
    (popover.querySelector('span') as HTMLSpanElement).textContent = message;

    document.body.appendChild(popover);
    positionPopover(target, popover);

    currentPopover = popover;
    currentTarget = target;
    target.classList.add('na-invalid-ring');

    // Auto-dismiss
    const dismiss = () => {
        removePopover();
        target.removeEventListener('input', dismiss);
        target.removeEventListener('blur', dismiss);
        target.removeEventListener('change', dismiss);
    };
    target.addEventListener('input', dismiss);
    target.addEventListener('blur', dismiss);
    target.addEventListener('change', dismiss);

    // Reposition on scroll/resize
    const reposition = () => {
        if (currentTarget === target && currentPopover === popover) {
            positionPopover(target, popover);
        }
    };
    window.addEventListener('scroll', reposition, { passive: true, capture: true });
    window.addEventListener('resize', reposition);

    // Hide after 5s
    setTimeout(() => {
        if (currentPopover === popover) removePopover();
    }, 5000);
}

export function installCustomValidation() {
    // Capture phase so we run before any per-form handler
    document.addEventListener(
        'invalid',
        (e) => {
            const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
            if (!target || !('validationMessage' in target)) return;

            // Suppress native bubble
            e.preventDefault();

            // Only show popover for the first invalid field of a submit
            if (currentPopover) return;

            // Focus the field for accessibility
            try {
                target.focus({ preventScroll: false });
            } catch {
                /* noop */
            }

            const message = target.validationMessage || 'Ce champ est requis.';
            showPopover(target as HTMLElement, message);
        },
        true
    );

    // Also clean up on navigation
    document.addEventListener('submit', () => {
        // Let native validation re-run; popover is cleared above on next invalid
    });
}
