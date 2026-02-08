import { Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

export const DateRangeFilter = ({ from, to, onChange }: any) => (
    <Stack direction="row" spacing={2}>
        <DatePicker
            label="Desde"
            value={from}
            onChange={(v) => onChange(v, to)}
            renderInput={(p) => <TextField {...p} size="small" />}
        />
        <DatePicker
            label="Hasta"
            value={to}
            onChange={(v) => onChange(from, v)}
            renderInput={(p) => <TextField {...p} size="small" />}
        />
    </Stack>
);
