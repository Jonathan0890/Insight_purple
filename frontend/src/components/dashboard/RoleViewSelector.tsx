import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface RoleViewSelectorProps {
    role: string;
    onRoleChange: (newRole: string) => void;
}

export const RoleViewSelector = ({ role, onRoleChange }: RoleViewSelectorProps) => {
    const handleChange = (event: React.MouseEvent<HTMLElement>, newRole: string | null) => {
        if (newRole) {
            onRoleChange(newRole);
        }
    };

    return (
        <ToggleButtonGroup value={role} exclusive onChange={handleChange} size="small">
            <ToggleButton value="ejecutivo">Ejecutivo</ToggleButton>
            <ToggleButton value="marketing">Marketing</ToggleButton>
            <ToggleButton value="ventas">Ventas</ToggleButton>
            <ToggleButton value="inventario">Inventario</ToggleButton>
        </ToggleButtonGroup>
    );
};