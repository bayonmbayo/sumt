import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
// import logo from '/lbm.png';

import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userActions } from '../actions/user.actions';
import logo from './lbm.png';

const Header = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user)

    useEffect(() => {
        dispatch(userActions.session())
    }, [])


    return (
        <>
            <AppBar position="fixed" color="primary">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom style={{ margin: 0 }}>
                            <Link to={user ? "/transfers" : "/"} style={{ color: '#fff', textDecoration: 'none' }}>FLISTRA2NEO</Link>
                        </Typography>
                    </Box>
                    {user ? <MenuListComposition /> : null}
                </Toolbar>
            </AppBar>
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                    <img src={logo} alt="Logo" style={{ height: '100px', paddingTop: 50 }} />
                </Box>
            </Container>
        </>
    );
};

const MenuListComposition = () => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = useRef(null);
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch()

    const navigate = useNavigate();

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        console.log(event.target.id)
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target)
        ) {
            return;
        }

        if (event.target.id === "logout") {
            dispatch(userActions.logout())
            navigate("/")
        }

        if (event.target.id === "users") {
            navigate("/users")
        }

        if (event.target.id === "profile") {
            navigate('/user/' + user.uuid)
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
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
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
                    onClick={handleToggle}
                    style={{ color: '#fff' }}
                >
                    <MenuIcon />
                </Button>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement="bottom-start"
                    transition
                    disablePortal
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
                                        {user && user.role && user.role.includes("ADMIN") ? <MenuItem onClick={handleClose} id="users">Users</MenuItem> : null}
                                        <MenuItem onClick={handleClose} id="profile">My account</MenuItem>
                                        <MenuItem onClick={handleClose} id="logout">Logout</MenuItem>
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

export default Header;