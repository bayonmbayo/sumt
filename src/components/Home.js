import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RefreshIcon from '@mui/icons-material/Refresh';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import SearchIcon from '@mui/icons-material/Search';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import SubjectIcon from '@mui/icons-material/Subject';
import SyncIcon from '@mui/icons-material/Sync';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
    Box, Button, Card, CardActionArea, CardContent, Chip, CircularProgress, ClickAwayListener, Container,
    FormControl, Grid, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Select, Stack, styled, TextField, Tooltip, Typography, useMediaQuery,
    useTheme
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useEffect, useRef, useState } from 'react';
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

export const HomeNavigation = ({
    onSearchChange,
    searchTerm,
    searchPlaceholder = "Search Transfer",
    searchLabel = "Search",
    showTransfersButton = true,
    showNewButton = true,
    showSettingsButton = true,
    showSearchField = true,
}) => {
    const navigate = useNavigate()
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // Custom breakpoint for showing icon-only buttons (866px)
    const isCompact = useMediaQuery('(max-width:866px)');

    // Commented out - Simulate Auto-Sync functionality
    // const [modalOpen, setModalOpen] = useState(false);
    // const [featureCount, setFeatureCount] = useState('');
    // const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Commented out - Simulate Auto-Sync handlers
    // const handleSimulateAutoSync = () => {
    //     setModalOpen(true);
    // }

    // const handleCloseModal = () => {
    //     setModalOpen(false);
    //     setFeatureCount('');
    //     setIsSubmitting(false);
    // }

    const handleSearchChange = (event) => {
        const value = event.target.value;
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    // Commented out - Simulate Auto-Sync submit handler
    // const handleSubmitFeatureData = async () => {
    //     if (!featureCount || isNaN(featureCount) || parseInt(featureCount) <= 0) {
    //         alert('Please enter a valid number greater than 0');
    //         return;
    //     }

    //     setIsSubmitting(true);

    //     try {
    //         const payload = {
    //             featureDataCount: parseInt(featureCount)
    //         };

    //         const response = await fetch(WORKER + "makesimulation", {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(payload)
    //         });

    //         if (response.ok) {
    //             const result = await response.json();
    //             console.log('Auto-sync simulation started:', result);
    //             handleCloseModal();
    //         } else {
    //             throw new Error('Failed to start simulation');
    //         }
    //     } catch (error) {
    //         console.error('Error submitting feature data:', error);
    //         alert('Failed to start simulation. Please try again.');
    //     } finally {
    //         setIsSubmitting(false);
    //         navigate(0)
    //     }
    // }

    return (
        <>
            <Container>
                <Stack
                    direction={isCompact ? 'column' : 'row'}
                    justifyContent="space-between"
                    alignItems={isCompact ? 'stretch' : 'center'}
                    spacing={2}
                    sx={{ py: 2 }}
                >
                    {/* Action Buttons */}
                    <Stack
                        direction="row"
                        justifyContent={isCompact ? 'center' : 'flex-start'}
                        alignItems="center"
                        spacing={1}
                    >
                        {showTransfersButton && (
                            <Tooltip title="View Transfers">
                                <Button
                                    size="large"
                                    variant="contained"
                                    sx={{
                                        borderRadius: 20,
                                        minWidth: isCompact ? 50 : 'auto',
                                        padding: isCompact ? '12px' : '12px 20px',
                                    }}
                                    onClick={() => goToTransfers()}
                                >
                                    <RemoveRedEyeIcon sx={{ mr: isCompact ? 0 : 1 }} />
                                    {!isCompact && 'View Transfers'}
                                </Button>
                            </Tooltip>
                        )}

                        {showNewButton && (
                            <Tooltip title="New Transfer">
                                <Button
                                    size="large"
                                    variant="contained"
                                    sx={{
                                        borderRadius: 20,
                                        minWidth: isCompact ? 50 : 'auto',
                                        padding: isCompact ? '12px' : '12px 20px',
                                    }}
                                    onClick={() => goToNewTransfer()}
                                >
                                    <AddCircleIcon sx={{ mr: isCompact ? 0 : 1 }} />
                                    {!isCompact && 'New'}
                                </Button>
                            </Tooltip>
                        )}

                        {showSettingsButton && (
                            <Tooltip title="Settings">
                                <Button
                                    size="large"
                                    variant="contained"
                                    sx={{
                                        borderRadius: 20,
                                        minWidth: isCompact ? 50 : 'auto',
                                        padding: isCompact ? '12px' : '12px 20px',
                                    }}
                                    onClick={() => goToSettings()}
                                >
                                    <SettingsSuggestIcon sx={{ mr: isCompact ? 0 : 1 }} />
                                    {!isCompact && 'Settings'}
                                </Button>
                            </Tooltip>
                        )}

                        {/* Commented out - Simulate Auto-Sync Button */}
                        {/* <Tooltip title="Simulate Auto-Sync">
                            <Button
                                size="large"
                                variant="outlined"
                                sx={{
                                    borderRadius: 20,
                                    minWidth: isMobile ? 50 : 'auto',
                                    padding: isMobile ? '12px' : '12px 20px',
                                    borderColor: '#1976d2',
                                    color: '#1976d2'
                                }}
                                onClick={handleSimulateAutoSync}
                            >
                                <SyncIcon sx={{ mr: isMobile ? 0 : 1 }} />
                                {!isMobile && 'Simulate Auto-Sync'}
                            </Button>
                        </Tooltip> */}
                    </Stack>

                    {/* Search Field - Only shown when showSearchField is true */}
                    {showSearchField && (
                        <Box sx={{ minWidth: isCompact ? '100%' : 300, maxWidth: { sm: 400 } }}>
                            <TextField
                                fullWidth
                                label={searchLabel}
                                placeholder={searchPlaceholder}
                                size="small"
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
                        </Box>
                    )}
                </Stack>
            </Container>

            {/* Commented out - Simulate Auto-Sync Modal */}
            {/* <Dialog
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
            </Dialog> */}
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
    const [dataLimit, setDataLimit] = useState(10);
    const pageSizeOptions = [10, 20, 50, 100];

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
                    (transfer.constructionProjectName && transfer.constructionProjectName.toLowerCase().includes(lowerSearchTerm))
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

    const getTotalPages = () => {
        const filteredData = getFilteredData();
        return Math.ceil(filteredData.length / dataLimit);
    };

    const handlePageChange = (newPage) => {
        const totalPages = getTotalPages();
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handlePageSizeChange = (event) => {
        const newSize = event.target.value;
        setDataLimit(newSize);
        setPage(1); // Reset to first page when changing page size
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

    // Header component with refresh button - reused in both states
    const TransfersHeader = () => (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{ paddingTop: 30 }}
        >
            <Item>
                <Typography variant="h5" fontWeight="bold" color="text.secondary">
                    Transfers {!l && searchTerm && `(${getFilteredData().length} results)`}
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
    );

    // Pagination component
    const PaginationControls = () => {
        const totalPages = getTotalPages();
        const filteredData = getFilteredData();
        const startItem = filteredData.length === 0 ? 0 : (page - 1) * dataLimit + 1;
        const endItem = Math.min(page * dataLimit, filteredData.length);

        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: 2,
                    mt: 3,
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 3,
                }}
            >
                {/* Page size selector */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                        Show:
                    </Typography>
                    <FormControl size="small">
                        <Select
                            value={dataLimit}
                            onChange={handlePageSizeChange}
                            sx={{
                                borderRadius: 2,
                                minWidth: 80,
                                backgroundColor: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#1976d2',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#1565c0',
                                },
                            }}
                        >
                            {pageSizeOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography variant="body2" color="text.secondary">
                        per page
                    </Typography>
                </Stack>

                {/* Results info */}
                <Typography variant="body2" color="text.secondary">
                    Showing {startItem}-{endItem} of {filteredData.length} transfers
                </Typography>

                {/* Page navigation */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    {/* First page */}
                    <Tooltip title="First page">
                        <span>
                            <IconButton
                                onClick={() => handlePageChange(1)}
                                disabled={page === 1}
                                size="small"
                                sx={{
                                    color: page === 1 ? 'grey.400' : '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#e3f2fd',
                                    },
                                }}
                            >
                                <KeyboardDoubleArrowLeftIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    {/* Previous page */}
                    <Tooltip title="Previous page">
                        <span>
                            <IconButton
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                size="small"
                                sx={{
                                    color: page === 1 ? 'grey.400' : '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#e3f2fd',
                                    },
                                }}
                            >
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    {/* Page indicator */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 2,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            Page
                        </Typography>
                        <Chip
                            label={page}
                            size="small"
                            sx={{
                                fontWeight: 600,
                                backgroundColor: '#1976d2',
                                color: 'white',
                                minWidth: 32,
                            }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            of {totalPages || 1}
                        </Typography>
                    </Box>

                    {/* Next page */}
                    <Tooltip title="Next page">
                        <span>
                            <IconButton
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages || totalPages === 0}
                                size="small"
                                sx={{
                                    color: page === totalPages || totalPages === 0 ? 'grey.400' : '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#e3f2fd',
                                    },
                                }}
                            >
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    {/* Last page */}
                    <Tooltip title="Last page">
                        <span>
                            <IconButton
                                onClick={() => handlePageChange(totalPages)}
                                disabled={page === totalPages || totalPages === 0}
                                size="small"
                                sx={{
                                    color: page === totalPages || totalPages === 0 ? 'grey.400' : '#1976d2',
                                    '&:hover': {
                                        backgroundColor: '#e3f2fd',
                                    },
                                }}
                            >
                                <KeyboardDoubleArrowRightIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </Box>
        );
    };

    if (l) {
        return (
            <>
                <Container>
                    <TransfersHeader />
                    <Spinner show={l} />
                </Container>
            </>
        )
    } else {
        if (t && t.transfers) {
            return (
                <Container>
                    <TransfersHeader />

                    {/* Top Pagination */}
                    {getFilteredData().length > 0 && <PaginationControls />}

                    <Grid
                        container
                        spacing={4}
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

                    {/* Bottom Pagination */}
                    {getFilteredData().length > 0 && <PaginationControls />}
                </Container>
            );
        }
    }
}

