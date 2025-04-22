import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Registrieren = () => {
    const [layout, setLayout] = useState(1)

    const registrieren = () => {
        // Process

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
                                Registrierung
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Bitte geben Sie Ihre Angaben ein, um sich zu registrieren
                            </Typography>
                        </Box>
                        <Box component="form" noValidate autoComplete="off">
                            <TextField
                                required
                                fullWidth
                                label="Email / Benutzername"
                                placeholder="Email / Benutzername"
                                margin="normal"
                            />
                            <TextField
                                required
                                fullWidth
                                label="Vorname"
                                placeholder="Vorname"
                                margin="normal"
                            />
                            <TextField
                                required
                                fullWidth
                                label="Nachname"
                                placeholder="Nachname"
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
                            <TextField
                                required
                                fullWidth
                                label="Passwort bestätigen"
                                type="password"
                                placeholder="Passwort bestätigen"
                                margin="normal"
                            />
                            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={registrieren}>
                                registrieren
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
                                Registrierung
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Eine Email-Nachricht wurde geschickt, damit Sie die Registrierung bestätigen
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

export default Registrieren;