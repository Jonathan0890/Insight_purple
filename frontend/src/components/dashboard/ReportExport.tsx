import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';

export const ReportExport = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        // Simular descarga
        alert(`Reporte en formato ${format.toUpperCase()} descargado (simulación).`);
        handleClose();
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleClick}
                size="small"
            >
                Exportar
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={() => handleExport('pdf')}>PDF</MenuItem>
                <MenuItem onClick={() => handleExport('excel')}>Excel</MenuItem>
            </Menu>
        </>
    );
};