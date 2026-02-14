import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Badge } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const alerts = [
    { id: 1, title: 'Stock crítico: Mouse Ergónico', description: '8 unidades', time: 'Hace 12 min', severity: 'error' },
    { id: 2, title: 'CPC de "Brand Awareness Q1" supera umbral', description: '$0.85', time: 'Hace 45 min', severity: 'warning' },
    { id: 3, title: 'Stock crítico: Cable HDMI 2.1', description: '5 unidades', time: 'Hace 1h', severity: 'error' },
    { id: 4, title: 'Tasa de conversión baja en Meta Ads', description: '2.1% vs objetivo 3%', time: 'Hace 2h', severity: 'warning' },
    { id: 5, title: 'Nuevo lead de alta prioridad', description: 'Empresa XYZ', time: 'Hace 3h', severity: 'info' },
];

export const AlertsList = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Alertas Activas · 5 notificaciones
                </Typography>
                <List dense>
                    {alerts.map((alert) => (
                        <ListItem key={alert.id} divider>
                            <ListItemIcon>
                                {alert.severity === 'error' ? (
                                    <WarningIcon color="error" />
                                ) : alert.severity === 'warning' ? (
                                    <WarningIcon color="warning" />
                                ) : (
                                    <InfoIcon color="info" />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                primary={alert.title}
                                secondary={
                                    <>
                                        {alert.description} · {alert.time}
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};