/**
 * Transfer Component
 * 
 * Status values:
 *   status = 1: Transfer is processing
 *   status = 2: Transfer is finished
 * 
 * Success values:
 *   success = 0: Transfer is running
 *   success = 1: Transfer finished and FAILED
 *   success = 2: Transfer finished and SUCCEEDED
 * 
 * hasErrors: boolean - indicates if any elements in the transfer have errors
 */
const Transfer = ({ index, data }) => {
    const {
        tuid,
        title,
        auto,
        status,
        success,
        hasErrors,
        executedat,
        bauprojekte,
        allbauprojekte,
        constructionProjectName,
    } = data;

    const navigate = useNavigate();
    const theme = useTheme();
    const showMenu = useMediaQuery("(min-width:480px)");

    const [isClicked, setIsClicked] = useState(false);
    const [syncData, setSyncData] = useState(() => ({
        status,
        success,
        hasErrors,
        currentsavedobject: bauprojekte,
        totalobjectToSave: allbauprojekte,
    }));

    // Keep syncData aligned if parent data changes
    useEffect(() => {
        setSyncData({
            status,
            success,
            hasErrors,
            currentsavedobject: bauprojekte,
            totalobjectToSave: allbauprojekte,
        });
    }, [status, success, hasErrors, bauprojekte, allbauprojekte]);

    const handleOpen = () => {
        setIsClicked(true);
        navigate(`/transfer/${tuid}`);
    };

    const runAgain = (e) => {
        e.stopPropagation();
        // TODO: trigger your "run again" endpoint
        console.log("Run Again", tuid);
    };

    // Short click feedback
    useEffect(() => {
        if (!isClicked) return;
        const t = setTimeout(() => setIsClicked(false), 200);
        return () => clearTimeout(t);
    }, [isClicked]);

    // Poll sync status while transfer is running (success === 0)
    useEffect(() => {
        // Only poll if transfer is running
        if (success !== 0) return;

        let intervalId;

        const fetchSyncStatus = async () => {
            try {
                const res = await fetch(`${WORKER}sync-status/${tuid}`);
                const next = await res.json();
                setSyncData(next);

                // Stop polling when transfer is finished (success === 1 or success === 2)
                if (next.success === 1 || next.success === 2) {
                    if (intervalId) clearInterval(intervalId);
                }
            } catch (err) {
                console.error("Error fetching sync status:", err);
            }
        };

        // Run immediately + poll
        fetchSyncStatus();
        intervalId = setInterval(fetchSyncStatus, 500);

        return () => clearInterval(intervalId);
    }, [success, tuid]);

    // Determine border color based on state
    const getBorderColor = () => {
        if (syncData.success === 1) return '#f44336'; // Failed - red
        if (syncData.hasErrors) return '#ff9800'; // Has errors - orange
        return 'divider'; // Default
    };

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: "2px solid",
                borderColor: getBorderColor(),
                bgcolor: isClicked ? "grey.50" : "background.paper",
                transition: "box-shadow .2s ease, transform .2s ease, background-color .2s ease",
                "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-1px)",
                },
            }}
        >
            <CardActionArea onClick={handleOpen} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 2 }}>
                    {/* Header row */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        alignItems={{ xs: "stretch", sm: "center" }}
                        justifyContent="space-between"
                    >
                        {/* Title + mode + error indicator */}
                        <Box sx={{ minWidth: 0 }}>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ flexWrap: "wrap" }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={800}
                                    color="text.secondary"
                                    sx={{
                                        minWidth: 0,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        maxWidth: { xs: "100%", sm: 400 },
                                    }}
                                >
                                    {title}
                                </Typography>

                                <Chip
                                    label={auto ? "Auto" : "Manuell"}
                                    size="small"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />

                                {/* Error Indicators */}
                                {syncData.success === 1 && (
                                    <Tooltip title="Transfer failed">
                                        <Chip
                                            icon={<ErrorIcon />}
                                            label="Failed"
                                            size="small"
                                            color="error"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Tooltip>
                                )}

                                {syncData.success === 2 && syncData.hasErrors && (
                                    <Tooltip title="Transfer completed with errors in some elements">
                                        <Chip
                                            icon={<WarningAmberIcon />}
                                            label="Has Errors"
                                            size="small"
                                            color="warning"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </Tooltip>
                                )}

                                {syncData.success === 0 && syncData.hasErrors && (
                                    <Tooltip title="Errors encountered during transfer">
                                        <Chip
                                            icon={<WarningAmberIcon />}
                                            label="Errors"
                                            size="small"
                                            color="warning"
                                            variant="outlined"
                                            sx={{
                                                fontWeight: 600,
                                                animation: 'pulse 2s infinite',
                                                '@keyframes pulse': {
                                                    '0%': { opacity: 1 },
                                                    '50%': { opacity: 0.6 },
                                                    '100%': { opacity: 1 },
                                                },
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            </Stack>
                        </Box>

                        {/* Actions */}
                        <Stack
                            direction="row"
                            spacing={1}
                            justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                        >
                            <Button
                                size="small"
                                variant="contained"
                                onClick={runAgain}
                                startIcon={<SyncIcon />}
                                sx={{ borderRadius: 999, px: 1.5 }}
                            >
                                Nochmal
                            </Button>

                            {showMenu ? <MenuListComposition /> : null}
                        </Stack>
                    </Stack>

                    {/* Construction project */}
                    {constructionProjectName ? (
                        <Box sx={{ mt: 1 }}>
                            <Chip
                                icon={<AccountTreeIcon />}
                                label={constructionProjectName}
                                variant="outlined"
                                color="primary"
                                size="small"
                                sx={{
                                    maxWidth: { xs: 220, sm: 420 },
                                    "& .MuiChip-label": {
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    },
                                }}
                            />
                        </Box>
                    ) : null}

                    {/* Footer row */}
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        sx={{ mt: 2 }}
                    >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <SyncProgress syncData={syncData} />
                            <Typography variant="body1" color="text.secondary">
                                {util.convertToGermanyTime(executedat)}
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

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
                    placement="bottom-end"
                    transition
                    disablePortal={false}
                    sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}
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

/**
 * Status Icon Component
 * 
 * Shows different icons based on success state:
 *   success = 0: Running (blue sync icon, spinning)
 *   success = 1: Failed (red error icon)
 *   success = 2: Succeeded (green check icon) - with warning if hasErrors
 */
const Status = ({ success, hasErrors }) => {
    // success = 2: Finished and SUCCEEDED
    if (success === 2) {
        // Show warning icon if there are errors in elements
        if (hasErrors) {
            return (
                <Tooltip title="Completed with errors">
                    <IconButton
                        style={{
                            backgroundColor: '#fff3e0',
                            color: '#ff9800'
                        }}
                        size="small"
                    >
                        <WarningAmberIcon />
                    </IconButton>
                </Tooltip>
            );
        }
        return (
            <IconButton
                style={{
                    backgroundColor: '#e8f5e9',
                    color: '#4caf50'
                }}
                size="small"
            >
                <CheckCircleIcon />
            </IconButton>
        );
    }

    // success = 1: Finished and FAILED
    if (success === 1) {
        return (
            <IconButton
                style={{
                    backgroundColor: '#ffebee',
                    color: '#f44336'
                }}
                size="small"
            >
                <ErrorIcon />
            </IconButton>
        );
    }

    // success = 0: Running
    // Show warning if errors encountered during run
    if (hasErrors) {
        return (
            <Tooltip title="Running with errors">
                <IconButton
                    style={{
                        backgroundColor: '#fff3e0',
                        color: '#ff9800'
                    }}
                    size="small"
                >
                    <WarningAmberIcon
                        sx={{
                            animation: 'pulse 1.5s infinite',
                            '@keyframes pulse': {
                                '0%': { opacity: 1 },
                                '50%': { opacity: 0.5 },
                                '100%': { opacity: 1 },
                            },
                        }}
                    />
                </IconButton>
            </Tooltip>
        );
    }

    return (
        <IconButton
            style={{
                backgroundColor: '#e3f2fd',
                color: '#1976d2'
            }}
            size="small"
        >
            <SyncIcon
                sx={{
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                    },
                }}
            />
        </IconButton>
    );
}

/**
 * Get color based on success state and hasErrors
 * 
 *   success = 0: Blue (running) or Orange (running with errors)
 *   success = 1: Red (failed)
 *   success = 2: Green (succeeded) or Orange (succeeded with errors)
 */
const getColor = (success, hasErrors) => {
    if (success === 1) return '#f44336'; // Red - failed
    if (success === 2) {
        return hasErrors ? '#ff9800' : '#4caf50'; // Orange if errors, otherwise Green
    }
    return hasErrors ? '#ff9800' : '#1976d2'; // Orange if errors while running, otherwise Blue
};

/**
 * SyncProgress Component
 * 
 * Shows progress circle, status icon, and count
 */
const SyncProgress = ({ syncData }) => {
    const { success, hasErrors, currentsavedobject, totalobjectToSave } = syncData;
    const total = parseInt(totalobjectToSave) || 0;
    const current = parseInt(currentsavedobject) || 0;
    const progress = total === 0 ? 0 : Math.round((current / total) * 100);
    const color = getColor(success, hasErrors);

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
                        variant={success === 0 ? "indeterminate" : "determinate"}
                        value={success === 0 ? undefined : progress}
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
                <Status success={success} hasErrors={hasErrors} />
            </Item>

            <Item>
                <Chip
                    label={`${current}/${total}`}
                    size="small"
                    sx={{
                        fontWeight: 600,
                        backgroundColor: success === 1 ? '#ffebee' :
                            (success === 2 && hasErrors) ? '#fff3e0' :
                                success === 2 ? '#e8f5e9' :
                                    hasErrors ? '#fff3e0' :
                                        '#e3f2fd',
                        color: color,
                        borderRadius: 2,
                    }}
                />
            </Item>
        </Stack>
    );
};

export default Home;