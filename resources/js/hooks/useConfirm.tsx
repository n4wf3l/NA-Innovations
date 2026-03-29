import { useState, useCallback } from 'react';
import ConfirmModal from '@/Components/ui/ConfirmModal';

interface ConfirmOptions {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function useConfirm() {
    const [state, setState] = useState<{
        open: boolean;
        options: ConfirmOptions;
        resolve: ((value: boolean) => void) | null;
    }>({
        open: false,
        options: {},
        resolve: null,
    });

    const confirm = useCallback((options: ConfirmOptions = {}): Promise<boolean> => {
        return new Promise((resolve) => {
            setState({ open: true, options, resolve });
        });
    }, []);

    const handleConfirm = () => {
        state.resolve?.(true);
        setState({ open: false, options: {}, resolve: null });
    };

    const handleClose = () => {
        state.resolve?.(false);
        setState({ open: false, options: {}, resolve: null });
    };

    const ConfirmDialog = () => (
        <ConfirmModal
            open={state.open}
            onClose={handleClose}
            onConfirm={handleConfirm}
            title={state.options.title}
            message={state.options.message}
            confirmText={state.options.confirmText}
            cancelText={state.options.cancelText}
            variant={state.options.variant}
        />
    );

    return { confirm, ConfirmDialog };
}
