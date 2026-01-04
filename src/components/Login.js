import { Box, Button, Container, Paper, Stack, styled, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userActions } from '../actions/user.actions';
import { Spinner } from '../assets/spinner';
import { CredentialClass } from '../models/profile';


const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showSpinner, setShowSpinner] = useState(false)
    const [enter, setEnter] = useState(false)

    const benutzernameRef = useRef()
    const passwordRef = useRef()

    const loggingIn = useSelector((state) => state.user.loggingIn);
    const loggedIn = useSelector((state) => state.user.loggedIn);
    const d = useSelector((state) => state.user.done);

    useEffect(() => {
        setShowSpinner(loggingIn);
    }, [loggingIn]);

    const goToHome = () => {
        navigate("/transfers")
    }

    useEffect(() => {
        if (enter) {
            if (d) {
                if (loggedIn) {
                    setShowSpinner(false);
                    navigate("/transfers")
                }
            }
        }
    }, [d])


    const handleSubmit = async (e) => {
        e.preventDefault();

        var username = benutzernameRef.current.value
        var password = passwordRef.current.value

        if (username && password) {
            var cred = new CredentialClass()
            cred.email = username
            cred.password = password

            const replacer = (key, value) => {
                if (typeof value === 'undefined')
                    return false
                else return value;
            }

            var credInfos = JSON.parse(JSON.stringify(cred, replacer));

            setShowSpinner(true);
            setEnter(true)
            dispatch(userActions.login(credInfos));
        }
    };

    return (
        <>
            <Container maxWidth="sm">
                <Spinner show={showSpinner} />
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
                            inputRef={benutzernameRef}
                            required
                            fullWidth
                            label="Benutzername"
                            placeholder="Benutzername"
                            margin="normal"
                        />
                        <TextField
                            inputRef={passwordRef}
                            required
                            fullWidth
                            label="Passwort"
                            type="password"
                            placeholder="Passwort"
                            margin="normal"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSubmit(e);
                                }
                            }}
                        />
                        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
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
                        © 2025 - {new Date().getFullYear()} Landesbetrieb Mobilität Rheinland-Pfalz
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