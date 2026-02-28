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
    Campaign,
    AttachMoney,
    TrendingUp,
} from '@mui/icons-material';
import { ExportButtons } from '../components/ui/ExportButtons';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

interface Campaign {
    id: string;
    name: string;
    platform: 'google' | 'meta' | 'linkedin';
    budget: number;
    spent: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'paused' | 'ended';
}

const platformOptions = [
    { value: 'google', label: 'Google Ads' },
    { value: 'meta', label: 'Meta Ads' },
    { value: 'linkedin', label: 'LinkedIn' },
];

const initialCampaigns: Campaign[] = [
    { id: '1', name: 'Brand Awareness Q1', platform: 'meta', budget: 5000, spent: 3200, startDate: '2026-01-01', endDate: '2026-03-31', status: 'active' },
    { id: '2', name: 'Remarketing Ventas', platform: 'google', budget: 3000, spent: 2100, startDate: '2026-02-01', endDate: '2026-02-28', status: 'active' },
    { id: '3', name: 'Lanzamiento Producto', platform: 'linkedin', budget: 2000, spent: 500, startDate: '2026-02-15', endDate: '2026-03-15', status: 'paused' },
    { id: '4', name: 'Inbound Marketing', platform: 'meta', budget: 4000, spent: 1800, startDate: '2026-01-15', endDate: '2026-04-15', status: 'active' },
];

