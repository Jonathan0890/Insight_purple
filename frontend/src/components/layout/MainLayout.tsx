import { Container } from '@mui/material';

export const MainLayout = ({ children }: any) => (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
        {children}
    </Container>
);
