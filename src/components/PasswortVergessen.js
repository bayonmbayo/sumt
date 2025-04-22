import { Box, Button, Container, Paper, styled, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


export const PasswortVergessen = () => {
    const [layout, setLayout] = useState(1)

    const weiter = () => {
        setLayout(2)
    }

    if (layout == 1) {
        return (
            <>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            {/* <img src={"/lbm.png"} alt="Logo" style={{ maxWidth: '250px', marginBottom: '20px' }} /> */}
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Passwort Zurücksetzen
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Bitte geben Sie Ihren Benutzernamen ein
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

                            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={weiter}>
                                Weiter
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
    } else {
        return (
            <>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            {/* <img src={"/lbm.png"} alt="Logo" style={{ maxWidth: '250px', marginBottom: '20px' }} /> */}
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                Passwort Zurücksetzen
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Eine Email-Nachricht wurde geschickt, damit Sie das Passwort zurücksetzen
                            </Typography>
                        </Box>
                        <Box component="form" noValidate autoComplete="off">
                            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                                <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Zu Login-Seite</Link>
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
    }

};

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'inherit',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#fff',
    boxShadow: 'none'
}));