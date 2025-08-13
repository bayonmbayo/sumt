import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Button, Container, Grid, Paper, Stack, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { transferActions } from "../actions/transfer.actions";
import { Spinner } from "../assets/spinner";
import { HomeNavigation } from "./Home";

import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import ErrorSharpIcon from '@mui/icons-material/ErrorSharp';

import ReactJson from "react-json-view";





const ViewTransfer = () => {
    const { transfer } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(transferActions.getTransfer(transfer))
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
        return b.slice(startIndex, endIndex);
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
        if (b) {
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
                            {data.title} {data.transfered ? <CheckCircleSharpIcon style={{ paddingTop: 3, color: '#00ff00' }} /> : <ErrorSharpIcon style={{ marginTop: 3, color: '#ff0000' }} />}
                        </Typography>
                    </Item>
                </Stack>
            </Button>
            {isClicked ?
                <div style={{
                    margin: 20,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    {/* Column 1 */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ padding: 20 }}>
                            Flistra
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ padding: 10 }}>
                            <JsonViewer data={data.flistra} />
                        </Typography>
                    </div>

                    {/* Column 2 */}
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ padding: 20 }}>
                            KSP
                        </Typography>
                        <Typography variant="body2" color="text.secondary" style={{ padding: 10 }}>
                            <JsonViewer data={data.ksp} />
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

const JsonViewer = ({ data }) => {
    return (
        <div style={{
            padding: "10px",
            backgroundColor: "#f9f9f9", // quasi white background
            borderRadius: "8px",
            border: "2px solid #1976d2", // blue border
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
            <ReactJson
                src={JSON.parse(data)}
                theme={{
                    base00: "#f9f9f9", // Background color
                    base01: "#e0e0e0",
                    base02: "#d0d0d0",
                    base03: "#555555",
                    base04: "#333333",
                    base05: "#000000", // Main text color
                    base06: "#000000",
                    base07: "#000000",
                    base08: "#ff0000",
                    base09: "#ff9900",
                    base0A: "#ffcc00",
                    base0B: "#4caf50",
                    base0C: "#00bcd4",
                    base0D: "#2196f3",
                    base0E: "#9c27b0",
                    base0F: "#795548"
                }}
                collapsed={1} // Collapses nested objects by default, set to false for fully expanded
                enableClipboard={true}
                displayDataTypes={false} // Hide type info
                displayObjectSize={false} // Hide size info
                indentWidth={2}
            />
        </div>
    );
};

export default ViewTransfer;