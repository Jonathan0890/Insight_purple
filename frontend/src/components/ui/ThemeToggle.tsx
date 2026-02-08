import { IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeMode } from '../../context/ThemeContext';

export const ThemeToggle = () => {
    const { mode, toggleTheme } = useThemeMode();
    return (
        <IconButton onClick={toggleTheme}>
            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
    );
};
