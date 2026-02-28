import { useState, useEffect, useMemo } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Typography,
    Chip,
    Box,
    Paper,
    Alert,
    IconButton,
    InputAdornment,
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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Add,
    Search,
    Edit,
    Delete,
    NotificationsActive,
    Warning,
} from '@mui/icons-material';
import { ExportButtons } from '../components/ui/ExportButtons';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

interface AlertRule {
    id: string;
    metric: string;
    condition: '>' | '<' | '=';
    threshold: number;
    channel: 'email' | 'slack' | 'dashboard';
    active: boolean;
}

const metricOptions = [
    { value: 'stock', label: 'Stock crítico' },
    { value: 'cpc', label: 'CPC' },
    { value: 'conversion', label: 'Tasa de conversión' },
    { value: 'leads', label: 'Leads diarios' },
];

const channelOptions = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'email', label: 'Email' },
    { value: 'slack', label: 'Slack' },
];

const initialRules: AlertRule[] = [
    { id: '1', metric: 'stock', condition: '<', threshold: 10, channel: 'dashboard', active: true },
    { id: '2', metric: 'cpc', condition: '>', threshold: 0.85, channel: 'email', active: true },
    { id: '3', metric: 'conversion', condition: '<', threshold: 2.5, channel: 'slack', active: false },
    { id: '4', metric: 'leads', condition: '<', threshold: 50, channel: 'dashboard', active: true },
];

