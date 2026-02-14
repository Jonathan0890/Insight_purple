import { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Sidebar } from './Sidebar';
import { useThemeMode } from '../../context/ThemeContext';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { backgroundClass, mode } = useThemeMode();

    const defaultBg = mode === 'light' ? 'bg-gray-50' : 'bg-gray-900';
    const bgClass = backgroundClass || defaultBg;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Insight Purple - Business Intelligence
                    </Typography>
                </Toolbar>
            </AppBar>

            <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - 240px)` },
                }}
            >
                <Toolbar /> {/* Espacio para el AppBar fijo */}
                <div className={`min-h-screen ${bgClass} transition-colors duration-300 p-4`}>
                    <Container maxWidth="xl">
                        {children}
                    </Container>
                </div>
            </Box>
        </Box>
    );
};