import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';

const pipelineStages = [
    { name: 'Prospecto', count: 485, amount: 1250 },
    { name: 'Contactado', count: 312, amount: 890 },
    { name: 'Propuesta', count: 148, amount: 620 },
    { name: 'Negociación', count: 67, amount: 385 },
    { name: 'Cerrado', count: 42, amount: 285 },
];

export const SalesPipeline = () => {
    const maxAmount = Math.max(...pipelineStages.map(s => s.amount));

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Pipeline de Ventas · Embuto actual
                </Typography>
                <Box sx={{ mt: 2 }}>
                    {pipelineStages.map((stage) => (
                        <Box key={stage.name} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2">{stage.name}</Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    {stage.count} · ${stage.amount}K
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={(stage.amount / maxAmount) * 100}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
};