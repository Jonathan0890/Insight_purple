import { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '../theme/theme';

type Mode = 'light' | 'dark';

const ThemeContext = createContext({
    mode: 'light' as Mode,
    toggleTheme: () => { },
});

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<Mode>(
        (localStorage.getItem('theme') as Mode) || 'light'
    );

    const toggleTheme = () => {
        const next = mode === 'light' ? 'dark' : 'light';
        setMode(next);
        localStorage.setItem('theme', next);
    };

    const theme = useMemo(() => getTheme(mode), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeMode = () => useContext(ThemeContext);
