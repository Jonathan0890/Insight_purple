import { useState } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Sidebar } from './Sidebar';
import { NotificationBell } from '../ui/NotificationBell';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useThemeMode } from '../../context/ThemeContext';

const drawerWidth = 260;

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { backgroundClass, mode } = useThemeMode();

    const defaultBg = mode === 'light' ? 'bg-gray-50' : 'bg-gray-900';
    const bgClass = backgroundClass || defaultBg;

    const handleDrawerOpen = () => {
        setMobileOpen(true);
    };

    const handleDrawerClose = () => {
        setMobileOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 1,
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 500 }}
                    >
                        Insight Purple - Business Intelligence
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <NotificationBell />
                        <ThemeToggle />
                    </Box>
                </Toolbar>
            </AppBar>

            <Sidebar
                mobileOpen={mobileOpen}
                onClose={handleDrawerClose}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    bgcolor: 'background.default',
                }}
            >
                <Toolbar /> {/* Espacio para el AppBar fijo */}
                <div className={bgClass}>
                    <Container
                        maxWidth={false}
                        sx={{
                            py: 4,
                            px: { xs: 3, sm: 4, md: 5 },
                        }}
                    >
                        {children}
                    </Container>
                </div>
            </Box>
        </Box>
    );
};