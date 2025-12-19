import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import {
    AppBar,
    Box,
    Container,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userActions } from '../actions/user.actions';
import logo from './lbm.png';

const Header = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        dispatch(userActions.session());
    }, [dispatch]);

    return (
        <>
            {/* Fixed AppBar */}
            <AppBar
                position="fixed"
                elevation={2}
                sx={{
                    backgroundColor: '#1976d2',
                    backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar
                        sx={{
                            justifyContent: 'space-between',
                            minHeight: { xs: 56, sm: 64 },
                            px: { xs: 0, sm: 2 },
                        }}
                    >
                        {/* Logo & Brand */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {/* Small logo in header for mobile */}
                            {isMobile && (
                                <Box
                                    component="img"
                                    src={logo}
                                    alt="LBM Logo"
                                    sx={{
                                        height: 32,
                                        width: 'auto',
                                        filter: 'brightness(0) invert(1)',
                                        opacity: 0.9,
                                    }}
                                />
                            )}
                            <Typography
                                variant={isMobile ? 'h6' : 'h5'}
                                fontWeight="bold"
                                component={Link}
                                to={user ? '/transfers' : '/'}
                                sx={{
                                    color: '#fff',
                                    textDecoration: 'none',
                                    letterSpacing: isMobile ? 0.5 : 1,
                                    '&:hover': {
                                        opacity: 0.9,
                                    },
                                }}
                            >
                                FLISTRA2NEO
                            </Typography>
                        </Box>

                        {/* User Menu */}
                        {user && <UserMenu user={user} />}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Spacer for fixed AppBar */}
            <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

            {/* Logo Section - Only on larger screens */}
            {!isMobile && (
                <Container maxWidth="xl">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 4,
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="LBM Logo"
                            sx={{
                                height: { xs: 60, sm: 80, md: 100 },
                                width: 'auto',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                            }}
                        />
                    </Box>
                </Container>
            )}

            {/* Smaller spacer for mobile (no logo) */}
            {isMobile && <Box sx={{ height: 16 }} />}
        </>
    );
};

const UserMenu = ({ user }) => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const isAdmin = user?.role?.includes('ADMIN');

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleMenuAction = (action) => (event) => {
        handleClose(event);

        switch (action) {
            case 'logout':
                dispatch(userActions.logout());
                navigate('/');
                break;
            case 'users':
                navigate('/users');
                break;
            case 'profile':
                navigate('/user/' + user.uuid);
                break;
            default:
                break;
        }
    };

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    };

    // Return focus to button when menu closes
    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current?.focus();
        }
        prevOpen.current = open;
    }, [open]);

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            {/* User info - hidden on mobile */}
            {!isMobile && user?.username && (
                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 500,
                        mr: 1,
                    }}
                >
                    {user.username}
                </Typography>
            )}

            {/* Menu Button */}
            <IconButton
                ref={anchorRef}
                id="user-menu-button"
                aria-controls={open ? 'user-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                sx={{
                    color: '#fff',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                }}
            >
                <MenuIcon />
            </IconButton>

            {/* Dropdown Menu */}
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-end"
                transition
                disablePortal
                sx={{ zIndex: theme.zIndex.modal + 1 }}
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === 'bottom-end' ? 'right top' : 'right bottom',
                        }}
                    >
                        <Paper
                            elevation={8}
                            sx={{
                                borderRadius: 2,
                                minWidth: 200,
                                mt: 1,
                                overflow: 'hidden',
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="user-menu"
                                    aria-labelledby="user-menu-button"
                                    onKeyDown={handleListKeyDown}
                                    sx={{ py: 1 }}
                                >
                                    {/* User info header - shown in menu on mobile */}
                                    {isMobile && user?.username && (
                                        <>
                                            <Box sx={{ px: 2, py: 1 }}>
                                                <Typography
                                                    variant="subtitle2"
                                                    color="text.secondary"
                                                    sx={{ fontWeight: 600 }}
                                                >
                                                    Signed in as
                                                </Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {user.username}
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ my: 1 }} />
                                        </>
                                    )}

                                    {/* Admin: Users Management */}
                                    {isAdmin && (
                                        <MenuItem
                                            onClick={handleMenuAction('users')}
                                            sx={{
                                                py: 1.5,
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd',
                                                },
                                            }}
                                        >
                                            <ListItemIcon>
                                                <PeopleIcon fontSize="small" color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary="Users" />
                                        </MenuItem>
                                    )}

                                    {/* My Account */}
                                    <MenuItem
                                        onClick={handleMenuAction('profile')}
                                        sx={{
                                            py: 1.5,
                                            '&:hover': {
                                                backgroundColor: '#e3f2fd',
                                            },
                                        }}
                                    >
                                        <ListItemIcon>
                                            <AccountCircleIcon fontSize="small" color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary="My Account" />
                                    </MenuItem>

                                    <Divider sx={{ my: 1 }} />

                                    {/* Logout */}
                                    <MenuItem
                                        onClick={handleMenuAction('logout')}
                                        sx={{
                                            py: 1.5,
                                            '&:hover': {
                                                backgroundColor: '#ffebee',
                                            },
                                        }}
                                    >
                                        <ListItemIcon>
                                            <LogoutIcon fontSize="small" color="error" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Logout"
                                            primaryTypographyProps={{ color: 'error' }}
                                        />
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Stack>
    );
};

export default Header;