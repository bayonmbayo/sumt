import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, Stack, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { profileActions } from '../actions/profile.actions';
import { Spinner } from "../assets/spinner";
import { profileService } from '../services/profile.service';
import { HomeNavigation } from "./Home";




const Users = () => {
    const { transfer } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(profileActions.getProfileList())
    }, []);

    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation />
            <ViewUserBody transfer={transfer} />
        </div>
    );
}

const ViewUserBody = ({ transfer }) => {
    const u = useSelector((state) => state.user.user)

    const p = useSelector(state => state.profiles.profilList);
    const l = useSelector(state => state.profiles.loading);
    const [profileList, setProfileList] = useState(p);

    const [page, setPage] = useState(1);
    const [dataLimit, setDataLimit] = useState(15);

    const getPaginatedData = () => {
        const startIndex = page * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        // console.log(b.bauprojekte)
        return p.profilList.slice(startIndex, endIndex);
    };

    useEffect(() => {
        setProfileList(p);
    }, [p]);


    if (u && u.role && (u.role.includes("MANAGER") || u.role.includes("USER"))) {
        return (
            <Container>
                <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                    {"Users"}
                </Typography>

                <Typography variant="body2" color="text.secondary" style={{ paddingTop: 10, paddingBottom: 30 }}>
                    Diese Funktion ist nicht verfügbar.
                </Typography>
            </Container>
        );
    }

    if (l) {
        return (
            <>
                <Container>
                    <Spinner show={l} />
                    <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                        Users
                    </Typography>
                </Container>
            </>
        )
    } else {
        if (p && p.profilList) {
            return (
                <>
                    <Container>
                        <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                            Users
                        </Typography>

                        <Grid
                            container
                            spacing={4}
                            // className="marginLaptop"
                            justifyItems="center"
                            style={{ marginTop: 30 }}
                        >
                            {getPaginatedData().map((d, idx) => (
                                <Grid key={idx} size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <User key={idx} index={idx} data={d} />
                                </Grid>
                            ))}
                        </Grid>

                    </Container>
                </>
            );
        }
    };
}

const User = ({ data, key, index }) => {
    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showSpinner, setShowSpinner] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    const updateUser = (e) => {
        e.stopPropagation();

        navigate('/user/' + data.uuid)
    }

    const [openDeleteUser, setOpenDeleteUser] = useState(false);

    const openConfirmDelete = (e) => {
        e.stopPropagation();

        setOpenDeleteUser(true);
    };

    const closeDeleteUser = () => {
        setOpenDeleteUser(false);
    };

    const deleteUser = (e) => {
        setShowSpinner(true)
        profileService.deleteUser(data.uuid).then(res => {
            setShowSpinner(false)
            dispatch(profileActions.getProfileList())
        }).catch(res => {
            setShowSpinner(false)
            dispatch(profileActions.getProfileList())
        });
    }

    var user = data.firstname + " " + data.name + " - " + data.email
    var fullname = data.firstname + " " + data.name

    return (
        <>
            <ConfirmDelete openDeleteUser={openDeleteUser} closeDeleteUser={closeDeleteUser} deleteUser={deleteUser} fullname={fullname} />
            <Spinner show={showSpinner} />
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
                                <Button
                                    style={{
                                        backgroundColor: '#1976d2',
                                        color: '#fff',
                                        textTransform: 'uppercase'
                                    }}
                                    onClick={updateUser}
                                >Update</Button>
                            </Item>
                            <Item>
                                <Button
                                    style={{
                                        backgroundColor: '#1976d2',
                                        color: '#fff',
                                        textTransform: 'uppercase',
                                        minWidth: 0,
                                        width: 40
                                    }}
                                    onClick={openConfirmDelete}
                                ><DeleteIcon /></Button>
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
                        <Typography variant="h6" fontWeight="bold" color="text.secondary" style={{ padding: 10 }}>
                            Details
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ padding: 5 }}>
                            - Vorname : {data.firstname}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ padding: 5 }}>
                            - Nachname : {data.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ padding: 5 }}>
                            - Email / Benutzername : {data.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ padding: 5 }}>
                            - Role : {data.role}
                        </Typography>
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

export function ConfirmDelete({ openDeleteUser, closeDeleteUser, deleteUser, fullname }) {

    return (
        <>
            <Dialog
                open={openDeleteUser}
                onClose={closeDeleteUser}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delete User"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Möchten Sie den Nutzer "{fullname}" löschen ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={closeDeleteUser}>Abbrechen</Button>
                    <Button variant="contained" onClick={deleteUser} autoFocus>
                        Löschen
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Users;