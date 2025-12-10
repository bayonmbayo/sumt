import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spinner } from '../assets/spinner';
import { PasswordClass } from '../models/profile';
import { userService, util } from '../services';




export const NewPassword = () => {
    const [layout, setLayout] = useState(1)
    const params = useParams();
    const [showSpinner, setShowSpinner] = useState(false)

    const passwordRef = useRef('')
    const passwordreRef = useRef('')

    const [errorPassword, setErrorPassword] = useState(false)
    const [errorPasswordre, setErrorPasswordre] = useState(false)

    const changePassword = () => {
        // Process

        setErrorPassword(false)
        setErrorPasswordre(false)

        var password = passwordRef.current.value;
        var passwordre = passwordreRef.current.value;

        if (!password || !util.isValidPassword(password.trim())) {
            setErrorPassword(true)
            return;
        }

        if (!passwordre || !(passwordre.trim() === password.trim())) {
            setErrorPasswordre(true)
            return;
        }

        var pw = new PasswordClass()
        pw.password = password
        pw.passwordre = passwordre
        pw.token = params.token

        const replacer = (key, value) => {
            if (typeof value === 'undefined')
                return false
            else return value;
        }

        var passwordInfos = JSON.parse(JSON.stringify(pw, replacer));


        setShowSpinner(true)
        userService.resetPassword(passwordInfos).then(res => {
            setShowSpinner(false)
            setLayout(2)
        }).catch(res => {
            setShowSpinner(false)
            setLayout(2)
        });
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
                                Hier können Sie Ihr Passwort ändern. Das Passwort muss folgende Eigenschaften besitzen:
                                <ul>
                                    <li>Das Passwort muss mindestens aus 8 Buchstaben bestehen</li>
                                    <li>Das Passwort muss mindestens einen Großbuchstaben enthalten</li>
                                    <li>Das Passwort muss mindestens einen Kleinbuchstaben enthalten</li>
                                    <li>Das Passwort muss mindestens eine Zahl enthalten</li>
                                    <li>Das Passwort muss mindestens ein Sonderzeichen enthalten</li>
                                </ul>
                            </Typography>
                        </Box>
                        <Box component="form" noValidate autoComplete="off">
                            <TextField
                                error={errorPassword}
                                required
                                fullWidth
                                label="Passwort"
                                type="password"
                                placeholder="Passwort"
                                margin="normal"
                                inputRef={passwordRef}
                                helperText={errorPassword ? "Das Passwort ist nicht gültig" : ""}
                            />
                            <TextField
                                error={errorPasswordre}
                                required
                                fullWidth
                                label="Passwort bestätigen"
                                type="password"
                                placeholder="Passwort bestätigen"
                                margin="normal"
                                inputRef={passwordreRef}
                                helperText={errorPasswordre ? "Das Passwort ist nicht gültig" : ""}
                            />
                            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={changePassword}>
                                Change Password
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
                                Passwort Zurückgesetzt
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Sie haben das Passwort erfolgreich geändert!
                                Sie können sich nun mit Ihrer E-Mail-Adresse und Ihrem neuen Passwort im Portal anmelden
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