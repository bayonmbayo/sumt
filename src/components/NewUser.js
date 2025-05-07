import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Container, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, Stack, styled, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { profileActions } from '../actions/profile.actions';
import { userActions } from '../actions/user.actions';
import { Spinner } from '../assets/spinner';
import { userConstants } from '../constants';
import { ProfileClass } from '../models/profile';
import { util } from '../services';
import { HomeNavigation } from "./Home";


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

const NewUser = () => {
    const { transfer } = useParams();
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(profileActions.getProfileList())
    }, []);

    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation />
            <NewUserBody />
        </div>
    );
}

const NewUserBody = () => {
    const [layout, setLayout] = useState(1)
    const navigate = useNavigate();

    const emailRef = useRef('')
    const vornameRef = useRef('')
    const nachnameRef = useRef('')
    const passwordRef = useRef('')
    const passwordreRef = useRef('')
    const [role, setRole] = useState('USER')

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
                    navigate("/users")
                    Toast.fire({
                        icon: "success",
                        title: "You are successfully registered"
                    });
                }
            }
        }
    }, [d]);

    const handleChangeForRole = (e) => {
        if (e.target.type === "radio") {
            setRole(e.target.value);
        }
    }

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
        profil.role = role
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

    return (
        <>
            <Container>
                <Spinner show={showSpinner} />
                <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                    New User
                </Typography>

                <Typography variant="body2" color="text.secondary" style={{ paddingTop: 10, paddingBottom: 30 }}>
                    Bitte geben Sie die Angaben des Nutzers ein, um zu registrieren
                </Typography>

                <Box component="form" noValidate autoComplete="off">
                    <FormControl>
                        <FormLabel id="profil-allow-message">
                            <span style={{ marginRight: 10 }}>Role</span>
                        </FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="profil-allow-message"
                            name="message"
                            onChange={handleChangeForRole}
                            defaultValue={"USER"}
                        >
                            <FormControlLabel value={"ADMIN"} control={<Radio />} label="Admin" />
                            <FormControlLabel value={"MANAGER"} control={<Radio />} label="Manager" />
                            <FormControlLabel value={"USER"} control={<Radio />} label="User" />
                        </RadioGroup>
                    </FormControl>

                    <TextField
                        error={errorEmail}
                        required
                        fullWidth
                        label="Email / Benutzername"
                        placeholder="Geben Sie die Email-Adresse ein"
                        margin="normal"
                        inputRef={emailRef}
                        helperText={errorEmail ? "Die Email-Adresse ist nicht gültig" : ""}
                    />
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            '& .MuiTextField-root': { width: '48%' } // Adjust width as needed
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            error={errorVorname}
                            required
                            fullWidth
                            label="Vorname"
                            placeholder="Geben Sie den Vorname ein"
                            inputRef={vornameRef}
                            helperText={errorVorname ? "Der Vorname muss min. 2 Buchstaben enthalten" : ""}
                        />
                        <TextField
                            error={errorNachname}
                            required
                            fullWidth
                            label="Name"
                            placeholder="Geben Sie den Nachmame ein"
                            inputRef={nachnameRef}
                            helperText={errorNachname ? "Der Nachname muss min. 2 Buchstaben enthalten" : ""}
                        />
                    </Box>
                    <TextField
                        error={errorPassword}
                        required
                        fullWidth
                        label="Passwort"
                        type="password"
                        placeholder="Geben Sie das Passwort ein"
                        margin="normal"
                        inputRef={passwordRef}
                        helperText={errorPassword ? "Das Passwort ist nicht gültig" : ""}
                    />
                    <TextField
                        error={errorPasswordre}
                        required
                        fullWidth
                        label="Re-Passwort"
                        type="password"
                        placeholder="Geben Sie wieder das Passwort ein"
                        margin="normal"
                        inputRef={passwordreRef}
                        helperText={errorPasswordre ? "Das Passwort ist nicht gültig" : ""}
                    />
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={registrieren}>
                        Registrieren
                    </Button>
                </Box>
            </Container>
        </>
    );
}

const User = ({ data, key, index }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    const coordinatePairs = data.coordinates?.[0]?.[0]
    var polyCoordinates;

    // console.log(coordinatePairs);
    if (Array.isArray(coordinatePairs)) {
        polyCoordinates = coordinatePairs
            .map(pair => Array.isArray(pair) ? pair.join(', ') : '')
            .join(' | ');

        // console.log(polyCoordinates);
    } else {
        console.error('Coordinate data is missing or malformed');
    }

    var user = data.firstname + " " + data.name + " - " + data.email

    return (
        <>
            <Box
                //onMouseEnter={() => setIsHovered(true)}
                //onMouseLeave={() => setIsHovered(false)}
                onClick={() => handleClick()}
                style={{
                    width: '100%',
                    backgroundColor: '#f2f2f2',
                    // transition: 'background-color 0.3s ease',
                    borderRadius: 20,
                    border: '2px solid #1976d2',
                    textTransform: 'none'
                    // boxShadow: isHovered ? '10px 5px 5px #1976d2' : 'none',
                    // cursor: isHovered ? 'pointer' : 'auto'
                }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={1}
                >
                    <Item>
                        <Typography variant="h5" fontWeight="bold" color="#000">
                            <Box
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                    padding: 5,
                                    borderRadius: 5,
                                    margin: "0px 10px 0px 10px"
                                }}
                            >
                                <Typography variant="body2" fontWeight="bold" color="#fff">
                                    {data.role}
                                </Typography>
                            </Box>
                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                style={{
                                    display: 'inline-block',
                                }}
                            >
                                {user}
                            </Typography>
                        </Typography>
                    </Item>
                    <Item>
                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={1}
                        >
                            <Item>
                                <Button style={{
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    textTransform: 'uppercase'
                                }}>Update</Button>
                            </Item>
                            <Item>
                                <Button style={{
                                    backgroundColor: '#1976d2',
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                    minWidth: 0,
                                    width: 40
                                }}><DeleteIcon /></Button>
                            </Item>
                        </Stack>
                    </Item>
                </Stack>
            </Box>
            {isClicked ?
                <div
                    //onMouseEnter={() => setIsHovered(true)}
                    //onMouseLeave={() => setIsHovered(false)}
                    //onClick={() => handleClick()}
                    style={{
                        width: '100%',
                        // height: 50,
                        backgroundColor: '#F3F4F9',
                        // transition: 'background-color 0.3s ease',
                        borderRadius: 10,
                        marginTop: 10,
                        justifyContent: 'flex-start'
                        // border: '2px solid',
                        // boxShadow: isHovered ? '10px 5px 5px #1976d2' : 'none',
                        // cursor: isHovered ? 'pointer' : 'auto'
                    }}>
                    <div style={{ margin: 20 }}>
                        <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ padding: 20 }}>
                            Details
                        </Typography>
                        {/* <Typography variant="body2" color="text.secondary" style={{ padding: 10 }}>
                            - Type : {data.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ padding: 10 }}>
                            - Coordinates : {polyCoordinates}
                        </Typography> */}
                    </div>
                </div> : null}
        </>
    );
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'inherit',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#fff',
    boxShadow: 'none'
}));

export default NewUser;