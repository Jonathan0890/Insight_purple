import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { day: 'Lun', leads: 10 },
    { day: 'Mar', leads: 20 },
    { day: 'Mié', leads: 30 },
    { day: 'Jue', leads: 25 },
    { day: 'Vie', leads: 40 },
];

export const LeadsChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line dataKey="leads" stroke="#7C3AED" strokeWidth={3} />
        </LineChart>
    </ResponsiveContainer>
);
