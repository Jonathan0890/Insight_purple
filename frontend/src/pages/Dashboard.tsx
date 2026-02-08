import { useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

import { KpiCard } from '../components/cards/KpiCard';
import { LeadsChart } from '../components/charts/LeadsChart';
import { DateRangeFilter } from '../components/ui/DateRangeFilter';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { getDashboardSummary } from '../services/metricsService';
import { useMobile } from '../hooks/useMobile';

export const Dashboard = () => {
    const isMobile = useMobile();
    const [data, setData] = useState<any>(null);
    const [from, setFrom] = useState(dayjs().startOf('month'));
    const [to, setTo] = useState(dayjs());

    useEffect(() => {
        getDashboardSummary().then(setData);
    }, [from, to]);

    if (!data) return <p>Cargando...</p>;

    return (
        <>
            <Stack direction="row" justifyContent="space-between" mb={3}>
                <Typography variant="h5">Dashboard – Insight Purple</Typography>
                <ThemeToggle />
            </Stack>

            <DateRangeFilter from={from} to={to} onChange={setFrom} />

            <Grid container spacing={2} mt={2}>
                <Grid item xs={12} md={3}><KpiCard title="Leads" value={data.leads} /></Grid>
                <Grid item xs={12} md={3}><KpiCard title="Ventas" value={data.ventas} /></Grid>
                <Grid item xs={12} md={3}><KpiCard title="CPL" value={`$${data.cpl}`} /></Grid>
                {!isMobile && (
                    <Grid item xs={12} md={3}>
                        <KpiCard title="Conversión" value={`${data.conversion}%`} />
                    </Grid>
                )}
            </Grid>

            <Typography mt={4} mb={2}>Leads por día</Typography>
            <LeadsChart />
        </>
    );
};
