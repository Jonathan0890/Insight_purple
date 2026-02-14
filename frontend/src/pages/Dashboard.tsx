import { useEffect, useState } from 'react';
import { Stack, Typography, Box, Button } from '@mui/material';
import dayjs from 'dayjs';

import { KpiGrid } from '../components/dashboard/KpiGrid';
import { IncomeExpenseChart } from '../components/dashboard/IncomeExpenseChart';
import { SalesPipeline } from '../components/dashboard/SalesPipeline';
import { ChannelPerformance } from '../components/dashboard/ChannelPerformance';
import { TrafficDistribution } from '../components/dashboard/TrafficDistribution';
import { AlertsList } from '../components/dashboard/AlertsList';
import { DataSourceStatus } from '../components/dashboard/DataSourceStatus';
import { AlertConfig } from '../components/dashboard/AlertConfig';
import { RoleViewSelector } from '../components/dashboard/RoleViewSelector';
import { ReportExport } from '../components/dashboard/ReportExport';
import { LeadsChart } from '../components/charts/LeadsChart';
import { DateRangeFilter } from '../components/ui/DateRangeFilter';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { ThemeCustomizer } from '../components/ui/ThemeCustomizer';

// Tipos internos
interface KpiData {
    title: string;
    value: number | string;
    change?: number;
    prefix?: string;
    suffix?: string;
    trend?: 'up' | 'down' | 'neutral';
}

// Datos mock por rol (igual que antes)
const roleData: Record<string, KpiData[]> = {
    ejecutivo: [
        { title: 'Ingresos totales', value: 2.85, change: 12.5, prefix: '$', suffix: 'M', trend: 'up' },
        { title: 'Leads generados', value: 1300, change: 8.3, suffix: '', trend: 'up' },
        { title: 'Tasa de conversión', value: 4.7, change: 0.3, suffix: '%', trend: 'up' },
        { title: 'Ticket promedio', value: 185.4, change: 5.2, prefix: '$', trend: 'up' },
        { title: 'NPS Score', value: 72, change: 4, suffix: ' pts', trend: 'up' },
    ],
    marketing: [
        { title: 'Impresiones', value: 45000, change: 15.2, suffix: '', trend: 'up' },
        { title: 'CPC', value: 0.85, change: -3.1, prefix: '$', trend: 'down' },
        { title: 'ROI Ads', value: 320, change: 5.4, suffix: '%', trend: 'up' },
        { title: 'Leads por campaña', value: 230, change: 7.8, suffix: '', trend: 'up' },
        { title: 'CTR', value: 2.3, change: 0.2, suffix: '%', trend: 'up' },
    ],
    ventas: [
        { title: 'Ventas totales', value: 1.2, change: 10.2, prefix: '$', suffix: 'M', trend: 'up' },
        { title: 'Tickets cerrados', value: 42, change: 5.0, suffix: '', trend: 'up' },
        { title: 'Tiempo cierre', value: 12, change: -8.3, suffix: ' días', trend: 'down' },
        { title: 'Tasa éxito', value: 28, change: 2.1, suffix: '%', trend: 'up' },
        { title: 'Nuevas oportunidades', value: 67, change: 4.5, suffix: '', trend: 'up' },
    ],
    inventario: [
        { title: 'Stock total', value: 2340, change: -2.1, suffix: ' uds', trend: 'down' },
        { title: 'Productos críticos', value: 3, change: 50, suffix: '', trend: 'up' },
        { title: 'Rotación', value: 4.2, change: 0.3, suffix: 'x', trend: 'up' },
        { title: 'Valor inventario', value: 185.4, change: 5.2, prefix: '$', suffix: 'K', trend: 'up' },
        { title: 'Órdenes pendientes', value: 22, change: -12, suffix: '', trend: 'down' },
    ],
};

export const Dashboard = () => {
    const [role, setRole] = useState('ejecutivo');
    const [data, setData] = useState<{ kpis: KpiData[] }>({ kpis: roleData.ejecutivo });
    const [from, setFrom] = useState(dayjs().startOf('month'));
    const [to, setTo] = useState(dayjs());
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [alertConfigOpen, setAlertConfigOpen] = useState(false);

    useEffect(() => {
        setData({ kpis: roleData[role] });
    }, [role]);

    const handleOpenCustomizer = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseCustomizer = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {/* Barra superior con título y botones de acción */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold">
                    Insight Purple - Business Intelligence
                </Typography>
                <Stack direction="row" spacing={1}>
                    <ReportExport />
                    <Button variant="outlined" size="small" onClick={() => setAlertConfigOpen(true)}>
                        Configurar alertas
                    </Button>
                    <button
                        onClick={handleOpenCustomizer}
                        className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                        Personalizar fondo
                    </button>
                    <ThemeToggle />
                </Stack>
            </Stack>

            {/* Título de la vista y selector de rol + filtro de fechas */}
            <Box mb={3}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Dashboard Ejecutivo
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Vista Ejecutiva · Actualizado hace 2 minutos
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mt={2}>
                    <RoleViewSelector role={role} onRoleChange={setRole} />
                    <DateRangeFilter from={from} to={to} onChange={(newFrom, newTo) => { setFrom(newFrom); setTo(newTo); }} />
                </Stack>
            </Box>

            {/* Grid de KPIs */}
            <KpiGrid data={data.kpis} />

            {/* Dos columnas: Estado de Fuentes y Alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <DataSourceStatus />
                <AlertsList />
            </div>

            {/* Sección de análisis detallado (opcional, puedes mostrarla o no) */}
            <Typography variant="h5" mt={6} mb={2}>
                Análisis detallado
            </Typography>
            <IncomeExpenseChart />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <SalesPipeline />
                <ChannelPerformance />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <TrafficDistribution />
                <LeadsChart />
            </div>

            {/* Modales */}
            <ThemeCustomizer
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseCustomizer}
            />
            <AlertConfig open={alertConfigOpen} onClose={() => setAlertConfigOpen(false)} />
        </>
    );
};