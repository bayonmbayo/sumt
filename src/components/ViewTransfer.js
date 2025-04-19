import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container, Grid, Paper, Stack, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { transferActions } from "../actions/transfer.actions";
import { Spinner } from "../assets/spinner";
import { HomeNavigation } from "./Home";





const ViewTransfer = () => {
    const { transfer } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(transferActions.getTransfer())
    }, []);

    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation />
            <ViewTransferBody transfer={transfer} />
        </div>
    );
}

const ViewTransferBody = ({ transfer }) => {
    const [value, setValue] = useState('female');

    const b = useSelector(state => state.transfer.transfer);
    const l = useSelector(state => state.transfer.loading);
    const [bauprojektList, setBauprojektList] = useState(b);

    const [page, setPage] = useState(1);
    const [dataLimit, setDataLimit] = useState(15);

    const getPaginatedData = () => {
        const startIndex = page * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        // console.log(b.bauprojekte)
        return b.bauprojekte.slice(startIndex, endIndex);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        setBauprojektList(b);
    }, [b]);

    if (l) {
        return (
            <>
                <Container>
                    <Spinner show={l} />
                    <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                        View Bauprojekte
                    </Typography>
                </Container>
            </>
        )
    } else {
        if (b && b.bauprojekte) {
            return (
                <>
                    <Container>
                        <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                            View Bauprojekte von Transfer {b.title}
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
                                    <Bauprojekt key={idx} index={idx} data={d} />
                                </Grid>
                            ))}
                        </Grid>

                    </Container>
                </>
            );
        }
    };
}


const Bauprojekt = ({ data, key, index }) => {
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


    return (
        <>
            <Button
                //onMouseEnter={() => setIsHovered(true)}
                //onMouseLeave={() => setIsHovered(false)}
                onClick={() => handleClick()}
                style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: '#1976d2',
                    // transition: 'background-color 0.3s ease',
                    borderRadius: 20,
                    justifyContent: 'flex-start'
                    // border: '2px solid',
                    // boxShadow: isHovered ? '10px 5px 5px #1976d2' : 'none',
                    // cursor: isHovered ? 'pointer' : 'auto'
                }}>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                >
                    <Item>
                        <AddCircleIcon style={{ marginTop: 3 }} />
                    </Item>
                    <Item>
                        <Typography variant="h5" fontWeight="bold" color="#fff">
                            {data.properties.title}
                        </Typography>
                    </Item>
                </Stack>
            </Button>
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
                        <Typography variant="body2" color="text.secondary" style={{ padding: 10 }}>
                            - Type : {data.type}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ padding: 10 }}>
                            - Coordinates : {polyCoordinates}
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

export default ViewTransfer;