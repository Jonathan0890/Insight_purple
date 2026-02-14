import { Card, CardContent, Typography, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Tipo interno
interface KpiData {
    title: string;
    value: number | string;
    change?: number;
    prefix?: string;
    suffix?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export const KpiCard = ({ title, value, change, prefix, suffix, trend }: KpiData) => {
    const isPositive = trend === 'up' || (change && change > 0);
    const changeColor = isPositive ? 'success.main' : 'error.main';
    const ChangeIcon = isPositive ? ArrowUpwardIcon : ArrowDownwardIcon;

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold">
                    {prefix}{value}{suffix}
                </Typography>
                {change !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <ChangeIcon sx={{ color: changeColor, fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" sx={{ color: changeColor }}>
                            {change}% vs mes anterior
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};