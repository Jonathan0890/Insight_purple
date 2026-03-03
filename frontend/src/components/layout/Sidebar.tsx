import {
    Drawer,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Box,
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CampaignIcon from '@mui/icons-material/Campaign';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ mobileOpen, onClose }: SidebarProps) => {
    const { t } = useTranslation("sidebar");
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { key: 'dashboard', icon: <DashboardIcon />, path: '/' },
        { key: 'productos', icon: <InventoryIcon />, path: '/productos' },
        { key: 'campañas', icon: <CampaignIcon />, path: '/campanas' },
        { key: 'alerta', icon: <NotificationsActiveIcon />, path: '/alertas' },
        { key: 'sources', icon: <DataUsageIcon />, path: '/fuentes' },
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose(); // ✅ Cierra SIEMPRE el drawer en móvil
    };

    const drawerContent = (
        <div>
            <Toolbar
                sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '& .MuiTypography-root': {
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                    },
                }}
            >
                <Typography variant="h6" noWrap component="div">
                    Insight Purple
                </Typography>
            </Toolbar>

            <Divider />

            <List sx={{ pt: 2 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem key={item.key} disablePadding sx={{ px: 1, mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavigate(item.path)}
                                selected={isActive}
                                sx={{
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.light',
                                        color: 'primary.main',
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.main',
                                        },
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? 'primary.main' : 'inherit',
                                        minWidth: 40,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={t(item.key)}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    return (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            {/* Drawer móvil */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{
                    disableScrollLock: true, // ✅ evita bloqueos raros
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Drawer escritorio */}
            <Drawer
                variant="permanent"
                open
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                        borderRight: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};