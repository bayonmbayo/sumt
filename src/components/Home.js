import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SubjectIcon from '@mui/icons-material/Subject';
import SyncIcon from '@mui/icons-material/Sync';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import { Box, Button, CircularProgress, ClickAwayListener, Container, Grid, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Stack, styled, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { transferActions } from '../actions/transfer.actions';
import { Spinner } from '../assets/spinner';
import { util } from '../services';

const Home = () => {
    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation />
            <Transfers />
        </div>
    );
}

export const HomeNavigation = () => {
    const navigate = useNavigate()
    const location = useLocation();


    const goToTransfers = () => {
        navigate("/transfers")
    }

    const goToNewTransfer = () => {
        if (location.pathname.includes("/user") ||
            location.pathname.includes("/users") ||
            location.pathname.includes("/users/") ||
            location.pathname.includes("/newuser") ||
            location.pathname.includes("/newuser/")
        ) {
            navigate("/newuser", { replace: true })
            return;
        }

        navigate("/new")
    }

    const goToSettings = () => {
        navigate("/settings")
    }

    return (

        <Container>
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                p={1}
            >
                <Item>
                    <Button size="large" variant="contained" style={{ borderRadius: 20, minWidth: 0, padding: 15 }} onClick={() => goToTransfers()}><RemoveRedEyeIcon style={{ marginRight: 10 }} />View Transfers</Button>
                </Item>
            </Stack>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
            >
                <Item>
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                        spacing={1}
                    >
                        <Item>
                            <Button size="large" variant="contained" style={{ borderRadius: 20, minWidth: 0, padding: 15 }} onClick={() => goToNewTransfer()}><AddCircleIcon style={{ marginRight: 10 }} />New</Button>
                        </Item>
                        <Item>
                            <Button size="large" variant="contained" style={{ borderRadius: 20, minWidth: 0, padding: 15 }} onClick={() => goToSettings()}><SettingsSuggestIcon style={{ marginRight: 10 }} /> Settings</Button>
                        </Item>
                    </Stack>
                </Item>
                <Item>
                    <TextField
                        fullWidth
                        label="Search"
                        placeholder="Search Transfer"
                        margin="normal"
                    />
                </Item>
            </Stack>
        </Container>
    );
};

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'inherit',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#fff',
    boxShadow: 'none'
}));

const Transfers = () => {
    const t = useSelector(state => state.transfers.transfers);
    const [transferList, setTransferList] = useState(t);
    const l = useSelector(state => state.transfers.loading);

    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const [dataLimit, setDataLimit] = useState(15);

    const getPaginatedData = () => {
        const startIndex = page * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        // console.log(b.bauprojekte)
        return t.transfers.slice(startIndex, endIndex);
    };

    useEffect(() => {
        dispatch(transferActions.getAllTransfers())
    }, []);

    useEffect(() => {
        setTransferList(t);
    }, [t]);

    if (l) {
        return (
            <>
                <Container>
                    <Spinner show={l} />
                    <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                        Transfers
                    </Typography>
                </Container>
            </>
        )
    } else {
        if (t && t.transfers) {
            return (
                <Container>
                    <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                        Transfers
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
                                <Transfer index={idx} data={d} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            );
        }
    }
}

