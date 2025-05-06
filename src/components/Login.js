import { Box, Button, Container, Paper, Stack, styled, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userActions } from '../actions/user.actions';
import { Spinner } from '../assets/spinner';


const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showSpinner, setShowSpinner] = useState(false)

    const loggingIn = useSelector((state) => state.user.loggingIn);

    useEffect(() => {
        setShowSpinner(loggingIn);
    }, [loggingIn]);

    const goToHome = () => {
        navigate("/transfers")
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        var username, password;

        if (username && password) {
            setShowSpinner(true);
            dispatch(userActions.login(username, password));
        }
    };

    return (
        <>
            <Container maxWidth="sm">
                <Spinner show={loggingIn} />
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
                        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={goToHome}>
                            Anmelden
                        </Button>
                    </Box>
                    <Stack
                        direction="column"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                        style={{ marginTop: 50 }}
                    >
                        <Item style={{ paddingRight: 0, paddingLeft: 0 }}>
                            <Link to="/passwortvergessen" style={{ color: "#1976d2" }}>Passwort Vergessen</Link>
                        </Item>
                    </Stack>
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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'inherit',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#fff',
    boxShadow: 'none'
}));

export default Login;