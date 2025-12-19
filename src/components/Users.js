import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Stack,
    styled,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
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
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Debounce search term to improve performance
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSearchChange = (term) => {
        setSearchTerm(term);
    };

    useEffect(() => {
        dispatch(profileActions.getProfileList())
    }, [dispatch]);

    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation
                onSearchChange={handleSearchChange}
                searchTerm={searchTerm}
                searchPlaceholder="Search Users"
                searchLabel="Search"
                showTransfersButton={true}
                showNewButton={false}
                showSettingsButton={true}
            />
            <ViewUserBody transfer={transfer} searchTerm={debouncedSearchTerm} />
        </div>
    );
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'inherit',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: '#fff',
    boxShadow: 'none'
}));

const ViewUserBody = ({ transfer, searchTerm }) => {
    const u = useSelector((state) => state.user.user);
    const p = useSelector(state => state.profiles.profilList);
    const l = useSelector(state => state.profiles.loading);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [page, setPage] = useState(1);
    const [dataLimit, setDataLimit] = useState(10);
    const pageSizeOptions = [10, 20, 50, 100];

    const getFilteredData = () => {
        if (!p || !p.profilList) return [];

        let filtered = p.profilList;

        // Apply search filter if searchTerm exists
        if (searchTerm && searchTerm.trim() !== '') {
            const lowerSearchTerm = searchTerm.toLowerCase().trim();
            filtered = p.profilList.filter(user => {
                return (
                    (user.firstname && user.firstname.toLowerCase().includes(lowerSearchTerm)) ||
                    (user.name && user.name.toLowerCase().includes(lowerSearchTerm)) ||
                    (user.email && user.email.toLowerCase().includes(lowerSearchTerm)) ||
                    (user.role && user.role.toLowerCase().includes(lowerSearchTerm)) ||
                    (`${user.firstname} ${user.name}`.toLowerCase().includes(lowerSearchTerm))
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
        setPage(1);
    };

    const handleRefresh = () => {
        dispatch(profileActions.getProfileList());
    };

    const handleAddUser = () => {
        navigate('/newuser');
    };

    // Reset to first page when search term changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    // Header component
    const UsersHeader = () => (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{ pt: 3 }}
        >
            <Typography variant="h5" fontWeight="bold" color="text.secondary">
                Users {!l && searchTerm && `(${getFilteredData().length} results)`}
            </Typography>

            <Stack direction="row" spacing={1}>
                <Tooltip title="Add New User">
                    <Button
                        variant="contained"
                        onClick={handleAddUser}
                        sx={{
                            borderRadius: 20,
                            minWidth: isMobile ? 40 : 'auto',
                            px: isMobile ? 1.5 : 2,
                        }}
                    >
                        <PersonAddIcon sx={{ mr: isMobile ? 0 : 1 }} />
                        {!isMobile && 'Add User'}
                    </Button>
                </Tooltip>

                <Tooltip title="Refresh">
                    <Button
                        variant="outlined"
                        onClick={handleRefresh}
                        disabled={l}
                        sx={{
                            borderRadius: 20,
                            minWidth: 0,
                            px: isMobile ? 1.5 : 2,
                            borderColor: '#1976d2',
                            color: '#1976d2'
                        }}
                    >
                        {l ? (
                            <CircularProgress size={20} sx={{ color: '#1976d2' }} />
                        ) : (
                            <>
                                <RefreshIcon sx={{ mr: isMobile ? 0 : 1 }} />
                                {!isMobile && 'Refresh'}
                            </>
                        )}
                    </Button>
                </Tooltip>
            </Stack>
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
                    Showing {startItem}-{endItem} of {filteredData.length} users
                </Typography>

                {/* Page navigation */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Tooltip title="First page">
                        <span>
                            <IconButton
                                onClick={() => handlePageChange(1)}
                                disabled={page === 1}
                                size="small"
                                sx={{
                                    color: page === 1 ? 'grey.400' : '#1976d2',
                                    '&:hover': { backgroundColor: '#e3f2fd' },
                                }}
                            >
                                <KeyboardDoubleArrowLeftIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Previous page">
                        <span>
                            <IconButton
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                size="small"
                                sx={{
                                    color: page === 1 ? 'grey.400' : '#1976d2',
                                    '&:hover': { backgroundColor: '#e3f2fd' },
                                }}
                            >
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2 }}>
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

                    <Tooltip title="Next page">
                        <span>
                            <IconButton
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages || totalPages === 0}
                                size="small"
                                sx={{
                                    color: page === totalPages || totalPages === 0 ? 'grey.400' : '#1976d2',
                                    '&:hover': { backgroundColor: '#e3f2fd' },
                                }}
                            >
                                <KeyboardArrowRightIcon />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Last page">
                        <span>
                            <IconButton
                                onClick={() => handlePageChange(totalPages)}
                                disabled={page === totalPages || totalPages === 0}
                                size="small"
                                sx={{
                                    color: page === totalPages || totalPages === 0 ? 'grey.400' : '#1976d2',
                                    '&:hover': { backgroundColor: '#e3f2fd' },
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

    // Check if user is admin
    if (u && u.role && u.role.includes("ADMIN")) {
        if (l) {
            return (
                <Container>
                    <UsersHeader />
                    <Spinner show={l} />
                </Container>
            );
        } else {
            if (p && p.profilList) {
                return (
                    <Container>
                        <UsersHeader />

                        {/* Top Pagination */}
                        {getFilteredData().length > 0 && <PaginationControls />}

                        <Grid
                            container
                            spacing={2}
                            justifyItems="center"
                            sx={{ mt: 3 }}
                        >
                            {getPaginatedData().length > 0 ? (
                                getPaginatedData().map((d, idx) => (
                                    <Grid key={d.uuid || idx} size={{ xs: 12 }}>
                                        <User data={d} />
                                    </Grid>
                                ))
                            ) : (
                                <Grid size={{ xs: 12 }}>
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            py: 5,
                                            color: '#666'
                                        }}
                                    >
                                        <SearchIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            {searchTerm ? 'No users found' : 'No users available'}
                                        </Typography>
                                        <Typography variant="body2">
                                            {searchTerm
                                                ? `No users match "${searchTerm}". Try a different search term.`
                                                : 'There are no users to display at the moment.'
                                            }
                                        </Typography>
                                    </Box>
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

    // Non-admin view
    return (
        <Container>
            <Typography variant="h5" fontWeight="bold" color="text.secondary" sx={{ pt: 3 }}>
                Users
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ pt: 1, pb: 3 }}>
                Diese Funktion ist nicht verfügbar.
            </Typography>
        </Container>
    );
}

const User = ({ data }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [openDeleteUser, setOpenDeleteUser] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const updateUser = (e) => {
        e.stopPropagation();
        navigate('/user/' + data.uuid);
    };

    const openConfirmDelete = (e) => {
        e.stopPropagation();
        setOpenDeleteUser(true);
    };

    const closeDeleteUser = () => {
        setOpenDeleteUser(false);
    };

    const deleteUser = () => {
        setShowSpinner(true);
        profileService.deleteUser(data.uuid)
            .then(() => {
                setShowSpinner(false);
                dispatch(profileActions.getProfileList());
            })
            .catch(() => {
                setShowSpinner(false);
                dispatch(profileActions.getProfileList());
            });
    };

    const fullName = `${data.firstname} ${data.name}`;
    const displayName = isMobile ? fullName : `${fullName} - ${data.email}`;

    return (
        <>
            <ConfirmDelete
                openDeleteUser={openDeleteUser}
                closeDeleteUser={closeDeleteUser}
                deleteUser={deleteUser}
                fullname={fullName}
            />
            <Spinner show={showSpinner} />

            <Card
                elevation={0}
                onClick={handleToggle}
                sx={{
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: '#1976d2',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-1px)',
                    },
                }}
            >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={1.5}
                    >
                        {/* User Info */}
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                            sx={{ flexWrap: 'wrap', minWidth: 0 }}
                        >
                            <Chip
                                label={data.role}
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: data.role?.includes('ADMIN') ? '#1976d2' : '#757575',
                                    color: '#fff',
                                    textTransform: 'uppercase',
                                }}
                            />
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: { xs: 200, sm: 400 },
                                }}
                            >
                                {displayName}
                            </Typography>
                        </Stack>

                        {/* Actions */}
                        <Stack
                            direction="row"
                            spacing={1}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Tooltip title="Edit User">
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={updateUser}
                                    sx={{
                                        borderRadius: 2,
                                        minWidth: isMobile ? 40 : 'auto',
                                        px: isMobile ? 1 : 2,
                                    }}
                                >
                                    <EditIcon sx={{ mr: isMobile ? 0 : 0.5 }} fontSize="small" />
                                    {!isMobile && 'Update'}
                                </Button>
                            </Tooltip>

                            <Tooltip title="Delete User">
                                <IconButton
                                    onClick={openConfirmDelete}
                                    sx={{
                                        backgroundColor: '#f44336',
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: '#d32f2f',
                                        },
                                    }}
                                    size="small"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Stack>

                    {/* Expanded Details */}
                    {isExpanded && (
                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                backgroundColor: '#f5f5f5',
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 1.5 }}>
                                Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Vorname:</strong> {data.firstname}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Nachname:</strong> {data.name}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Email / Benutzername:</strong> {data.email}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Role:</strong> {data.role}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export function ConfirmDelete({ openDeleteUser, closeDeleteUser, deleteUser, fullname }) {
    return (
        <Dialog
            open={openDeleteUser}
            onClose={closeDeleteUser}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1,
                }
            }}
        >
            <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 'bold' }}>
                Delete User
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Möchten Sie den Nutzer "<strong>{fullname}</strong>" löschen?
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    variant="outlined"
                    onClick={closeDeleteUser}
                    sx={{ borderRadius: 2 }}
                >
                    Abbrechen
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={deleteUser}
                    autoFocus
                    sx={{ borderRadius: 2 }}
                >
                    Löschen
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default Users;