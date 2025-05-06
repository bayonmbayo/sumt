import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Container, Grid, Paper, Stack, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { profileActions } from '../actions/profile.actions';
import { Spinner } from "../assets/spinner";
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
    const [value, setValue] = useState('female');

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

export default Users;