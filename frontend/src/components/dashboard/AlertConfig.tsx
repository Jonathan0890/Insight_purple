import { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Tipo para alerta configurable
interface AlertRule {
    id: string;
    metric: string;
    condition: '>' | '<' | '=';
    threshold: number;
    channel: 'email' | 'slack' | 'dashboard';
}

// Opciones de métricas disponibles
const metrics = [
    { value: 'stock', label: 'Stock crítico' },
    { value: 'cpc', label: 'CPC' },
    { value: 'conversion', label: 'Tasa de conversión' },
    { value: 'leads', label: 'Leads diarios' },
];

export const AlertConfig = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const [rules, setRules] = useState<AlertRule[]>([]);
    const [newRule, setNewRule] = useState<Partial<AlertRule>>({
        metric: 'stock',
        condition: '<',
        threshold: 10,
        channel: 'dashboard',
    });

    // Cargar reglas desde localStorage al abrir
    useEffect(() => {
        if (open) {
            const stored = localStorage.getItem('alert-rules');
            if (stored) {
                setRules(JSON.parse(stored));
            } else {
                // Reglas por defecto
                const defaultRules: AlertRule[] = [
                    { id: '1', metric: 'stock', condition: '<', threshold: 10, channel: 'dashboard' },
                    { id: '2', metric: 'cpc', condition: '>', threshold: 0.85, channel: 'email' },
                ];
                setRules(defaultRules);
                localStorage.setItem('alert-rules', JSON.stringify(defaultRules));
            }
        }
    }, [open]);

    const handleAddRule = () => {
        if (!newRule.metric || !newRule.condition || !newRule.threshold || !newRule.channel) return;
        const rule: AlertRule = {
            id: Date.now().toString(),
            metric: newRule.metric,
            condition: newRule.condition as any,
            threshold: newRule.threshold,
            channel: newRule.channel as any,
        };
        const updated = [...rules, rule];
        setRules(updated);
        localStorage.setItem('alert-rules', JSON.stringify(updated));
        setNewRule({ metric: 'stock', condition: '<', threshold: 10, channel: 'dashboard' });
    };

    const handleDeleteRule = (id: string) => {
        const updated = rules.filter(r => r.id !== id);
        setRules(updated);
        localStorage.setItem('alert-rules', JSON.stringify(updated));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Configurar Alertas Inteligentes</DialogTitle>
            <DialogContent>
                <List>
                    {rules.map((rule) => (
                        <ListItem key={rule.id} divider>
                            <ListItemText
                                primary={`${rule.metric} ${rule.condition} ${rule.threshold}`}
                                secondary={`Canal: ${rule.channel}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleDeleteRule(rule.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Métrica</InputLabel>
                        <Select
                            value={newRule.metric}
                            label="Métrica"
                            onChange={(e) => setNewRule({ ...newRule, metric: e.target.value })}
                        >
                            {metrics.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 70 }}>
                        <InputLabel>Cond.</InputLabel>
                        <Select
                            value={newRule.condition}
                            label="Cond."
                            onChange={(e) => setNewRule({ ...newRule, condition: e.target.value as any })}
                        >
                            <MenuItem value=">">{'>'}</MenuItem>
                            <MenuItem value="<">{'<'}</MenuItem>
                            <MenuItem value="=">{'='}</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        size="small"
                        label="Umbral"
                        type="number"
                        value={newRule.threshold}
                        onChange={(e) => setNewRule({ ...newRule, threshold: parseFloat(e.target.value) })}
                        sx={{ width: 100 }}
                    />

                    <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel>Canal</InputLabel>
                        <Select
                            value={newRule.channel}
                            label="Canal"
                            onChange={(e) => setNewRule({ ...newRule, channel: e.target.value as any })}
                        >
                            <MenuItem value="dashboard">Dashboard</MenuItem>
                            <MenuItem value="email">Email</MenuItem>
                            <MenuItem value="slack">Slack</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="contained" onClick={handleAddRule} startIcon={<AddIcon />}>
                        Añadir
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};