export const AlertRulesPage = () => {
    const [rules, setRules] = useState<AlertRule[]>([]);
    const [open, setOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
    const [formData, setFormData] = useState<Partial<AlertRule>>({
        metric: 'stock',
        condition: '<',
        threshold: 10,
        channel: 'dashboard',
        active: true,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const stored = localStorage.getItem('alert-rules');
            if (stored) {
                setRules(JSON.parse(stored));
            } else {
                setRules(initialRules);
                localStorage.setItem('alert-rules', JSON.stringify(initialRules));
            }
            setLoading(false);
        }, 500);
    }, []);

    const filteredRules = useMemo(() => {
        return rules.filter(rule =>
            rule.metric.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rule.channel.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [rules, searchTerm]);

    const handleOpen = (rule?: AlertRule) => {
        if (rule) {
            setEditingRule(rule);
            setFormData(rule);
        } else {
            setEditingRule(null);
            setFormData({ metric: 'stock', condition: '<', threshold: 10, channel: 'dashboard', active: true });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRule(null);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        if (!formData.metric || !formData.condition || !formData.threshold || !formData.channel) return;

        let updated: AlertRule[];
        if (editingRule) {
            updated = rules.map(r =>
                r.id === editingRule.id ? { ...r, ...formData, id: r.id } as AlertRule : r
            );
        } else {
            const newRule: AlertRule = {
                id: Date.now().toString(),
                metric: formData.metric as string,
                condition: formData.condition as any,
                threshold: Number(formData.threshold),
                channel: formData.channel as any,
                active: formData.active ?? true,
            };
            updated = [...rules, newRule];
        }
        setRules(updated);
        localStorage.setItem('alert-rules', JSON.stringify(updated));
        handleClose();
    };

    const handleDelete = (rule: AlertRule) => {
        if (window.confirm('¿Eliminar regla?')) {
            const updated = rules.filter(r => r.id !== rule.id);
            setRules(updated);
            localStorage.setItem('alert-rules', JSON.stringify(updated));
        }
    };

    const handleExportCSV = () => {
        const columns = [
            { id: 'metric', label: 'Métrica' },
            { id: 'condition', label: 'Condición' },
            { id: 'threshold', label: 'Umbral' },
            { id: 'channel', label: 'Canal' },
            { id: 'active', label: 'Activa' },
        ];
        exportToCSV(filteredRules, columns, 'reglas-alerta');
    };

    const handleExportPDF = () => {
        exportToPDF('Reglas de Alerta');
    };

    const totalRules = rules.length;
    const activeRules = rules.filter(r => r.active).length;
    const inactiveRules = rules.filter(r => !r.active).length;

    const getMetricLabel = (value: string) => {
        const opt = metricOptions.find(o => o.value === value);
        return opt ? opt.label : value;
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
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Reglas de Alerta
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Configura notificaciones automáticas para KPIs críticos
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <ExportButtons
                            onExportCSV={handleExportCSV}
                            onExportPDF={handleExportPDF}
                            disabled={filteredRules.length === 0}
                        />
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleOpen()}
                            sx={{
                                borderRadius: 2,
                                bgcolor: 'white',
                                color: 'secondary.main',
                                py: 1.5,
                                px: 3,
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            }}
                        >
                            NUEVA REGLA
                        </Button>
                    </Stack>
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
                                        Total Reglas
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold">
                                        {totalRules}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'info.light', width: 56, height: 56 }}>
                                    <NotificationsActive sx={{ fontSize: 28 }} />
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
                                        Activas
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="success.main">
                                        {activeRules}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                                    <NotificationsActive sx={{ fontSize: 28 }} />
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
                                        Inactivas
                                    </Typography>
                                    <Typography variant="h3" fontWeight="bold" color="text.secondary">
                                        {inactiveRules}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
                                    <Warning sx={{ fontSize: 28 }} />
                                </Avatar>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Búsqueda */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        placeholder="Buscar por métrica o canal..."
                        variant="outlined"
                        size="medium"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            sx: { fontSize: '1rem', py: 1.5 }
                        }}
                    />
                    <Chip label={`${filteredRules.length} resultados`} color="secondary" sx={{ px: 2, py: 2 }} />
                </Stack>
            </Paper>

            {/* Tabla */}
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {loading && <LinearProgress />}
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }}>Métrica</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="center">Condición</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="right">Umbral</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="center">Canal</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="center">Estado</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRules.length === 0 ? (
                                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 8 }}>No hay reglas</TableCell></TableRow>
                            ) : (
                                filteredRules.map((rule) => (
                                    <TableRow key={rule.id} hover>
                                        <TableCell sx={{ py: 3, px: 4 }}>{getMetricLabel(rule.metric)}</TableCell>
                                        <TableCell align="center" sx={{ py: 3, px: 4 }}>
                                            <Chip label={rule.condition} size="medium" sx={{ minWidth: 50, fontSize: '1rem' }} />
                                        </TableCell>
                                        <TableCell align="right" sx={{ py: 3, px: 4, fontWeight: 'bold' }}>{rule.threshold}</TableCell>
                                        <TableCell align="center" sx={{ py: 3, px: 4 }}>
                                            <Chip label={rule.channel} size="medium" variant="outlined" />
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 3, px: 4 }}>
                                            <Chip
                                                label={rule.active ? 'Activa' : 'Inactiva'}
                                                color={rule.active ? 'success' : 'default'}
                                                size="medium"
                                            />
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 3, px: 4 }}>
                                            <IconButton color="primary" onClick={() => handleOpen(rule)} sx={{ mr: 1, p: 1.5 }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(rule)} sx={{ p: 1.5 }}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Modal */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ p: 3, bgcolor: 'secondary.main', color: 'white' }}>
                    <Typography variant="h5">{editingRule ? 'Editar Regla' : 'Nueva Regla'}</Typography>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <FormControl fullWidth>
                            <InputLabel>Métrica</InputLabel>
                            <Select name="metric" value={formData.metric} label="Métrica" onChange={handleChange}>
                                {metricOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Condición</InputLabel>
                            <Select name="condition" value={formData.condition} label="Condición" onChange={handleChange}>
                                <MenuItem value=">">{'>'}</MenuItem>
                                <MenuItem value="<">{'<'}</MenuItem>
                                <MenuItem value="=">{'='}</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Umbral"
                            name="threshold"
                            type="number"
                            value={formData.threshold}
                            onChange={handleChange}
                            fullWidth
                        />
                        <FormControl fullWidth>
                            <InputLabel>Canal</InputLabel>
                            <Select name="channel" value={formData.channel} label="Canal" onChange={handleChange}>
                                {channelOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select name="active" value={formData.active} label="Estado" onChange={handleChange}>
                                <MenuItem value="true">Activa</MenuItem>
                                <MenuItem value="false">Inactiva</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} variant="outlined">Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" color="secondary">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};