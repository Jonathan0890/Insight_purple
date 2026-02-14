import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Orgánico', value: 35 },
    { name: 'Meta Ads', value: 25 },
    { name: 'Google Ads', value: 20 },
    { name: 'Email', value: 12 },
    { name: 'Directo', value: 8 },
];

const COLORS = ['#7C3AED', '#F59E0B', '#10B981', '#EF4444', '#3B82F6'];

export const TrafficDistribution = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Distribución de Tráfico · Por fuente
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};