import { useState, useCallback, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

interface NavItem {
    type: 'link' | 'section';
    label: string;
    href?: string;
    icon?: string;
    match?: string;
    tourId?: string;
}

interface SidebarPrefs {
    order?: string[];
    hidden?: string[];
    accent_color?: string;
    style?: string;
}

export function useSidebarConfig(defaultItems: NavItem[]) {
    const { auth } = usePage().props as any;
    const prefs: SidebarPrefs = auth?.user?.preferences?.sidebar ?? {};

    const [items, setItems] = useState<NavItem[]>(() => applyPrefs(defaultItems, prefs));
    const [hiddenItems, setHiddenItems] = useState<string[]>(prefs.hidden ?? []);
    const [accentColor, setAccentColor] = useState(prefs.accent_color ?? '');
    const [sidebarStyle, setSidebarStyle] = useState(prefs.style ?? 'default');
    const [saving, setSaving] = useState(false);

    function applyPrefs(defaults: NavItem[], p: SidebarPrefs): NavItem[] {
        if (!p.order || p.order.length === 0) return defaults;

        const itemMap = new Map<string, NavItem>();
        const sections: { label: string; items: NavItem[] }[] = [];
        let currentSection: NavItem | null = null;

        defaults.forEach(item => {
            itemMap.set(item.label, item);
        });

        // Reorder based on saved order
        const ordered: NavItem[] = [];
        const used = new Set<string>();

        p.order.forEach(label => {
            const item = itemMap.get(label);
            if (item) {
                ordered.push(item);
                used.add(label);
            }
        });

        // Add any new items that weren't in the saved order
        defaults.forEach(item => {
            if (!used.has(item.label)) {
                ordered.push(item);
            }
        });

        return ordered;
    }

    const getVisibleItems = useCallback(() => {
        return items.filter(item => !hiddenItems.includes(item.label));
    }, [items, hiddenItems]);

    const savePreferences = useCallback(async (newOrder?: NavItem[], newHidden?: string[], newAccent?: string, newStyle?: string) => {
        setSaving(true);
        const orderToSave = (newOrder ?? items).map(i => i.label);
        const hiddenToSave = newHidden ?? hiddenItems;
        const accentToSave = newAccent ?? accentColor;
        const styleToSave = newStyle ?? sidebarStyle;

        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            await fetch('/api/sidebar-preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    sidebar_order: orderToSave,
                    hidden_items: hiddenToSave,
                    accent_color: accentToSave,
                    sidebar_style: styleToSave,
                }),
            });
        } catch (e) {
            console.error('Failed to save sidebar preferences', e);
        } finally {
            setSaving(false);
        }
    }, [items, hiddenItems, accentColor, sidebarStyle]);

    const reorderItems = useCallback((newItems: NavItem[]) => {
        setItems(newItems);
        savePreferences(newItems);
    }, [savePreferences]);

    const toggleHideItem = useCallback((label: string) => {
        const newHidden = hiddenItems.includes(label)
            ? hiddenItems.filter(l => l !== label)
            : [...hiddenItems, label];
        setHiddenItems(newHidden);
        savePreferences(undefined, newHidden);
    }, [hiddenItems, savePreferences]);

    const updateAccentColor = useCallback((color: string) => {
        setAccentColor(color);
        savePreferences(undefined, undefined, color);
    }, [savePreferences]);

    const updateStyle = useCallback((style: string) => {
        setSidebarStyle(style);
        savePreferences(undefined, undefined, undefined, style);
    }, [savePreferences]);

    const resetToDefault = useCallback(() => {
        setItems(defaultItems);
        setHiddenItems([]);
        setAccentColor('');
        setSidebarStyle('default');
        savePreferences(defaultItems, [], '', 'default');
    }, [defaultItems, savePreferences]);

    return {
        items,
        visibleItems: getVisibleItems(),
        hiddenItems,
        accentColor,
        sidebarStyle,
        saving,
        reorderItems,
        toggleHideItem,
        updateAccentColor,
        updateStyle,
        resetToDefault,
    };
}
