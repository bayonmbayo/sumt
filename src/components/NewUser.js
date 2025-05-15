import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Container, FormControl, FormControlLabel, FormGroup, FormLabel, Paper, Radio, RadioGroup, Stack, styled, Switch, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { profileActions } from '../actions/profile.actions';
import { Spinner } from '../assets/spinner';
import { profileConstants } from '../constants';
import { ProfileClass } from '../models/profile';
import { util } from '../services';
import { profileService } from '../services/profile.service';
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

const NewUser = ({ update }) => {
    const { user } = useParams();
    const [userData, setUserData] = useState("")
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (update) {
            setLoading(true);
            profileService.getProfile(user)
                .then(res => res.json())
                .then(data => {
                    setUserData(data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setUserData("")
        }
    }, []);

    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation />
            <Spinner show={loading} />
            {!loading && update ? <NewUserBody user={userData} loading={loading} update={update} /> : <NewUserBody />}
        </div>
    );
}

const NewUserBody = ({ user, loading, update }) => {
    const navigate = useNavigate();
    const u = useSelector((state) => state.user.user)

    const emailRef = useRef('')
    const vornameRef = useRef('')
    const nachnameRef = useRef('')
    const passwordRef = useRef('')
    const passwordreRef = useRef('')
    const [role, setRole] = useState("USER")

    const [errorEmail, setErrorEmail] = useState(false)
    const [errorVorname, setErrorVorname] = useState(false)
    const [errorNachname, setErrorNachname] = useState(false)
    const [errorPassword, setErrorPassword] = useState(false)
    const [errorPasswordre, setErrorPasswordre] = useState(false)

    const dispatch = useDispatch();
    const d = useSelector((state) => state.profil.done);
    const [done, setDone] = useState(d)
    const e = useSelector((state) => state.profil.error);
    const [error, setError] = useState(e);
    const [showSpinner, setShowSpinner] = useState(user ? loading : false);

    const [saving, setSaving] = useState(false)

    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleChange = (e) => {
        setShowChangePassword(e.target.checked);
    };

    useEffect(() => {
        if (saving) {
            if (d) {
                if (e) {
                    if (update) {
                        setShowSpinner(false);
                        dispatch({ type: profileConstants.UPDATE_PROFIL_FAILURE_DONE });
                        Toast.fire({
                            icon: "error",
                            title: "The update failed fortunately"
                        });
                    } else {
                        setShowSpinner(false);
                        dispatch({ type: profileConstants.CREATE_PROFIL_FAILURE_DONE });
                        Toast.fire({
                            icon: "error",
                            title: "The registration failed fortunately"
                        });
                    }
                } else {
                    if (update) {
                        setShowSpinner(false);
                        dispatch({ type: profileConstants.UPDATE_PROFIL_SUCCESS_DONE });

                        if (u && u.role && (u.role.includes("ADMIN"))) {
                            navigate("/users")
                        } else {
                            navigate("/transfers")
                        }

                        // process later if the admin self changes his role
                        // localStorage.setItem('user', JSON.stringify(data));
                        // dispatch(userActions.session())

                        Toast.fire({
                            icon: "success",
                            title: "The user was successfully updated"
                        });
                    } else {
                        setShowSpinner(false);
                        dispatch({ type: profileConstants.CREATE_PROFIL_SUCCESS_DONE });

                        if (u && u.role && (u.role.includes("ADMIN"))) {
                            navigate("/users")
                        } else {
                            navigate("/transfers")
                        }

                        Toast.fire({
                            icon: "success",
                            title: "The user was successfully registered"
                        });
                    }
                }
            }
        }
    }, [d]);

    const handleChangeForRole = (e) => {
        if (e.target.type === "radio") {
            setRole(e.target.value);
        }
    }

    const save = () => {
        // Process

        setErrorEmail(false)
        setErrorVorname(false)
        setErrorNachname(false)
        setErrorPassword(false)
        setErrorPasswordre(false)

        var email = emailRef.current.value;
        var vorname = vornameRef.current.value;
        var nachname = nachnameRef.current.value;
        var password, passwordre;

        if (!update || update && showChangePassword) {
            password = passwordRef.current.value;
            passwordre = passwordreRef.current.value;
        }

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

        if (!update || update && showChangePassword) {
            if (!password || !util.isValidPassword(password.trim())) {
                setErrorPassword(true)
                return;
            }

            if (!passwordre || !(passwordre.trim() === password.trim())) {
                setErrorPasswordre(true)
                return;
            }
        }

        var profil = new ProfileClass()
        if (update) {
            profil.uuid = user.uuid
        }
        profil.role = role
        profil.email = email
        profil.username = email
        profil.firstname = vorname
        profil.name = nachname

        if (!update || update && showChangePassword) {
            profil.changepassword = true
            profil.password = password
            profil.passwordre = passwordre
        } else {
            profil.password = ""
            profil.passwordre = ""
        }

        const replacer = (key, value) => {
            if (typeof value === 'undefined')
                return false
            else return value;
        }

        var profilInfos = JSON.parse(JSON.stringify(profil, replacer));

        // console.log(profilInfos);

        setShowSpinner(true);
        setSaving(true)

        if (update) {
            dispatch(profileActions.updateUser(profilInfos));
        } else {
            dispatch(profileActions.createUser(profilInfos));
        }

    }

    if (!update) {
        if (u && u.role && (u.role.includes("MANAGER") || u.role.includes("USER"))) {
            return (
                <Container>
                    <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                        {"New User"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" style={{ paddingTop: 10, paddingBottom: 30 }}>
                        Diese Funktion ist nicht verfügbar.
                    </Typography>
                </Container>
            );
        }
    }


    return (
        <>
            <Container>
                <Spinner show={showSpinner} />
                <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                    {update ? "Update User" : "New User"}
                </Typography>

                <Typography variant="body2" color="text.secondary" style={{ paddingTop: 10, paddingBottom: 30 }}>
                    {update ? "Hier können Sie die Angaben des Nutzers bearbeiten" :
                        "Bitte geben Sie die Angaben des Nutzers ein, um zu registrieren"}
                </Typography>

                <Box component="form" noValidate autoComplete="off">
                    {(u && u.role && u.role.includes("ADMIN")) && (user && user.uuid && (u.uuid !== user.uuid)) ? <FormControl>
                        <FormLabel id="profilRole">
                            <span style={{ marginRight: 10 }}>Role</span>
                        </FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="profilRole"
                            name="role"
                            onChange={handleChangeForRole}
                            defaultValue={user && user.role ? user.role : "USER"}
                        >
                            <FormControlLabel value={"ADMIN"} control={<Radio />} label="Admin" />
                            <FormControlLabel value={"MANAGER"} control={<Radio />} label="Manager" />
                            <FormControlLabel value={"USER"} control={<Radio />} label="User" />
                        </RadioGroup>
                    </FormControl> : null}

                    <TextField
                        error={errorEmail}
                        required
                        fullWidth
                        // label="Email / Benutzername"
                        placeholder="Geben Sie die Email-Adresse ein"
                        margin="normal"
                        inputRef={emailRef}
                        helperText={errorEmail ? "Die Email-Adresse ist nicht gültig" : ""}
                        defaultValue={user && user.email ? user.email : ""}
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
                            // label="Vorname"
                            placeholder="Geben Sie den Vorname ein"
                            inputRef={vornameRef}
                            helperText={errorVorname ? "Der Vorname muss min. 2 Buchstaben enthalten" : ""}
                            defaultValue={user && user.firstname ? user.firstname : ""}
                        />
                        <TextField
                            error={errorNachname}
                            required
                            fullWidth
                            // label="Name"
                            placeholder="Geben Sie den Nachmame ein"
                            inputRef={nachnameRef}
                            helperText={errorNachname ? "Der Nachname muss min. 2 Buchstaben enthalten" : ""}
                            defaultValue={user && user.name ? user.name : ""}
                        />
                    </Box>

                    {update ?
                        <>
                            <Box
                                style={{ marginTop: 20 }}
                            >
                                <FormGroup aria-label="position" row>
                                    <FormControlLabel
                                        label="Change Password"
                                        control={<Switch
                                            checked={showChangePassword}
                                            onChange={handleChange}
                                            labelPlacement="end"
                                            color="primary"
                                        />}
                                    />
                                </FormGroup>
                            </Box>
                        </>
                        : null}

                    {!update || update && showChangePassword ?
                        <>
                            <TextField
                                error={errorPassword}
                                required
                                fullWidth
                                // label="Passwort"
                                type="password"
                                placeholder="Geben Sie das Passwort ein"
                                margin="normal"
                                inputRef={passwordRef}
                                helperText={errorPassword ? "Das Passwort ist nicht gültig" : ""}
                                defaultValue={""}
                            />
                            <TextField
                                error={errorPasswordre}
                                required
                                fullWidth
                                // label="Re-Passwort"
                                type="password"
                                placeholder="Geben Sie wieder das Passwort ein"
                                margin="normal"
                                inputRef={passwordreRef}
                                helperText={errorPasswordre ? "Das Passwort ist nicht gültig" : ""}
                                defaultValue={""}
                            />
                        </>
                        : null}
                    <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={save}>
                        {update ? "Bearbeiten" : "Registrieren"}
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