export const CampaignManagement = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [open, setOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [formData, setFormData] = useState<Partial<Campaign>>({
        name: '',
        platform: 'google',
        budget: 0,
        spent: 0,
        startDate: '',
        endDate: '',
        status: 'active',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const stored = localStorage.getItem('campaigns');
            if (stored) {
                setCampaigns(JSON.parse(stored));
            } else {
                setCampaigns(initialCampaigns);
                localStorage.setItem('campaigns', JSON.stringify(initialCampaigns));
            }
            setLoading(false);
        }, 500);
    }, []);

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.platform.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [campaigns, searchTerm]);

    const handleOpen = (campaign?: Campaign) => {
        if (campaign) {
            setEditingCampaign(campaign);
            setFormData(campaign);
        } else {
            setEditingCampaign(null);
            setFormData({ name: '', platform: 'google', budget: 0, spent: 0, startDate: '', endDate: '', status: 'active' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingCampaign(null);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        if (!formData.name || !formData.platform || !formData.startDate || !formData.endDate) return;

        let updated: Campaign[];
        if (editingCampaign) {
            updated = campaigns.map(c =>
                c.id === editingCampaign.id ? { ...c, ...formData, id: c.id } as Campaign : c
            );
        } else {
            const newCampaign: Campaign = {
                id: Date.now().toString(),
                name: formData.name!,
                platform: formData.platform as any,
                budget: Number(formData.budget) || 0,
                spent: Number(formData.spent) || 0,
                startDate: formData.startDate!,
                endDate: formData.endDate!,
                status: formData.status as any,
            };
            updated = [...campaigns, newCampaign];
        }
        setCampaigns(updated);
        localStorage.setItem('campaigns', JSON.stringify(updated));
        handleClose();
    };

    const handleDelete = (campaign: Campaign) => {
        if (window.confirm('¿Eliminar campaña?')) {
            const updated = campaigns.filter(c => c.id !== campaign.id);
            setCampaigns(updated);
            localStorage.setItem('campaigns', JSON.stringify(updated));
        }
    };

    const handleExportCSV = () => {
        const columns = [
            { id: 'name', label: 'Nombre' },
            { id: 'platform', label: 'Plataforma' },
            { id: 'budget', label: 'Presupuesto' },
            { id: 'spent', label: 'Invertido' },
            { id: 'startDate', label: 'Inicio' },
            { id: 'endDate', label: 'Fin' },
            { id: 'status', label: 'Estado' },
        ];
        exportToCSV(filteredCampaigns, columns, 'campanas');
    };

    const handleExportPDF = () => {
        exportToPDF('Campañas de Marketing');
    };

    // Calcular totales con valores por defecto 0 para evitar undefined
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget ?? 0), 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + (c.spent ?? 0), 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

    const getPlatformLabel = (value: string) => {
        const opt = platformOptions.find(o => o.value === value);
        return opt ? opt.label : value;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'paused': return 'warning';
            case 'ended': return 'default';
            default: return 'default';
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
                    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                    color: 'white',
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Campañas de Marketing
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Gestiona y monitorea tus campañas publicitarias
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <ExportButtons
                            onExportCSV={handleExportCSV}
                            onExportPDF={handleExportPDF}
                            disabled={filteredCampaigns.length === 0}
                        />
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => handleOpen()}
                            sx={{
                                borderRadius: 2,
                                bgcolor: 'white',
                                color: 'warning.main',
                                py: 1.5,
                                px: 3,
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            }}
                        >
                            NUEVA CAMPAÑA
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
                                        Presupuesto Total
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                                        ${(totalBudget ?? 0).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                                    <AttachMoney sx={{ fontSize: 28 }} />
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
                                        Invertido
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="secondary.main">
                                        ${(totalSpent ?? 0).toLocaleString()}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'secondary.light', width: 56, height: 56 }}>
                                    <TrendingUp sx={{ fontSize: 28 }} />
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
                                        {activeCampaigns}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                                    <Campaign sx={{ fontSize: 28 }} />
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
                        placeholder="Buscar campañas..."
                        variant="outlined"
                        size="medium"
                        fullWidth
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                            sx: { fontSize: '1rem', py: 1.5 }
                        }}
                    />
                    <Chip label={`${filteredCampaigns.length} resultados`} color="warning" sx={{ px: 2, py: 2 }} />
                </Stack>
            </Paper>

            {/* Tabla */}
            <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {loading && <LinearProgress />}
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }}>Campaña</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }}>Plataforma</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="right">Presupuesto</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="right">Invertido</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }}>Periodo</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="center">Estado</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', py: 3, px: 4 }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCampaigns.length === 0 ? (
                                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 8 }}>No hay campañas</TableCell></TableRow>
                            ) : (
                                filteredCampaigns.map((camp) => (
                                    <TableRow key={camp.id} hover>
                                        <TableCell sx={{ py: 3, px: 4 }}>
                                            <Typography variant="body1" fontWeight="bold">{camp.name}</Typography>
                                        </TableCell>
                                        <TableCell sx={{ py: 3, px: 4 }}>{getPlatformLabel(camp.platform)}</TableCell>
                                        <TableCell align="right" sx={{ py: 3, px: 4, fontWeight: 'bold' }}>
                                            ${(camp.budget ?? 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell align="right" sx={{ py: 3, px: 4 }}>
                                            ${(camp.spent ?? 0).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ py: 3, px: 4 }}>
                                            {camp.startDate ?? ''} – {camp.endDate ?? ''}
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 3, px: 4 }}>
                                            <Chip label={camp.status} color={getStatusColor(camp.status)} size="medium" />
                                        </TableCell>
                                        <TableCell align="center" sx={{ py: 3, px: 4 }}>
                                            <IconButton color="primary" onClick={() => handleOpen(camp)} sx={{ mr: 1, p: 1.5 }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(camp)} sx={{ p: 1.5 }}>
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
                <DialogTitle sx={{ p: 3, bgcolor: 'warning.main', color: 'white' }}>
                    <Typography variant="h5">{editingCampaign ? 'Editar Campaña' : 'Nueva Campaña'}</Typography>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <TextField label="Nombre" name="name" value={formData.name ?? ''} onChange={handleChange} fullWidth required />
                        <FormControl fullWidth>
                            <InputLabel>Plataforma</InputLabel>
                            <Select name="platform" value={formData.platform ?? 'google'} label="Plataforma" onChange={handleChange}>
                                {platformOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField label="Presupuesto" name="budget" type="number" value={formData.budget ?? 0} onChange={handleChange} fullWidth />
                        <TextField label="Invertido" name="spent" type="number" value={formData.spent ?? 0} onChange={handleChange} fullWidth />
                        <TextField label="Fecha inicio" name="startDate" type="date" value={formData.startDate ?? ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                        <TextField label="Fecha fin" name="endDate" type="date" value={formData.endDate ?? ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select name="status" value={formData.status ?? 'active'} label="Estado" onChange={handleChange}>
                                <MenuItem value="active">Activa</MenuItem>
                                <MenuItem value="paused">Pausada</MenuItem>
                                <MenuItem value="ended">Finalizada</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} variant="outlined">Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" color="warning">Guardar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};