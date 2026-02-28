import { useState, useEffect } from 'react';
import {
    Stack,
    Typography,
    Chip,
    Box,
    Paper,
    IconButton,
    Grid,
    Card,
    CardContent,
    Avatar,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Container,
    Button,
    Switch,
} from '@mui/material';
import {
    DataUsage,
    Sync,
    CheckCircle,
    Error,
    Warning,
    CloudDone,
    CloudOff,
} from '@mui/icons-material';
import { ExportButtons } from '../components/ui/ExportButtons';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

interface DataSource {
    name: string;
    type: string;
    status: 'online' | 'offline' | 'warning';
    lastSync: string;
    enabled: boolean;
}

const initialSources: DataSource[] = [
    { name: 'Google Analytics', type: 'Analytics', status: 'online', lastSync: 'hace 5 min', enabled: true },
    { name: 'Meta Ads', type: 'Publicidad', status: 'online', lastSync: 'hace 12 min', enabled: true },
    { name: 'CRM Interno', type: 'CRM', status: 'online', lastSync: 'hace 3 min', enabled: true },
    { name: 'Inventario', type: 'ERP', status: 'warning', lastSync: 'hace 2 horas', enabled: true },
    { name: 'Google Search Console', type: 'SEO', status: 'offline', lastSync: 'hace 1 día', enabled: false },
];

export const DataSourcesPage = () => {
    const [sources, setSources] = useState<DataSource[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const stored = localStorage.getItem('data-sources');
            if (stored) {
                setSources(JSON.parse(stored));
            } else {
                setSources(initialSources);
                localStorage.setItem('data-sources', JSON.stringify(initialSources));
            }
            setLoading(false);
        }, 500);
    }, []);

    const handleToggle = (index: number) => {
        const updated = [...sources];
        updated[index].enabled = !updated[index].enabled;
        setSources(updated);
        localStorage.setItem('data-sources', JSON.stringify(updated));
    };

    const handleSync = (index: number) => {
        // Simulación
        const updated = [...sources];
        updated[index].lastSync = 'ahora mismo';
        updated[index].status = 'online';
        setSources(updated);
        localStorage.setItem('data-sources', JSON.stringify(updated));
        alert(`Sincronizando ${updated[index].name}... (simulado)`);
    };

    const handleExportCSV = () => {
        const columns = [
            { id: 'name', label: 'Fuente' },
            { id: 'type', label: 'Tipo' },
            { id: 'status', label: 'Estado' },
            { id: 'lastSync', label: 'Última sincronización' },
            { id: 'enabled', label: 'Habilitada' },
        ];
        exportToCSV(sources, columns, 'fuentes-datos');
    };

    const handleExportPDF = () => {
        exportToPDF('Fuentes de Datos');
    };

    const onlineCount = sources.filter(s => s.status === 'online' && s.enabled).length;
    const warningCount = sources.filter(s => s.status === 'warning').length;
    const offlineCount = sources.filter(s => s.status === 'offline').length;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'online': return <CheckCircle color="success" />;
            case 'warning': return <Warning color="warning" />;
            case 'offline': return <Error color="error" />;
            default: return <CloudOff />;
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Cabecera */}
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Fuentes de Datos
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Conecta y sincroniza tus plataformas externas
                        </Typography>
                    </Box>
                    <ExportButtons
                        onExportCSV={handleExportCSV}
                        onExportPDF={handleExportPDF}
                        disabled={sources.length === 0}
                    />
                </Stack>
            </Paper>

            {/* Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom variant="body2">
                                        Conectadas
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="success.main">
                                        {onlineCount}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                                    <CloudDone sx={{ fontSize: 28 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom variant="body2">
                                        Con advertencias
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="warning.main">
                                        {warningCount}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
                                    <Warning sx={{ fontSize: 28 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card elevation={2} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color="text.secondary" gutterBottom variant="body2">
                                        Desconectadas
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="error.main">
                                        {offlineCount}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'error.light', width: 56, height: 56 }}>
                                    <CloudOff sx={{ fontSize: 28 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tabla */}
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {loading && <LinearProgress />}
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }}>Fuente</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }}>Tipo</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="center">Estado</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }}>Última sincronización</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="center">Habilitada</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sources.map((source, index) => (
                                <TableRow key={source.name} hover>
                                    <TableCell sx={{ py: 3, px: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.light' }}>
                                                {source.name.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body1" fontWeight="bold">{source.name}</Typography>
                                                <Typography variant="body2" color="text.secondary">{source.type}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ py: 3, px: 4 }}>{source.type}</TableCell>
                                    <TableCell align="center" sx={{ py: 3, px: 4 }}>
                                        <Chip
                                            icon={getStatusIcon(source.status)}
                                            label={source.status}
                                            color={source.status === 'online' ? 'success' : source.status === 'warning' ? 'warning' : 'error'}
                                            size="medium"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ py: 3, px: 4 }}>{source.lastSync}</TableCell>
                                    <TableCell align="center" sx={{ py: 3, px: 4 }}>
                                        <Switch checked={source.enabled} onChange={() => handleToggle(index)} />
                                    </TableCell>
                                    <TableCell align="center" sx={{ py: 3, px: 4 }}>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Sync />}
                                            onClick={() => handleSync(index)}
                                            size="medium"
                                            sx={{ px: 3, py: 1 }}
                                        >
                                            Sincronizar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Container>
    );
};