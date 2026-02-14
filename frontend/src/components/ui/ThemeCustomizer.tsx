import { Popover, Box, Typography, Button } from '@mui/material';
import { useThemeMode } from '../../context/ThemeContext';

const backgroundOptions = [
    { label: 'Predeterminado', value: '' },
    { label: 'Blanco sólido', value: 'bg-white' },
    { label: 'Gris claro', value: 'bg-gray-100' },
    { label: 'Azul muy claro', value: 'bg-blue-50' },
    { label: 'Degradado azul', value: 'bg-gradient-to-r from-blue-400 to-purple-500' },
    { label: 'Degradado verde', value: 'bg-gradient-to-r from-green-400 to-teal-500' },
    { label: 'Oscuro sólido', value: 'bg-gray-800' },
    { label: 'Oscuro degradado', value: 'bg-gradient-to-br from-gray-900 to-gray-700' },
];

interface ThemeCustomizerProps {
    open: boolean;
    anchorEl: HTMLElement | null;
    onClose: () => void;
}

export const ThemeCustomizer = ({ open, anchorEl, onClose }: ThemeCustomizerProps) => {
    const { backgroundClass, setBackgroundClass } = useThemeMode();

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Box sx={{ p: 2, width: 280 }}>
                <Typography variant="h6" gutterBottom>
                    Personalizar fondo
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    {backgroundOptions.map((opt) => (
                        <Button
                            key={opt.value}
                            variant={backgroundClass === opt.value ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => {
                                setBackgroundClass(opt.value);
                                onClose(); // opcional: cerrar al seleccionar
                            }}
                            sx={{ textTransform: 'none' }}
                        >
                            {opt.label}
                        </Button>
                    ))}
                </Box>
            </Box>
        </Popover>
    );
};