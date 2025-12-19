import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SaveIcon from '@mui/icons-material/Save';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    InputAdornment,
    Radio,
    RadioGroup,
    Stack,
    Switch,
    TextField,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
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
    const [userData, setUserData] = useState("");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

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
            setUserData("");
        }
    }, [update, user]);

    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation
                showTransfersButton={true}
                showNewButton={false}
                showSettingsButton={true}
                searchPlaceholder="Search"
                searchLabel="Search"
            />
            <Spinner show={loading} />
            {!loading && (
                <NewUserBody
                    user={update ? userData : null}
                    loading={loading}
                    update={update}
                />
            )}
        </div>
    );
}

const NewUserBody = ({ user, loading, update }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const u = useSelector((state) => state.user.user);
    const d = useSelector((state) => state.profil.done);
    const e = useSelector((state) => state.profil.error);

    // Form refs
    const emailRef = useRef('');
    const vornameRef = useRef('');
    const nachnameRef = useRef('');
    const passwordRef = useRef('');
    const passwordreRef = useRef('');

    // Form state
    const [role, setRole] = useState(user?.role || "USER");
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRe, setShowPasswordRe] = useState(false);

    // Error state
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorVorname, setErrorVorname] = useState(false);
    const [errorNachname, setErrorNachname] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorPasswordre, setErrorPasswordre] = useState(false);

    // Loading state
    const [showSpinner, setShowSpinner] = useState(false);
    const [saving, setSaving] = useState(false);

    // Update role when user data loads
    useEffect(() => {
        if (user?.role) {
            setRole(user.role);
        }
    }, [user]);

    // Handle save completion
    useEffect(() => {
        if (saving && d) {
            if (e) {
                // Error occurred
                setShowSpinner(false);
                dispatch({
                    type: update
                        ? profileConstants.UPDATE_PROFIL_FAILURE_DONE
                        : profileConstants.CREATE_PROFIL_FAILURE_DONE
                });
                Toast.fire({
                    icon: "error",
                    title: update
                        ? "The update failed unfortunately"
                        : "The registration failed unfortunately"
                });
            } else {
                // Success
                setShowSpinner(false);
                dispatch({
                    type: update
                        ? profileConstants.UPDATE_PROFIL_SUCCESS_DONE
                        : profileConstants.CREATE_PROFIL_SUCCESS_DONE
                });

                const redirectPath = u?.role?.includes("ADMIN") ? "/users" : "/transfers";
                navigate(redirectPath);

                Toast.fire({
                    icon: "success",
                    title: update
                        ? "The user was successfully updated"
                        : "The user was successfully registered"
                });
            }
        }
    }, [d, e, saving, update, dispatch, navigate, u]);

    const handleChangeForRole = (e) => {
        setRole(e.target.value);
    };

    const handleToggleChangePassword = (e) => {
        setShowChangePassword(e.target.checked);
    };

    const handleGoBack = () => {
        if (u?.role?.includes("ADMIN")) {
            navigate("/users");
        } else {
            navigate("/transfers");
        }
    };

    const clearErrors = () => {
        setErrorEmail(false);
        setErrorVorname(false);
        setErrorNachname(false);
        setErrorPassword(false);
        setErrorPasswordre(false);
    };

    const save = () => {
        clearErrors();

        const email = emailRef.current.value;
        const vorname = vornameRef.current.value;
        const nachname = nachnameRef.current.value;
        let password, passwordre;

        if (!update || (update && showChangePassword)) {
            password = passwordRef.current.value;
            passwordre = passwordreRef.current.value;
        }

        // Validation
        if (!email || !util.isValidEmail(email.trim())) {
            setErrorEmail(true);
            return;
        }

        if (!vorname || vorname.length < 2) {
            setErrorVorname(true);
            return;
        }

        if (!nachname || nachname.length < 2) {
            setErrorNachname(true);
            return;
        }

        if (!update || (update && showChangePassword)) {
            if (!password || !util.isValidPassword(password.trim())) {
                setErrorPassword(true);
                return;
            }

            if (!passwordre || passwordre.trim() !== password.trim()) {
                setErrorPasswordre(true);
                return;
            }
        }

        // Build profile object
        const profil = new ProfileClass();
        if (update && user) {
            profil.uuid = user.uuid;
        }
        profil.role = role;
        profil.email = email;
        profil.username = email;
        profil.firstname = vorname;
        profil.name = nachname;

        if (!update || (update && showChangePassword)) {
            profil.changepassword = true;
            profil.password = password;
            profil.passwordre = passwordre;
        } else {
            profil.password = "";
            profil.passwordre = "";
        }

        const replacer = (key, value) => {
            if (typeof value === 'undefined') return false;
            return value;
        };

        const profilInfos = JSON.parse(JSON.stringify(profil, replacer));

        setShowSpinner(true);
        setSaving(true);

        if (update) {
            dispatch(profileActions.updateUser(profilInfos));
        } else {
            dispatch(profileActions.createUser(profilInfos));
        }
    };

    // Check permissions for new user creation
    if (!update && u?.role && (u.role.includes("MANAGER") || u.role.includes("USER"))) {
        return (
            <Container maxWidth="md">
                <Card
                    elevation={0}
                    sx={{
                        mt: 3,
                        borderRadius: 3,
                        border: '2px solid #f44336',
                    }}
                >
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h5" fontWeight="bold" color="error" gutterBottom>
                            Access Denied
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Diese Funktion ist nicht verfügbar.
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/transfers')}
                            sx={{ mt: 3, borderRadius: 2 }}
                        >
                            Back to Transfers
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    const canChangeRole = u?.role?.includes("ADMIN") && user?.uuid && u.uuid !== user.uuid;

    return (
        <Container maxWidth="md">
            <Spinner show={showSpinner} />

            {/* Header */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                sx={{ pt: 3, pb: 2 }}
            >
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h5" fontWeight="bold" color="text.secondary">
                            {update ? "Update User" : "New User"}
                        </Typography>
                        {update && user && (
                            <Chip
                                label={user.role}
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: user.role?.includes('ADMIN') ? '#1976d2' : '#757575',
                                    color: '#fff',
                                }}
                            />
                        )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {update
                            ? "Hier können Sie die Angaben des Nutzers bearbeiten"
                            : "Bitte geben Sie die Angaben des Nutzers ein, um zu registrieren"
                        }
                    </Typography>
                </Box>

                <Tooltip title="Back">
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleGoBack}
                        sx={{
                            borderRadius: 20,
                            borderColor: '#1976d2',
                            color: '#1976d2',
                        }}
                    >
                        {!isMobile && 'Back'}
                    </Button>
                </Tooltip>
            </Stack>

            {/* Form Card */}
            <Card
                elevation={0}
                sx={{
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: 'divider',
                }}
            >
                <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
                    <Box component="form" noValidate autoComplete="off">

                        {/* Role Selection - Only for admins editing other users */}
                        {canChangeRole && (
                            <>
                                <FormControl sx={{ mb: 3 }}>
                                    <FormLabel
                                        id="profilRole"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'text.secondary',
                                            mb: 1,
                                        }}
                                    >
                                        User Role
                                    </FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="profilRole"
                                        name="role"
                                        value={role}
                                        onChange={handleChangeForRole}
                                    >
                                        <FormControlLabel
                                            value="ADMIN"
                                            control={<Radio color="primary" />}
                                            label={
                                                <Chip
                                                    label="Admin"
                                                    size="small"
                                                    variant={role === 'ADMIN' ? 'filled' : 'outlined'}
                                                    color="primary"
                                                    sx={{ cursor: 'pointer' }}
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            value="MANAGER"
                                            control={<Radio color="primary" />}
                                            label={
                                                <Chip
                                                    label="Manager"
                                                    size="small"
                                                    variant={role === 'MANAGER' ? 'filled' : 'outlined'}
                                                    color="secondary"
                                                    sx={{ cursor: 'pointer' }}
                                                />
                                            }
                                        />
                                        <FormControlLabel
                                            value="USER"
                                            control={<Radio color="primary" />}
                                            label={
                                                <Chip
                                                    label="User"
                                                    size="small"
                                                    variant={role === 'USER' ? 'filled' : 'outlined'}
                                                    sx={{ cursor: 'pointer' }}
                                                />
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>
                                <Divider sx={{ mb: 3 }} />
                            </>
                        )}

                        {/* Personal Information Section */}
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            color="text.secondary"
                            sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                            <PersonIcon fontSize="small" />
                            Personal Information
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    error={errorVorname}
                                    required
                                    fullWidth
                                    label="Vorname"
                                    placeholder="Geben Sie den Vorname ein"
                                    inputRef={vornameRef}
                                    helperText={errorVorname ? "Der Vorname muss min. 2 Buchstaben enthalten" : ""}
                                    defaultValue={user?.firstname || ""}
                                    InputProps={{
                                        sx: { borderRadius: 2 }
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    error={errorNachname}
                                    required
                                    fullWidth
                                    label="Nachname"
                                    placeholder="Geben Sie den Nachname ein"
                                    inputRef={nachnameRef}
                                    helperText={errorNachname ? "Der Nachname muss min. 2 Buchstaben enthalten" : ""}
                                    defaultValue={user?.name || ""}
                                    InputProps={{
                                        sx: { borderRadius: 2 }
                                    }}
                                />
                            </Grid>
                        </Grid>

                        {/* Email Section */}
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            color="text.secondary"
                            sx={{ mt: 4, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                            <EmailIcon fontSize="small" />
                            Account Information
                        </Typography>

                        <TextField
                            error={errorEmail}
                            required
                            fullWidth
                            label="Email / Benutzername"
                            placeholder="Geben Sie die Email-Adresse ein"
                            inputRef={emailRef}
                            helperText={errorEmail ? "Die Email-Adresse ist nicht gültig" : ""}
                            defaultValue={user?.email || ""}
                            InputProps={{
                                sx: { borderRadius: 2 },
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon color="action" fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Password Section */}
                        {update && (
                            <Box sx={{ mt: 3 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={showChangePassword}
                                            onChange={handleToggleChangePassword}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="body2" fontWeight={500}>
                                            Change Password
                                        </Typography>
                                    }
                                />
                            </Box>
                        )}

                        {(!update || (update && showChangePassword)) && (
                            <>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    color="text.secondary"
                                    sx={{ mt: 3, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                                >
                                    <LockIcon fontSize="small" />
                                    Password
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            error={errorPassword}
                                            required
                                            fullWidth
                                            label="Passwort"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Geben Sie das Passwort ein"
                                            inputRef={passwordRef}
                                            helperText={errorPassword ? "Das Passwort ist nicht gültig" : "Min. 8 characters, 1 uppercase, 1 number"}
                                            InputProps={{
                                                sx: { borderRadius: 2 },
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon color="action" fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            error={errorPasswordre}
                                            required
                                            fullWidth
                                            label="Passwort bestätigen"
                                            type={showPasswordRe ? "text" : "password"}
                                            placeholder="Geben Sie wieder das Passwort ein"
                                            inputRef={passwordreRef}
                                            helperText={errorPasswordre ? "Die Passwörter stimmen nicht überein" : ""}
                                            InputProps={{
                                                sx: { borderRadius: 2 },
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockIcon color="action" fontSize="small" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPasswordRe(!showPasswordRe)}
                                                            edge="end"
                                                            size="small"
                                                        >
                                                            {showPasswordRe ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </>
                        )}

                        {/* Action Buttons */}
                        <Divider sx={{ my: 4 }} />

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button
                                variant="outlined"
                                onClick={handleGoBack}
                                sx={{
                                    borderRadius: 2,
                                    px: 4,
                                    borderColor: '#757575',
                                    color: '#757575',
                                }}
                            >
                                Abbrechen
                            </Button>
                            <Button
                                variant="contained"
                                onClick={save}
                                startIcon={update ? <SaveIcon /> : <PersonAddIcon />}
                                sx={{
                                    borderRadius: 2,
                                    px: 4,
                                    backgroundColor: '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#1565c0',
                                    },
                                }}
                            >
                                {update ? "Bearbeiten" : "Registrieren"}
                            </Button>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>

            {/* User Info Footer - Only when updating */}
            {update && user && (
                <Card
                    elevation={0}
                    sx={{
                        mt: 2,
                        borderRadius: 3,
                        backgroundColor: '#f5f5f5',
                    }}
                >
                    <CardContent sx={{ py: 2 }}>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            spacing={1}
                        >
                            <Typography variant="body2" color="text.secondary">
                                <strong>User ID:</strong> {user.uuid}
                            </Typography>
                            {user.createdat && (
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Created:</strong> {new Date(user.createdat).toLocaleDateString('de-DE')}
                                </Typography>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}

export default NewUser;