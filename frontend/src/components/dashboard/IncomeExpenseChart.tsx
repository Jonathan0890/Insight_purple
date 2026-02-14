import { Card, CardContent, Typography } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    ComposedChart,
} from 'recharts';

// Datos históricos + predicción (los últimos 3 meses son pronóstico)
const data = [
    { name: 'Mar', ingresos: 340, gastos: 210, prediccion: null },
    { name: 'Abr', ingresos: 300, gastos: 200, prediccion: null },
    { name: 'May', ingresos: 320, gastos: 220, prediccion: null },
    { name: 'Jun', ingresos: 350, gastos: 230, prediccion: null },
    { name: 'Jul', ingresos: 370, gastos: 250, prediccion: null },
    { name: 'Ago', ingresos: 390, gastos: 260, prediccion: null },
    { name: 'Sep', ingresos: 410, gastos: 270, prediccion: null },
    { name: 'Oct', ingresos: 380, gastos: 240, prediccion: null },
    { name: 'Nov', ingresos: 360, gastos: 225, prediccion: null },
    { name: 'Dic', ingresos: 420, gastos: 280, prediccion: 430 },
    { name: 'Ene', ingresos: 430, gastos: 290, prediccion: 440 },
    { name: 'Feb', ingresos: 400, gastos: 260, prediccion: 450 },
    { name: 'Mar (p)', ingresos: null, gastos: null, prediccion: 460 },
    { name: 'Abr (p)', ingresos: null, gastos: null, prediccion: 470 },
];

export const IncomeExpenseChart = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Ingresos vs Gastos · Últimos 12 meses + Predicción
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="ingresos" fill="#7C3AED" name="Ingresos" />
                        <Bar dataKey="gastos" fill="#EF4444" name="Gastos" />
                        <Line
                            type="monotone"
                            dataKey="prediccion"
                            stroke="#10B981"
                            strokeDasharray="5 5"
                            name="Predicción ingresos"
                            dot={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};