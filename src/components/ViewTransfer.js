import { Button, Container, Grid, Paper, Stack, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { transferActions } from "../actions/transfer.actions";
import { Spinner } from "../assets/spinner";
import { HomeNavigation } from "./Home";

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import ChildCareIcon from '@mui/icons-material/ChildCare';
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
    const [dataLimit, setDataLimit] = useState(1000);

    const getPaginatedData = () => {
        const startIndex = page * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return b.slice(startIndex, endIndex);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const getParentIntervention = (dataArray) => {
        if (!dataArray || !Array.isArray(dataArray)) return null;
        return dataArray.find(item => item.intervention === true) || null;
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
        if (b && b.length > 0) {
            const parentElement = getParentIntervention(b)
            const childElements = b.slice(1);

            return (
                <>
                    <Container>
                        <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                            View Bauprojekt von Transfer "{parentElement.title || 'Unknown'}"
                        </Typography>

                        {/* Parent Element */}
                        <div style={{ marginTop: 30, marginBottom: 40 }}>
                            <Typography variant="h6" fontWeight="bold" color="#1976d2" style={{ marginBottom: 15, display: 'flex', alignItems: 'center' }}>
                                <AccountTreeIcon style={{ marginRight: 8 }} />
                                Parent Element
                            </Typography>
                            <ParentBauprojekt data={parentElement} index={0} />
                        </div>

                        {/* Children Elements */}
                        {childElements.length > 0 && (
                            <div style={{ marginTop: 40 }}>
                                <Typography variant="h6" fontWeight="bold" color="#1976d2" style={{ marginBottom: 15, display: 'flex', alignItems: 'center' }}>
                                    <ChildCareIcon style={{ marginRight: 8 }} />
                                    Children Elements ({childElements.length})
                                </Typography>
                                <Grid container spacing={3}>
                                    {childElements.map((d, idx) => (
                                        <Grid key={idx + 1} size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                                            <ChildBauprojekt data={d} index={idx + 1} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </div>
                        )}
                    </Container>
                </>
            );
        }
    };
}

// Parent Component - Shows only KSP, larger width
const ParentBauprojekt = ({ data, index }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    return (
        <div style={{ width: '100%', maxWidth: '1200px' }}>
            <Button
                onClick={() => handleClick()}
                style={{
                    width: '100%',
                    height: 60,
                    backgroundColor: '#1976d2',
                    borderRadius: 20,
                    justifyContent: 'flex-start',
                    marginBottom: 10
                }}>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                >
                    <Item>
                        <AccountTreeIcon style={{ fontSize: 28 }} />
                    </Item>
                    <Item>
                        <Typography variant="h6" fontWeight="bold" color="#fff">
                            {data.title} {data.transfered ?
                                <CheckCircleSharpIcon style={{ marginLeft: 10, color: '#00ff00' }} /> :
                                <ErrorSharpIcon style={{ marginLeft: 10, color: '#ff0000' }} />
                            }
                        </Typography>
                    </Item>
                    <Item style={{ marginLeft: 'auto' }}>
                        <Typography variant="body1" color="#fff" style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '4px 12px',
                            borderRadius: 15
                        }}>
                            INTERVENTION
                        </Typography>
                    </Item>
                </Stack>
            </Button>

            {isClicked && (
                <div style={{
                    margin: '20px 0',
                    padding: 20,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 15,
                    border: '2px solid #1976d2'
                }}>
                    {/* Only KSP for Parent */}
                    <div style={{ width: '100%' }}>
                        <Typography variant="h5" fontWeight="bold" color="#1976d2" style={{
                            marginBottom: 20,
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <AccountTreeIcon style={{ marginRight: 10 }} />
                            KSP Data (Parent)
                        </Typography>
                        <JsonViewer data={data.ksp} />
                    </div>
                </div>
            )}
        </div>
    );
}

// Child Component - Shows both flistra and KSP, smaller width
const ChildBauprojekt = ({ data, index }) => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    return (
        <div style={{ width: '100%' }}>
            <Button
                onClick={() => handleClick()}
                style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: '#1976d2',
                    borderRadius: 15,
                    justifyContent: 'flex-start',
                    marginBottom: 10
                }}>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                >
                    <Item>
                        <ChildCareIcon style={{ fontSize: 20 }} />
                    </Item>
                    <Item>
                        <Typography variant="h6" fontWeight="bold" color="#fff" style={{ fontSize: '0.9rem' }}>
                            {`[${index - 1}]`} {data.title?.length > 100 ? `${data.title.substring(0, 100)}...` : data.title}
                            {data.transfered ?
                                <CheckCircleSharpIcon style={{ marginLeft: 5, fontSize: 16, color: '#00ff00' }} /> :
                                <ErrorSharpIcon style={{ marginLeft: 5, fontSize: 16, color: '#ff0000' }} />
                            }
                        </Typography>
                    </Item>
                    <Item style={{ marginLeft: 'auto' }}>
                        <Typography variant="body1" color="#fff" style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '4px 12px',
                            borderRadius: 15
                        }}>
                            KOMPENSATION
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

const JsonViewer = ({ data, compact = false }) => {
    return (
        <div style={{
            padding: compact ? "8px" : "10px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            border: "2px solid #1976d2",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            fontSize: compact ? '0.8rem' : '1rem'
        }}>
            <ReactJson
                src={JSON.parse(data)}
                theme={{
                    base00: "#f9f9f9",
                    base01: "#e0e0e0",
                    base02: "#d0d0d0",
                    base03: "#555555",
                    base04: "#333333",
                    base05: "#000000",
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
                collapsed={compact ? 2 : 1}
                enableClipboard={true}
                displayDataTypes={false}
                displayObjectSize={false}
                indentWidth={compact ? 1 : 2}
                iconStyle={compact ? "square" : "triangle"}
            />
        </div>
    );
};

export default ViewTransfer;