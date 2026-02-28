import { useState } from 'react';
import {
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Tooltip,
} from '@mui/material';
import {
    Download,
    FileDownload,
    PictureAsPdf,
    TableChart,
    InsertDriveFile,
} from '@mui/icons-material';

interface ExportButtonsProps {
    onExportCSV: () => void;
    onExportPDF: () => void;
    onExportExcel?: () => void;
    disabled?: boolean;
}

export const ExportButtons = ({
    onExportCSV,
    onExportPDF,
    onExportExcel,
    disabled = false,
}: ExportButtonsProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleExport = (type: string, callback: () => void) => {
        callback();
        handleClose();
    };

    return (
        <>
            <Tooltip title="Exportar reporte">
                <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleClick}
                    disabled={disabled}
                    size="small"
                    sx={{ borderRadius: 2 }}
                >
                    Exportar
                </Button>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={() => handleExport('csv', onExportCSV)}>
                    <ListItemIcon>
                        <TableChart fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>CSV (Excel)</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleExport('pdf', onExportPDF)}>
                    <ListItemIcon>
                        <PictureAsPdf fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>PDF</ListItemText>
                </MenuItem>
                {onExportExcel && (
                    <MenuItem onClick={() => handleExport('excel', onExportExcel)}>
                        <ListItemIcon>
                            <InsertDriveFile fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Excel (XLSX)</ListItemText>
                    </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleClose}>
                    <ListItemText secondary="Cancelar" />
                </MenuItem>
            </Menu>
        </>
    );
};