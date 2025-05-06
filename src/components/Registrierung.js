import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { userActions } from '../actions/user.actions';
import { Spinner } from '../assets/spinner';
import { userConstants } from '../constants';
import { ProfileClass } from '../models/profile';
import { util } from '../services';


const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

const Registrieren = () => {
    const [layout, setLayout] = useState(1)

    const emailRef = useRef('')
    const vornameRef = useRef('')
    const nachnameRef = useRef('')
    const passwordRef = useRef('')
    const passwordreRef = useRef('')

    const [errorEmail, setErrorEmail] = useState(false)
    const [errorVorname, setErrorVorname] = useState(false)
    const [errorNachname, setErrorNachname] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    const [errorPasswordre, setErrorPasswordre] = useState(false)

    const dispatch = useDispatch();
    const d = useSelector((state) => state.user.done);
    const [done, setDone] = useState(d)
    const e = useSelector((state) => state.user.error);
    const [error, setError] = useState(e);
    const [showSpinner, setShowSpinner] = useState(false);

    const [registrierend, setRegistrierend] = useState(false)

    useEffect(() => {
        if (registrierend) {
            if (d) {
                if (e) {
                    setShowSpinner(false);
                    dispatch({ type: userConstants.REGISTER_FAILURE_DONE });
                    Toast.fire({
                        icon: "error",
                        title: "The registration failed fortunately"
                    });
                } else {
                    setShowSpinner(false);
                    dispatch({ type: userConstants.REGISTER_SUCCESS_DONE });
                    setLayout(2)
                    Toast.fire({
                        icon: "success",
                        title: "You are successfully registered"
                    });
                }
            }
        }
    }, [d]);

    const registrieren = () => {
        // Process

        setErrorEmail(false)
        setErrorVorname(false)
        setErrorNachname(false)
        setErrorPassword(false)
        setErrorPasswordre(false)

        var email = emailRef.current.value;
        var vorname = vornameRef.current.value;
        var nachname = nachnameRef.current.value;
        var password = passwordRef.current.value;
        var passwordre = passwordreRef.current.value;

        if (!email || !util.isValidEmail(email.trim())) {
            setErrorEmail(true)
            return;
        }

        if (!vorname || vorname.length < 2) {
            setErrorVorname(true)
            return;
        }

        if (!nachname || nachname.length < 2) {
            setErrorNachname(true)
            return;
        }

        if (!password || !util.isValidPassword(password.trim())) {
            setErrorPassword(true)
            return;
        }

        if (!passwordre || !(passwordre.trim() === password.trim())) {
            setErrorPasswordre(true)
            return;
        }

        var profil = new ProfileClass()
        profil.email = email
        profil.username = email
        profil.firstname = vorname
        profil.name = nachname
        profil.password = password
        profil.passwordre = passwordre

        const replacer = (key, value) => {
            if (typeof value === 'undefined')
                return false
            else return value;
        }

        var profilInfos = JSON.parse(JSON.stringify(profil, replacer));

        // console.log(profilInfos);

        setShowSpinner(true);
        setRegistrierend(true)
        dispatch(userActions.register(profilInfos));
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
                                Registrierung
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Bitte geben Sie Ihre Angaben ein, um sich zu registrieren
                            </Typography>
                        </Box>
                        <Box component="form" noValidate autoComplete="off">
                            <TextField
                                error={errorEmail}
                                required
                                fullWidth
                                label="Email / Benutzername"
                                placeholder="Email / Benutzername"
                                margin="normal"
                                inputRef={emailRef}
                                helperText={errorEmail ? "Die Email-Adresse ist nicht gültig" : ""}
                            />
                            <TextField
                                error={errorVorname}
                                required
                                fullWidth
                                label="Vorname"
                                placeholder="Vorname"
                                margin="normal"
                                inputRef={vornameRef}
                                helperText={errorVorname ? "Der Vorname muss min. 2 Buchstaben enthalten" : ""}
                            />
                            <TextField
                                error={errorNachname}
                                required
                                fullWidth
                                label="Nachname"
                                placeholder="Nachname"
                                margin="normal"
                                inputRef={nachnameRef}
                                helperText={errorNachname ? "Der Nachname muss min. 2 Buchstaben enthalten" : ""}
                            />
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