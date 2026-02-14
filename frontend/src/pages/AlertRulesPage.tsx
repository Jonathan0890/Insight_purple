import { useState, useEffect } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    Typography,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

interface AlertRule {
    id: string;
    metric: string;
    condition: '>' | '<' | '=';
    threshold: number;
    channel: 'email' | 'slack' | 'dashboard';
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

export const AlertRulesPage = () => {
    const [rules, setRules] = useState<AlertRule[]>([]);
    const [open, setOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
    const [formData, setFormData] = useState<Partial<AlertRule>>({
        metric: 'stock',
        condition: '<',
        threshold: 10,
        channel: 'dashboard',
    });

    useEffect(() => {
        const stored = localStorage.getItem('alert-rules');
        if (stored) {
            setRules(JSON.parse(stored));
        } else {
            const defaultRules: AlertRule[] = [
                { id: '1', metric: 'stock', condition: '<', threshold: 10, channel: 'dashboard' },
                { id: '2', metric: 'cpc', condition: '>', threshold: 0.85, channel: 'email' },
            ];
            setRules(defaultRules);
            localStorage.setItem('alert-rules', JSON.stringify(defaultRules));
        }
    }, []);

    const handleOpen = (rule?: AlertRule) => {
        if (rule) {
            setEditingRule(rule);
            setFormData(rule);
        } else {
            setEditingRule(null);
            setFormData({ metric: 'stock', condition: '<', threshold: 10, channel: 'dashboard' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingRule(null);
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            };
            updated = [...rules, newRule];
        }
        setRules(updated);
        localStorage.setItem('alert-rules', JSON.stringify(updated));
        handleClose();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Eliminar regla?')) {
            const updated = rules.filter(r => r.id !== id);
            setRules(updated);
            localStorage.setItem('alert-rules', JSON.stringify(updated));
        }
    };

    return (
        <div>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Reglas de Alerta</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Nueva Regla
                </Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Métrica</TableCell>
                            <TableCell>Condición</TableCell>
                            <TableCell>Umbral</TableCell>
                            <TableCell>Canal</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rules.map((rule) => (
                            <TableRow key={rule.id}>
                                <TableCell>{rule.metric}</TableCell>
                                <TableCell>{rule.condition}</TableCell>
                                <TableCell>{rule.threshold}</TableCell>
                                <TableCell>{rule.channel}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => handleOpen(rule)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(rule.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingRule ? 'Editar Regla' : 'Nueva Regla'}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Métrica</InputLabel>
                            <Select
                                name="metric"
                                value={formData.metric}
                                label="Métrica"
                                onChange={handleChange}
                            >
                                {metricOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                            <InputLabel>Condición</InputLabel>
                            <Select
                                name="condition"
                                value={formData.condition}
                                label="Condición"
                                onChange={handleChange}
                            >
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
                            size="small"
                        />

                        <FormControl fullWidth size="small">
                            <InputLabel>Canal</InputLabel>
                            <Select
                                name="channel"
                                value={formData.channel}
                                label="Canal"
                                onChange={handleChange}
                            >
                                {channelOptions.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};