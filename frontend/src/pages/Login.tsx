import { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
//import useAuth from '../hooks/useAuth';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        login(email, password);
        navigate('/dashboard');
    };

    return (
        <Box maxWidth={400} mx="auto" mt={10}>
            <Typography variant="h5" mb={2}>Login</Typography>

            <TextField
                label="Email"
                fullWidth
                margin="normal"
                onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleSubmit}
            >
                Entrar
            </Button>
        </Box>
    );
};
