import { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch,
    Typography,
    Stack,
    Button,
    Chip,
} from '@mui/material';
import { Sync } from '@mui/icons-material';

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
    const [sources, setSources] = useState<DataSource[]>(initialSources);

    const handleToggle = (index: number) => {
        const updated = [...sources];
        updated[index].enabled = !updated[index].enabled;
        setSources(updated);
    };

    const handleSync = (index: number) => {
        // Simular sincronización
        const updated = [...sources];
        updated[index].lastSync = 'ahora mismo';
        updated[index].status = 'online';
        setSources(updated);
        alert(`Sincronizando ${updated[index].name}... (simulado)`);
    };

    return (
        <div>
            <Typography variant="h5" mb={2}>Fuentes de Datos</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Fuente</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Última sincronización</TableCell>
                            <TableCell>Habilitada</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sources.map((source, index) => (
                            <TableRow key={source.name}>
                                <TableCell>{source.name}</TableCell>
                                <TableCell>{source.type}</TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={source.status}
                                        color={source.status === 'online' ? 'success' : source.status === 'warning' ? 'warning' : 'error'}
                                    />
                                </TableCell>
                                <TableCell>{source.lastSync}</TableCell>
                                <TableCell>
                                    <Switch checked={source.enabled} onChange={() => handleToggle(index)} />
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<Sync />}
                                        onClick={() => handleSync(index)}
                                    >
                                        Sincronizar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};