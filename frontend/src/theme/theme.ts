import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
    createTheme({
        palette: {
            mode,
            primary: { main: '#7C3AED' },
        },
        shape: { borderRadius: 12 },
    });
