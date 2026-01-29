import { useThemeStore, type ThemeMode, type ResolvedTheme } from '@/stores/theme.store';

export interface UseThemeReturn {
    /** The current theme mode setting ('light', 'dark', or 'system') */
    mode: ThemeMode;
    /** The resolved theme that's actually being applied ('light' or 'dark') */
    theme: ResolvedTheme;
    /** Whether dark mode is currently active */
    isDark: boolean;
    /** Whether light mode is currently active */
    isLight: boolean;
    /** Set the theme mode */
    setMode: (mode: ThemeMode) => void;
    /** Force light mode */
    setLight: () => void;
    /** Force dark mode */
    setDark: () => void;
    /** Use system preference */
    setSystem: () => void;
    /** Toggle between light and dark (forces the mode, exits system mode) */
    toggle: () => void;
}

/**
 * Hook to access and control the TENConnect theme.
 * 
 * @example
 * ```tsx
 * const { theme, isDark, toggle, setDark, setLight, setSystem } = useTheme();
 * 
 * // Force dark mode
 * setDark();
 * 
 * // Force light mode
 * setLight();
 * 
 * // Use system preference
 * setSystem();
 * 
 * // Toggle between light and dark
 * toggle();
 * ```
 */
export function useTheme(): UseThemeReturn {
    const { mode, resolvedTheme, setMode, setLight, setDark, setSystem, toggle } = useThemeStore();
    
    return {
        mode,
        theme: resolvedTheme,
        isDark: resolvedTheme === 'dark',
        isLight: resolvedTheme === 'light',
        setMode,
        setLight,
        setDark,
        setSystem,
        toggle,
    };
}

