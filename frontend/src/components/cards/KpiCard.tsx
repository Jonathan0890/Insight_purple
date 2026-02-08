import { Card, CardContent, Typography } from '@mui/material';

export const KpiCard = ({ title, value }: any) => (
    <Card>
        <CardContent>
            <Typography variant="subtitle2">{title}</Typography>
            <Typography variant="h4" fontWeight="bold">
                {value}
            </Typography>
        </CardContent>
    </Card>
);
