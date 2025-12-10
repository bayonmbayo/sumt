import { Box, Button, Container, Paper, styled, TextField, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spinner } from '../assets/spinner';
import { userService } from '../services';


export const PasswortVergessen = () => {
    const [layout, setLayout] = useState(1)
    const emailRef = useRef();
    const [showSpinner, setShowSpinner] = useState(false)

    const weiter = () => {
        setLayout(2)
    }


    const handleSubmit = (e) => {
        var email = emailRef.current.value

        e.preventDefault();

        if (email) {
            setShowSpinner(true)
            userService.requestNewPassword(email).then(res => {
                setShowSpinner(false)
                setLayout(2)
            }).catch(res => {
                setShowSpinner(false)
                setLayout(2)
            });
        }
    }

    if (layout == 1) {
        return (
            <>
                <Container maxWidth="sm">
                    <Spinner show={showSpinner} />
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
                                inputRef={emailRef}
                                required
                                fullWidth
                                label="Benutzername"
                                placeholder="Benutzername"
                                margin="normal"
                            />

                            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
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