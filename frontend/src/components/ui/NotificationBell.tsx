import { useState } from 'react';
import {
    IconButton,
    Badge,
    Popover,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Button,
    Chip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAsRead = (id: string) => {
        markAsRead(id);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
        // Opcional: cerrar después
    };

    const getIcon = (severity: string) => {
        switch (severity) {
            case 'info': return <InfoIcon color="info" />;
            case 'warning': return <WarningIcon color="warning" />;
            case 'error': return <ErrorIcon color="error" />;
            case 'success': return <CheckCircleIcon color="success" />;
            default: return <InfoIcon />;
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notification-popover' : undefined;

    return (
        <>
            <IconButton onClick={handleClick} color="inherit">
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: { width: 360, maxHeight: 480, borderRadius: 2 }
                }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Notificaciones</Typography>
                    {unreadCount > 0 && (
                        <Button size="small" onClick={handleMarkAllAsRead}>
                            Marcar todas como leídas
                        </Button>
                    )}
                </Box>
                <Divider />
                {notifications.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">No hay notificaciones</Typography>
                    </Box>
                ) : (
                    <List sx={{ py: 0 }}>
                        {notifications.map((notif) => (
                            <ListItem
                                key={notif.id}
                                alignItems="flex-start"
                                sx={{
                                    bgcolor: notif.read ? 'transparent' : 'action.hover',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.selected' },
                                }}
                                onClick={() => handleMarkAsRead(notif.id)}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    {getIcon(notif.severity)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={notif.title}
                                    secondary={
                                        <>
                                            <Typography variant="caption" component="span" color="text.secondary">
                                                {notif.description}
                                            </Typography>
                                            <br />
                                            <Typography variant="caption" color="text.secondary">
                                                {notif.time}
                                            </Typography>
                                        </>
                                    }
                                    primaryTypographyProps={{ fontWeight: notif.read ? 400 : 600 }}
                                />
                                <Chip
                                    label={notif.severity}
                                    size="small"
                                    color={notif.severity === 'error' ? 'error' : notif.severity === 'warning' ? 'warning' : 'info'}
                                    sx={{ ml: 1, textTransform: 'capitalize' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Popover>
        </>
    );
};