const Transfer = ({ index, data }) => {
    const { id, title, auto, status, executedat, bauprojekte, allbauprojekte } = data
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate()

    const { height, width } = useWindowDimensions();

    console.log(width)

    const [syncData, setSyncData] = useState({
        status: status,
        currentsavedobject: bauprojekte,
        totalobjectToSave: allbauprojekte
    });

    const handleClick = () => {
        navigate("/transfer/1")
        setIsClicked(true);
    };

    const runAgain = (e) => {
        e.stopPropagation();

        console.log("Run Again")
    }

    useEffect(() => {
        let timer;
        if (isClicked) {
            timer = setTimeout(() => setIsClicked(false), 200);
        }
        return () => clearTimeout(timer);
    }, [isClicked]);

    const mockBackend = (() => {
        let saved = bauprojekte;
        return () => {
            saved += 5;
            if (saved >= allbauprojekte) {
                return Promise.resolve({
                    status: 2,
                    currentsavedobject: allbauprojekte,
                    totalobjectToSave: allbauprojekte
                });
            } else {
                return Promise.resolve({
                    status: 1,
                    currentsavedobject: saved,
                    totalobjectToSave: allbauprojekte
                });
            }
        };
    })();

    useEffect(() => {
        if (status === 1) {
            const fetchSyncStatus = async () => {
                try {
                    // Replace this with your real API call, e.g. fetch('/api/sync-status')
                    // const response = await fetch('/api/sync-status');
                    // const data = await response.json();
                    const data = await mockBackend();
                    setSyncData(data);

                    // Stop polling if finished (status 2 or 3)
                    if (data.status === 2 || (data.status === 3 && data.currentsavedobject >= data.totalobjectToSave)) {
                        clearInterval(intervalId);
                    }
                } catch (err) {
                    console.error('Error fetching sync status:', err);
                }
            };

            const intervalId = setInterval(fetchSyncStatus, 500);
            return () => clearInterval(intervalId); // Cleanup on unmount
        }
    }, []);


    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => handleClick()}
            style={{
                width: '100%',
                height: 200,
                backgroundColor: isClicked ? '#F3F4F9' : '#fff',
                transition: 'background-color 0.3s ease',
                borderRadius: 20,
                border: '2px solid',
                boxShadow: isHovered ? '10px 5px 5px #1976d2' : 'none',
                cursor: isHovered ? 'pointer' : 'auto'
            }}>
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="space-between"
                spacing={1}
            >
                <Item>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                    >
                        <Item>
                            <Stack
                                direction="row"
                                justifyContent="start"
                                alignItems="center"
                                spacing={1}
                            >
                                <Item>
                                    <Typography variant="h5" fontWeight="bold" color="text.secondary" padding={1}>
                                        {title}
                                    </Typography>
                                </Item>
                                <Item>
                                    <Typography variant="h5" color="text.secondary" padding={1}>
                                        {auto ? "Auto" : "Manuell"}
                                    </Typography>
                                </Item>
                            </Stack>

                        </Item>
                        <Item style={{ marginRight: 20 }}>
                            <Button size="small" variant="contained" style={{ borderRadius: 20, minWidth: 0, padding: 5, marginRight: 5 }} onClick={(e) => runAgain(e)}><SyncIcon /> Nochmal</Button>
                        </Item>
                    </Stack>
                </Item>
                <Item>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                    >
                        <Item>
                            <Stack
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={1}
                            >
                                {/* <Item>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        style={{ borderRadius: 10, minWidth: 50, padding: 5, marginRight: 5 }}
                                    >{bauprojekte}/{allbauprojekte}</Button>
                                </Item> */}
                                <Item>
                                    {/* <Status status={status} current={bauprojekte} total={allbauprojekte} /> */}
                                    <SyncProgress syncData={syncData} />
                                </Item>
                                <Item>
                                    <Typography variant="h5" color="text.secondary" padding={2}>
                                        {util.convertToGermanyTime(executedat)}
                                    </Typography>
                                </Item>
                            </Stack>

                        </Item>
                        {width >= 480 ? <Item>
                            <Stack
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={1}
                            >
                                <Item>
                                    <MenuListComposition />
                                </Item>
                            </Stack>
                        </Item> : null}
                    </Stack>
                </Item>
            </Stack>

        </div>
    );
}

const MenuListComposition = () => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = (e) => {
        e.stopPropagation();

        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        event.stopPropagation()
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target)
        ) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            if (anchorRef.current)
                anchorRef.current.focus()
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <Stack direction="row" spacing={2}>
            <div>
                <Button
                    ref={anchorRef}
                    id="composition-button"
                    aria-controls={open ? 'composition-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={(e) => handleToggle(e)}
                    style={{ color: '#1976d2' }}
                >
                    <MoreHorizIcon />
                </Button>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement="bottom-start"
                    transition
                    disablePortal
                    style={{ zIndex: 10000000000 }}
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList
                                        autoFocusItem={open}
                                        id="composition-menu"
                                        aria-labelledby="composition-button"
                                        onKeyDown={handleListKeyDown}
                                    >
                                        <MenuItem onClick={handleClose}><RemoveRedEyeIcon style={{ marginRight: 10 }} />View Bauprojekte</MenuItem>
                                        <MenuItem onClick={handleClose}><AddCircleIcon style={{ marginRight: 10 }} />Add Notes</MenuItem>
                                        <MenuItem onClick={handleClose}><SubjectIcon style={{ marginRight: 10 }} />Report</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </Stack>
    );
}

const Status = ({ status, current, total }) => {
    if (status === 2)
        return (
            <IconButton style={{ backgroundColor: '#1976d2', color: '#00ff00' }}>
                <PublishedWithChangesIcon color='#0000ff' />
            </IconButton>
        );
    if (status === 3 && current === 0)
        return (
            <IconButton style={{ backgroundColor: '#1976d2', color: '#ff0000' }}>
                <SyncProblemIcon />
            </IconButton>
        );
    if (status === 3 && current < total)
        return (
            <IconButton style={{ backgroundColor: '#1976d2', color: '#FFDE21' }}>
                <SyncProblemIcon />
            </IconButton>
        );
    return (
        <IconButton style={{ backgroundColor: '#1976d2', color: '#fff', margin: 0 }}>
            <SyncIcon />
        </IconButton>
    );
}

const getColor = (status, current, total) => {
    if (status === 2) return 'green';
    if (status === 3 && current === 0) return 'red';
    if (status === 3 && current < total) return 'orange';
    return '#1976d2';
};

const SyncProgress = ({ syncData }) => {
    const { status, currentsavedobject, totalobjectToSave } = syncData;
    const total = parseInt(totalobjectToSave);
    const progress = Math.round((currentsavedobject / total) * 100);
    const color = getColor(status, currentsavedobject, total);

    return (
        <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
        >
            <Item>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                        variant="determinate"
                        value={progress}
                        size={"3rem"}
                        thickness={5}
                        sx={{ color }}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="caption" component="div" color="text.secondary">
                            {`${progress}%`}
                        </Typography>
                    </Box>
                </Box>
            </Item>

            <Item>
                <Status status={status} current={currentsavedobject} total={total} />
            </Item>

            <Item>
                <Button
                    size="small"
                    variant="contained"
                    style={{ borderRadius: 10, minWidth: 50, padding: 5, marginRight: 5 }}
                >{currentsavedobject}/{total}</Button>
            </Item>
        </Stack>
    );
};

export default Home;