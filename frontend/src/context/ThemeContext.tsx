import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '../theme/theme';

// Tipos definidos internamente
type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    backgroundClass: string;
    toggleTheme: () => void;
    setBackgroundClass: (bgClass: string) => void;
}

// Valores por defecto
const defaultContext: ThemeContextType = {
    mode: 'light',
    backgroundClass: '',
    toggleTheme: () => { },
    setBackgroundClass: () => { },
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<ThemeMode>(
        (localStorage.getItem('theme-mode') as ThemeMode) || 'light'
    );

    const [backgroundClass, setBackgroundClass] = useState<string>(
        localStorage.getItem('theme-background') || ''
    );

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('theme-mode', newMode);
    };

    const handleSetBackground = (bgClass: string) => {
        setBackgroundClass(bgClass);
        localStorage.setItem('theme-background', bgClass);
    };

    const theme = useMemo(() => getTheme(mode), [mode]);

    return (
        <ThemeContext.Provider
            value={{
                mode,
                backgroundClass,
                toggleTheme,
                setBackgroundClass: handleSetBackground,
            }}
        >
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeMode = () => useContext(ThemeContext);