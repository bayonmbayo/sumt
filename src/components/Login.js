import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import React from 'react';


const Login = () => {
    return (
        <>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        {/* <img src={"/lbm.png"} alt="Logo" style={{ maxWidth: '250px', marginBottom: '20px' }} /> */}
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Benutzeranmeldung
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Bitte geben Sie Ihren Benutzernamen und Ihr Passwort ein, um sich an der Website anzumelden.
                        </Typography>
                    </Box>
                    <Box component="form" noValidate autoComplete="off">
                        <TextField
                            required
                            fullWidth
                            label="Benutzername"
                            placeholder="Benutzername"
                            margin="normal"
                        />
                        <TextField
                            required
                            fullWidth
                            label="Passwort"
                            type="password"
                            placeholder="Passwort"
                            margin="normal"
                        />
                        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                            Anmelden
                        </Button>
                    </Box>
                </Paper>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 5 }}>
                    <Typography variant="body2" color="text.secondary">
                        © 2025 Landesbetrieb Mobilität Rheinland-Pfalz
                    </Typography>
                </Box>
            </Container>
        </>
    );
};

export default Login;