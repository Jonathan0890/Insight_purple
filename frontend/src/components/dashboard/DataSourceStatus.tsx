import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SyncIcon from '@mui/icons-material/Sync';

// Datos mock de fuentes
const sources = [
    { name: 'Google Analytics', status: 'online', lastSync: 'hace 5 min', icon: <CheckCircleIcon color="success" /> },
    { name: 'Meta Ads', status: 'online', lastSync: 'hace 12 min', icon: <CheckCircleIcon color="success" /> },
    { name: 'CRM Interno', status: 'online', lastSync: 'hace 3 min', icon: <CheckCircleIcon color="success" /> },
    { name: 'Inventario', status: 'warning', lastSync: 'hace 2 horas', icon: <ErrorIcon color="warning" /> },
    { name: 'Google Search Console', status: 'offline', lastSync: 'hace 1 día', icon: <ErrorIcon color="error" /> },
];

export const DataSourceStatus = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Estado de Fuentes de Datos
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {sources.map((source) => (
                        <Box key={source.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {source.icon}
                                <Typography variant="body2">{source.name}</Typography>
                            </Box>
                            <Chip
                                size="small"
                                label={source.lastSync}
                                icon={<SyncIcon />}
                                variant="outlined"
                            />
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};