import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeStore {
    // Current theme mode setting
    mode: ThemeMode;
    // The actual resolved theme (accounts for system preference)
    resolvedTheme: ResolvedTheme;
    
    // Actions
    setMode: (mode: ThemeMode) => void;
    setLight: () => void;
    setDark: () => void;
    setSystem: () => void;
    toggle: () => void;
    
    // Internal: update resolved theme based on system preference
    _updateResolvedTheme: () => void;
}

const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveTheme = (mode: ThemeMode): ResolvedTheme => {
    if (mode === 'system') {
        return getSystemTheme();
    }
    return mode;
};

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            mode: 'system',
            resolvedTheme: resolveTheme('system'),
            
            setMode: (mode: ThemeMode) => {
                set({ mode, resolvedTheme: resolveTheme(mode) });
            },
            
            setLight: () => {
                set({ mode: 'light', resolvedTheme: 'light' });
            },
            
            setDark: () => {
                set({ mode: 'dark', resolvedTheme: 'dark' });
            },
            
            setSystem: () => {
                set({ mode: 'system', resolvedTheme: getSystemTheme() });
            },
            
            toggle: () => {
                const current = get().resolvedTheme;
                const newTheme: ResolvedTheme = current === 'light' ? 'dark' : 'light';
                set({ mode: newTheme, resolvedTheme: newTheme });
            },
            
            _updateResolvedTheme: () => {
                const { mode } = get();
                if (mode === 'system') {
                    set({ resolvedTheme: getSystemTheme() });
                }
            },
        }),
        {
            name: 'ten-connect-theme',
            partialize: (state) => ({ mode: state.mode }),
            onRehydrateStorage: () => (state) => {
                // After rehydration, recalculate resolved theme
                if (state) {
                    state.resolvedTheme = resolveTheme(state.mode);
                }
            },
        }
    )
);

// Set up system theme listener (only runs in browser)
if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
        useThemeStore.getState()._updateResolvedTheme();
    });
}

