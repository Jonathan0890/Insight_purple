import { Card, CardContent, Typography } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const data = [
    { name: 'Orgánico', sesiones: 1200, conversiones: 4.2 },
    { name: 'Meta Ads', sesiones: 2300, conversiones: 5.1 },
    { name: 'Google Ads', sesiones: 1800, conversiones: 3.8 },
    { name: 'Email', sesiones: 900, conversiones: 6.5 },
    { name: 'Directo', sesiones: 700, conversiones: 7.2 },
];

export const ChannelPerformance = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Rendimiento por Canal · Sesiones y conversiones
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart layout="vertical" data={data} margin={{ left: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="sesiones" fill="#7C3AED" name="Sesiones" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};