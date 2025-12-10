import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import RefreshIcon from '@mui/icons-material/Refresh';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SearchIcon from '@mui/icons-material/Search';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SubjectIcon from '@mui/icons-material/Subject';
import SyncIcon from '@mui/icons-material/Sync';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import { Box, Button, CircularProgress, ClickAwayListener, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Stack, styled, TextField, Typography } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import { useEffect, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { transferActions } from '../actions/transfer.actions';
import { Spinner } from '../assets/spinner';
import { workerConstants } from '../constants';
import { util } from '../services';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Debounce search term to improve performance
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation onSearchChange={handleSearchChange} searchTerm={searchTerm} />
            <Transfers searchTerm={debouncedSearchTerm} />
        </div>
    );
}

const WORKER = workerConstants.WORKER

export const HomeNavigation = ({ onSearchChange, searchTerm }) => {
    const navigate = useNavigate()
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);
    const [featureCount, setFeatureCount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSimulateAutoSync = () => {
        setModalOpen(true);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
        setFeatureCount('');
        setIsSubmitting(false);
    }

    const handleSearchChange = (event) => {
        const value = event.target.value;
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    const handleSubmitFeatureData = async () => {
        if (!featureCount || isNaN(featureCount) || parseInt(featureCount) <= 0) {
            alert('Please enter a valid number greater than 0');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                featureDataCount: parseInt(featureCount)
            };

            const response = await fetch(WORKER + "makesimulation", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Auto-sync simulation started:', result);
                handleCloseModal();
                // Optionally refresh the transfers list or show success message
            } else {
                throw new Error('Failed to start simulation');
            }
        } catch (error) {
            console.error('Error submitting feature data:', error);
            alert('Failed to start simulation. Please try again.');
        } finally {
            setIsSubmitting(false);
            navigate(0)
        }
    }

    return (
        <>
            <Container>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    p={1}
                >
                    <Item>
                        <Button
                            size="large"
                            variant="contained"
                            style={{ borderRadius: 20, minWidth: 0, padding: 15, marginRight: 10 }}
                            onClick={() => goToTransfers()}
                        >
                            <RemoveRedEyeIcon style={{ marginRight: 10 }} />View Transfers
                        </Button>
                    </Item>
                    <Item>
                        <Button
                            size="large"
                            variant="outlined"
                            style={{
                                borderRadius: 20,
                                minWidth: 0,
                                padding: 15,
                                borderColor: '#1976d2',
                                color: '#1976d2'
                            }}
                            onClick={handleSimulateAutoSync}
                        >
                            <SyncIcon style={{ marginRight: 10 }} />Simulate Auto-Sync
                        </Button>
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
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon style={{ color: '#1976d2' }} />
                                    </InputAdornment>
                                ),
                                style: { borderRadius: 10 }
                            }}
                            InputLabelProps={{
                                style: { color: '#1976d2' }
                            }}
                        />
                    </Item>
                </Stack>
            </Container>

            {/* Simulate Auto-Sync Modal */}
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        borderRadius: 20,
                        padding: 20
                    }
                }}
            >
                <DialogTitle
                    style={{
                        color: '#1976d2',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        fontSize: '1.5rem'
                    }}
                >
                    <SyncIcon style={{ marginRight: 10, verticalAlign: 'middle' }} />
                    Simulate Auto-Sync
                </DialogTitle>

                <DialogContent style={{ paddingTop: 20 }}>
                    <Typography
                        variant="body1"
                        style={{
                            marginBottom: 20,
                            color: '#666',
                            textAlign: 'center'
                        }}
                    >
                        Enter the number of Feature-Data records you want to generate and transfer:
                    </Typography>

                    <TextField
                        fullWidth
                        label="Number of Feature-Data"
                        type="number"
                        value={featureCount}
                        onChange={(e) => setFeatureCount(e.target.value)}
                        placeholder="e.g., 100"
                        variant="outlined"
                        style={{ marginTop: 10 }}
                        InputProps={{
                            style: { borderRadius: 10 }
                        }}
                        InputLabelProps={{
                            style: { color: '#1976d2' }
                        }}
                    />
                </DialogContent>

                <DialogActions style={{ padding: '20px 24px', justifyContent: 'center' }}>
                    <Button
                        onClick={handleCloseModal}
                        variant="outlined"
                        style={{
                            borderRadius: 20,
                            padding: '10px 20px',
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            marginRight: 10
                        }}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmitFeatureData}
                        variant="contained"
                        style={{
                            borderRadius: 20,
                            padding: '10px 20px',
                            backgroundColor: '#1976d2'
                        }}
                        disabled={isSubmitting || !featureCount}
                    >
                        {isSubmitting ? (
                            <>
                                <CircularProgress size={20} style={{ marginRight: 10, color: 'white' }} />
                                Starting...
                            </>
                        ) : (
                            <>
                                <PlayArrowIcon style={{ marginRight: 5 }} />
                                Start Simulation
                            </>
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
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

const Transfers = ({ searchTerm }) => {
    const t = useSelector(state => state.transfers.transfers);
    const [transferList, setTransferList] = useState(t);
    const l = useSelector(state => state.transfers.loading);

    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const [dataLimit, setDataLimit] = useState(1000);

    const getFilteredData = () => {
        if (!t || !t.transfers) return [];

        let filtered = t.transfers;

        // Apply search filter if searchTerm exists
        if (searchTerm && searchTerm.trim() !== '') {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            filtered = t.transfers.filter(transfer => {
                return (
                    (transfer.title && transfer.title.toLowerCase().includes(lowerSearchTerm)) ||
                    (transfer.tuid && transfer.tuid.toLowerCase().includes(lowerSearchTerm)) ||
                    (transfer.auto !== undefined && (transfer.auto ? 'auto' : 'manuell').includes(lowerSearchTerm)) ||
                    (transfer.status && transfer.status.toString().includes(lowerSearchTerm))
                );
            });
        }

        return filtered;
    };

    const getPaginatedData = () => {
        const filteredData = getFilteredData();
        const startIndex = page * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return filteredData.slice(startIndex, endIndex);
    };

    const handleRefresh = () => {
        dispatch(transferActions.getAllTransfers());
    };

    useEffect(() => {
        dispatch(transferActions.getAllTransfers())
    }, []);

    useEffect(() => {
        setTransferList(t);
    }, [t]);

    useEffect(() => {
        setTransferList(t);
        // Reset to first page when search term changes
        setPage(1);
    }, [t, searchTerm]);

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
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ paddingTop: 30 }}
                    >
                        <Item>
                            <Typography variant="h5" fontWeight="bold" color="text.secondary">
                                Transfers {searchTerm && `(${getFilteredData().length} results)`}
                            </Typography>
                        </Item>
                        <Item>
                            <Button
                                variant="outlined"
                                onClick={handleRefresh}
                                disabled={l}
                                style={{
                                    borderRadius: 20,
                                    minWidth: 0,
                                    padding: '10px 15px',
                                    borderColor: '#1976d2',
                                    color: '#1976d2'
                                }}
                            >
                                {l ? (
                                    <>
                                        <CircularProgress size={16} style={{ marginRight: 8, color: '#1976d2' }} />
                                        Refreshing...
                                    </>
                                ) : (
                                    <>
                                        <RefreshIcon style={{ marginRight: 8 }} />
                                        Refresh
                                    </>
                                )}
                            </Button>
                        </Item>
                    </Stack>

                    <Grid
                        container
                        spacing={4}
                        // className="marginLaptop"
                        justifyItems="center"
                        style={{ marginTop: 30 }}
                    >
                        {getPaginatedData().length > 0 ? (
                            getPaginatedData().map((d, idx) => (
                                <Grid key={idx} size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <Transfer index={idx} data={d} />
                                </Grid>
                            ))
                        ) : (
                            <Grid size={{ xs: 12 }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: '#666'
                                }}>
                                    <SearchIcon style={{ fontSize: 60, color: '#1976d2', marginBottom: 16 }} />
                                    <Typography variant="h6" style={{ marginBottom: 8 }}>
                                        {searchTerm ? 'No transfers found' : 'No transfers available'}
                                    </Typography>
                                    <Typography variant="body2">
                                        {searchTerm
                                            ? `No transfers match "${searchTerm}". Try a different search term.`
                                            : 'There are no transfers to display at the moment.'
                                        }
                                    </Typography>
                                </div>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            );
        }
    }
}

const Transfer = ({ index, data }) => {
    const { id, tuid, title, auto, status, executedat, bauprojekte, allbauprojekte } = data
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
        navigate("/transfer/" + tuid)
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
                    const response = await fetch(WORKER + 'sync-status/' + tuid);
                    const data = await response.json();
                    // const data = await mockBackend();
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
    const progress = total == 0 ? 0 : Math.round((currentsavedobject / total) * 100);
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