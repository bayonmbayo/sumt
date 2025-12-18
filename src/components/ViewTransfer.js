import { Alert, AlertTitle, Box, Button, Chip, Container, Grid, IconButton, Paper, Stack, styled, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { transferActions } from "../actions/transfer.actions";
import { Spinner } from "../assets/spinner";
import { HomeNavigation } from "./Home";

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ErrorIcon from '@mui/icons-material/Error';
import ErrorSharpIcon from '@mui/icons-material/ErrorSharp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SyncIcon from '@mui/icons-material/Sync';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import ReactJson from "react-json-view";
import { util } from "../services";

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
    // state.transfer.transfer contains { transfer: {...}, elements: [...] }
    const data = useSelector(state => state.transfer.transfer);
    const l = useSelector(state => state.transfer.loading);

    // Extract transfer info and elements from data
    const transferInfo = data?.transfer || null;
    const elements = data?.elements || [];

    const getParentIntervention = (elementsArray) => {
        if (!elementsArray || !Array.isArray(elementsArray)) return null;
        return elementsArray.find(item => item.intervention === true) || null;
    };

    // Count successful and failed elements
    const getElementStats = (elementsArray) => {
        if (!elementsArray || !Array.isArray(elementsArray)) return { success: 0, failed: 0, total: 0 };
        const success = elementsArray.filter(e => e.transfered === true).length;
        const failed = elementsArray.filter(e => e.transfered === false).length;
        return { success, failed, total: elementsArray.length };
    };

    if (l) {
        return (
            <Container>
                <Spinner show={l} />
                <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                    View Bauprojekte
                </Typography>
            </Container>
        );
    }

    if (!data || !elements || elements.length === 0) {
        return (
            <Container>
                <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                    No data available for this transfer
                </Typography>
            </Container>
        );
    }

    const parentElement = getParentIntervention(elements);
    const childElements = elements.filter(item => item.intervention !== true);
    const stats = getElementStats(elements);

    return (
        <Container>
            {/* Transfer Header */}
            <Box sx={{ pt: 3, pb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                    <Typography variant="h5" fontWeight="bold" color="text.secondary">
                        Transfer: {transferInfo?.title || 'Unknown'}
                    </Typography>
                    <TransferStatusChip status={transferInfo?.status} success={transferInfo?.success} />
                </Stack>

                {/* Transfer metadata */}
                {transferInfo && (
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                        {transferInfo.constructionProjectName && (
                            <Chip
                                icon={<AccountTreeIcon />}
                                label={transferInfo.constructionProjectName}
                                variant="outlined"
                                color="primary"
                                size="small"
                            />
                        )}
                        <Chip
                            label={transferInfo.auto ? "Auto" : "Manuell"}
                            variant="outlined"
                            size="small"
                        />
                        {transferInfo.executedat && (
                            <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                                {util.convertToGermanyTime(transferInfo.executedat)}
                            </Typography>
                        )}
                    </Stack>
                )}
            </Box>

            {/* Transfer-Level Error Alert */}
            {transferInfo?.success === 1 && transferInfo?.bemerkung && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        '& .MuiAlert-icon': { alignItems: 'center' }
                    }}
                    icon={<ErrorIcon fontSize="large" />}
                >
                    <AlertTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        Transfer Failed
                    </AlertTitle>
                    <Typography variant="body1">
                        {transferInfo.bemerkung}
                    </Typography>
                </Alert>
            )}

            {/* Transfer Still Running Info */}
            {transferInfo?.success === 0 && (
                <Alert
                    severity="info"
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                    }}
                    icon={<SyncIcon sx={{
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                        },
                    }} />}
                >
                    <AlertTitle sx={{ fontWeight: 'bold' }}>
                        Transfer in Progress
                    </AlertTitle>
                    <Typography variant="body2">
                        {transferInfo.bauprojekte}/{transferInfo.allbauprojekte} elements processed
                    </Typography>
                </Alert>
            )}

            {/* Element Statistics */}
            <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Chip
                        icon={<CheckCircleIcon />}
                        label={`${stats.success} Successful`}
                        color="success"
                        variant="outlined"
                    />
                    {stats.failed > 0 && (
                        <Chip
                            icon={<ErrorIcon />}
                            label={`${stats.failed} Failed`}
                            color="error"
                            variant="outlined"
                        />
                    )}
                    <Chip
                        label={`${stats.total} Total`}
                        variant="outlined"
                    />
                </Stack>
            </Box>

            {/* Parent Element */}
            {parentElement && (
                <div style={{ marginTop: 30, marginBottom: 40 }}>
                    <Typography variant="h6" fontWeight="bold" color="#1976d2" style={{ marginBottom: 15, display: 'flex', alignItems: 'center' }}>
                        <AccountTreeIcon style={{ marginRight: 8 }} />
                        Parent Element (Intervention)
                    </Typography>
                    <ParentBauprojekt data={parentElement} index={0} />
                </div>
            )}

            {/* Children Elements */}
            {childElements.length > 0 && (
                <div style={{ marginTop: 40 }}>
                    <Typography variant="h6" fontWeight="bold" color="#1976d2" style={{ marginBottom: 15, display: 'flex', alignItems: 'center' }}>
                        <ChildCareIcon style={{ marginRight: 8 }} />
                        Children Elements ({childElements.length})
                        {childElements.filter(e => !e.transfered).length > 0 && (
                            <Chip
                                icon={<WarningAmberIcon />}
                                label={`${childElements.filter(e => !e.transfered).length} with errors`}
                                color="warning"
                                size="small"
                                sx={{ ml: 2 }}
                            />
                        )}
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
    );
}

