import { Grid } from '@mui/material';
import { KpiCard } from '../cards/KpiCard';

// Mismo tipo interno (o podrías importarlo si decides mantener un archivo común)
interface KpiData {
    title: string;
    value: number | string;
    change?: number;
    prefix?: string;
    suffix?: string;
    trend?: 'up' | 'down' | 'neutral';
}

interface KpiGridProps {
    data: KpiData[];
}

export const KpiGrid = ({ data }: KpiGridProps) => {
    return (
        <Grid container spacing={2}>
            {data.map((kpi, index) => (
                <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                    <KpiCard {...kpi} />
                </Grid>
            ))}
        </Grid>
    );
};