/**
 * Transfer Status Chip
 * 
 * success = 0: Running
 * success = 1: Failed
 * success = 2: Succeeded
 */
const TransferStatusChip = ({ status, success }) => {
    if (success === 0) {
        return (
            <Chip
                icon={<SyncIcon sx={{
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                    },
                }} />}
                label="Running"
                color="info"
                sx={{ fontWeight: 600 }}
            />
        );
    }

    if (success === 1) {
        return (
            <Chip
                icon={<ErrorIcon />}
                label="Failed"
                color="error"
                sx={{ fontWeight: 600 }}
            />
        );
    }

    if (success === 2) {
        return (
            <Chip
                icon={<CheckCircleIcon />}
                label="Succeeded"
                color="success"
                sx={{ fontWeight: 600 }}
            />
        );
    }

    return null;
};

// Parent Component - Shows only KSP
const ParentBauprojekt = ({ data, index }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    const getElementLink = () => {
        return data.url;
    };

    const handleCopyLink = (e) => {
        e.stopPropagation();
        const link = getElementLink();
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleOpenInNewTab = (e) => {
        e.stopPropagation();
        const link = getElementLink();
        window.open(link, '_blank');
    };

    const hasError = data.transfered === false;

    return (
        <div style={{ width: '100%', maxWidth: '1200px' }}>
            {/* Error Alert for Parent */}
            {hasError && data.bemerkung && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2,
                        borderRadius: 2,
                    }}
                >
                    <AlertTitle sx={{ fontWeight: 'bold' }}>
                        Element Transfer Failed
                    </AlertTitle>
                    {data.bemerkung}
                </Alert>
            )}

            <Button
                onClick={() => handleClick()}
                style={{
                    width: '100%',
                    height: 60,
                    backgroundColor: hasError ? '#d32f2f' : '#1976d2',
                    borderRadius: 20,
                    justifyContent: 'flex-start',
                    marginBottom: 10,
                    paddingRight: 10
                }}>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                    style={{ width: '100%' }}
                >
                    <Item>
                        <AccountTreeIcon style={{ fontSize: 28 }} />
                    </Item>
                    <Item>
                        <Typography variant="h6" fontWeight="bold" color="#fff">
                            {data.title} {data.transfered ?
                                <CheckCircleSharpIcon style={{ marginLeft: 10, color: '#00ff00' }} /> :
                                <ErrorSharpIcon style={{ marginLeft: 10, color: '#ffcdd2' }} />
                            }
                        </Typography>
                    </Item>
                    <Item>
                        <Typography variant="body1" color="#fff" style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '4px 12px',
                            borderRadius: 15
                        }}>
                            INTERVENTION
                        </Typography>
                    </Item>
                    <Item style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        <Tooltip title={copied ? "Link copied!" : "Copy link"}>
                            <IconButton
                                onClick={handleCopyLink}
                                size="small"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: '#fff'
                                }}
                            >
                                <ContentCopyIcon style={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Open in new tab">
                            <IconButton
                                onClick={handleOpenInNewTab}
                                size="small"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: '#fff'
                                }}
                            >
                                <OpenInNewIcon style={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                        <ExpandMoreIcon style={{
                            transform: isClicked ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                        }} />
                    </Item>
                </Stack>
            </Button>

            {isClicked && (
                <div style={{
                    margin: '20px 0',
                    padding: 20,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 15,
                    border: hasError ? '2px solid #d32f2f' : '2px solid #1976d2'
                }}>
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

// Child Component - Shows both flistra and KSP
const ChildBauprojekt = ({ data, index }) => {
    const [isClicked, setIsClicked] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    const getElementLink = () => {
        return data.url;
    };

    const handleCopyLink = (e) => {
        e.stopPropagation();
        const link = getElementLink();
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleOpenInNewTab = (e) => {
        e.stopPropagation();
        const link = getElementLink();
        window.open(link, '_blank');
    };

    const hasError = data.transfered === false;

    return (
        <div style={{ width: '100%' }}>
            {/* Error Alert for Child Element */}
            {hasError && data.bemerkung && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 1,
                        borderRadius: 2,
                        py: 0.5
                    }}
                    variant="outlined"
                >
                    <Typography variant="body2" fontWeight="medium">
                        {data.bemerkung}
                    </Typography>
                </Alert>
            )}

            <Button
                onClick={() => handleClick()}
                style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: hasError ? '#d32f2f' : '#1976d2',
                    borderRadius: 15,
                    justifyContent: 'flex-start',
                    marginBottom: 10,
                    paddingRight: 10
                }}>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={1}
                    style={{ width: '100%' }}
                >
                    <Item>
                        <ChildCareIcon style={{ fontSize: 20 }} />
                    </Item>
                    <Item>
                        <Typography variant="h6" fontWeight="bold" color="#fff" style={{ fontSize: '0.9rem' }}>
                            {`[${index}]`} {data.title?.length > 80 ? `${data.title.substring(0, 80)}...` : data.title}
                            {data.transfered ?
                                <CheckCircleSharpIcon style={{ marginLeft: 5, fontSize: 16, color: '#00ff00' }} /> :
                                <ErrorSharpIcon style={{ marginLeft: 5, fontSize: 16, color: '#ffcdd2' }} />
                            }
                        </Typography>
                    </Item>
                    <Item>
                        <Typography variant="body1" color="#fff" style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            padding: '4px 12px',
                            borderRadius: 15,
                            fontSize: '0.75rem'
                        }}>
                            KOMPENSATION
                        </Typography>
                    </Item>
                    {hasError && (
                        <Item>
                            <Chip
                                icon={<ErrorIcon style={{ color: '#fff', fontSize: 14 }} />}
                                label="Error"
                                size="small"
                                sx={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: '#fff',
                                    height: 24,
                                    '& .MuiChip-label': { px: 1 }
                                }}
                            />
                        </Item>
                    )}
                    <Item style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        {!hasError ? <><Tooltip title={copied ? "Link copied!" : "Copy link"}>
                            <IconButton
                                onClick={handleCopyLink}
                                size="small"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    color: '#fff'
                                }}
                            >
                                <ContentCopyIcon style={{ fontSize: 16 }} />
                            </IconButton>
                        </Tooltip>
                            <Tooltip title="Open in new tab">
                                <IconButton
                                    onClick={handleOpenInNewTab}
                                    size="small"
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        color: '#fff'
                                    }}
                                >
                                    <OpenInNewIcon style={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip></> : null}
                        <ExpandMoreIcon style={{
                            transform: isClicked ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                            fontSize: 20
                        }} />
                    </Item>
                </Stack>
            </Button>

            {isClicked && (
                <div style={{
                    margin: '10px 20px 20px 20px',
                    padding: 15,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 12,
                    border: hasError ? '2px solid #d32f2f' : '2px solid #1976d2'
                }}>
                    {/* Error details if available */}
                    {hasError && data.bemerkung && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2, borderRadius: 2 }}
                        >
                            <AlertTitle>Error Details</AlertTitle>
                            {data.bemerkung}
                        </Alert>
                    )}

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        {/* Column 1 - Flistra */}
                        {data.flistra && (
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <Typography variant="h6" fontWeight="bold" color="text.secondary" style={{
                                    padding: '10px 0',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    📥 Flistra (Input)
                                </Typography>
                                <JsonViewer data={data.flistra} />
                            </div>
                        )}

                        {/* Column 2 - KSP */}
                        {data.ksp && (
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <Typography variant="h6" fontWeight="bold" color="text.secondary" style={{
                                    padding: '10px 0',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    📤 KSP (Output)
                                </Typography>
                                <JsonViewer data={data.ksp} />
                            </div>
                        )}
                    </div>
                </div>
            )}
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
    if (!data) {
        return (
            <div style={{
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                border: "2px solid #ccc",
            }}>
                <Typography variant="body2" color="text.secondary">
                    No data available
                </Typography>
            </div>
        );
    }

    let parsedData;
    try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
        return (
            <div style={{
                padding: "10px",
                backgroundColor: "#ffebee",
                borderRadius: "8px",
                border: "2px solid #f44336",
            }}>
                <Typography variant="body2" color="error">
                    Invalid JSON data
                </Typography>
                <pre style={{
                    overflow: 'auto',
                    maxHeight: 200,
                    fontSize: '0.75rem',
                    marginTop: 8
                }}>
                    {data}
                </pre>
            </div>
        );
    }

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
                src={parsedData}
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