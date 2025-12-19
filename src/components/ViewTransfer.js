import { Alert, AlertTitle, Box, Button, Chip, Container, Grid, IconButton, Paper, Stack, styled, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
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
    }, [dispatch, transfer]);

    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation />
            <ViewTransferBody transfer={transfer} />
        </div>
    );
}

const ViewTransferBody = ({ transfer }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                    <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" color="text.secondary">
                        Transfer: {isMobile && transferInfo?.title?.length > 25
                            ? `${transferInfo.title.substring(0, 25)}...`
                            : transferInfo?.title || 'Unknown'}
                    </Typography>
                    <TransferStatusChip status={transferInfo?.status} success={transferInfo?.success} />
                </Stack>

                {/* Transfer metadata */}
                {transferInfo && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                        {transferInfo.constructionProjectName && (
                            <Chip
                                icon={<AccountTreeIcon />}
                                label={isMobile && transferInfo.constructionProjectName.length > 20
                                    ? `${transferInfo.constructionProjectName.substring(0, 20)}...`
                                    : transferInfo.constructionProjectName}
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
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                        icon={<CheckCircleIcon />}
                        label={isMobile ? `${stats.success} OK` : `${stats.success} Successful`}
                        color="success"
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                    />
                    {stats.failed > 0 && (
                        <Chip
                            icon={<ErrorIcon />}
                            label={`${stats.failed} Failed`}
                            color="error"
                            variant="outlined"
                            size={isMobile ? "small" : "medium"}
                        />
                    )}
                    <Chip
                        label={`${stats.total} Total`}
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                    />
                </Stack>
            </Box>

            {/* Parent Element */}
            {parentElement && (
                <div style={{ marginTop: 30, marginBottom: 40 }}>
                    <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        fontWeight="bold"
                        color="#1976d2"
                        sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                    >
                        <AccountTreeIcon sx={{ mr: 1, fontSize: isMobile ? 20 : 24 }} />
                        {isMobile ? "Parent (EIV)" : "Parent Element (Intervention)"}
                    </Typography>
                    <ParentBauprojekt data={parentElement} index={0} />
                </div>
            )}

            {/* Children Elements */}
            {childElements.length > 0 && (
                <div style={{ marginTop: 40 }}>
                    <Typography
                        variant={isMobile ? "subtitle1" : "h6"}
                        fontWeight="bold"
                        color="#1976d2"
                        sx={{ mb: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
                    >
                        <ChildCareIcon sx={{ mr: 0.5, fontSize: isMobile ? 20 : 24 }} />
                        {isMobile ? `Children (${childElements.length})` : `Children Elements (${childElements.length})`}
                        {childElements.filter(e => !e.transfered).length > 0 && (
                            <Chip
                                icon={<WarningAmberIcon />}
                                label={isMobile
                                    ? `${childElements.filter(e => !e.transfered).length} err`
                                    : `${childElements.filter(e => !e.transfered).length} with errors`}
                                color="warning"
                                size="small"
                            />
                        )}
                    </Typography>
                    <Grid container spacing={isMobile ? 2 : 3}>
                        {childElements.map((d, idx) => (
                            <Grid key={idx + 1} size={{ xs: 12 }}>
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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
                label={isMobile ? "..." : "Running"}
                color="info"
                size={isMobile ? "small" : "medium"}
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
                size={isMobile ? "small" : "medium"}
                sx={{ fontWeight: 600 }}
            />
        );
    }

    if (success === 2) {
        return (
            <Chip
                icon={<CheckCircleIcon />}
                label={isMobile ? "OK" : "Succeeded"}
                color="success"
                size={isMobile ? "small" : "medium"}
                sx={{ fontWeight: 600 }}
            />
        );
    }

    return null;
};

// Parent Component - Shows only KSP
const ParentBauprojekt = ({ data, index }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isClicked, setIsClicked] = useState(false);
    const [copied, setCopied] = useState(false);

    // Truncate title for mobile (20 chars)
    const displayTitle = isMobile && data.title?.length > 20
        ? `${data.title.substring(0, 20)}...`
        : data.title;

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
                sx={{
                    width: '100%',
                    minHeight: isMobile ? 50 : 60,
                    height: 'auto',
                    py: isMobile ? 1 : 1.5,
                    backgroundColor: hasError ? '#d32f2f' : '#1976d2',
                    borderRadius: isMobile ? '12px' : '20px',
                    justifyContent: 'flex-start',
                    mb: 1,
                    pr: 1,
                    '&:hover': {
                        backgroundColor: hasError ? '#b71c1c' : '#1565c0',
                    }
                }}>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={isMobile ? 1 : 2}
                    sx={{ width: '100%', flexWrap: 'nowrap' }}
                >
                    <Item sx={{ p: isMobile ? 0.5 : 1 }}>
                        <AccountTreeIcon sx={{ fontSize: isMobile ? 20 : 28 }} />
                    </Item>
                    <Item sx={{ p: isMobile ? 0.5 : 1, minWidth: 0, flex: 1 }}>
                        <Typography
                            variant={isMobile ? "body2" : "h6"}
                            fontWeight="bold"
                            color="#fff"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {displayTitle}
                            {data.transfered ?
                                <CheckCircleSharpIcon sx={{ ml: 0.5, fontSize: isMobile ? 14 : 20, color: '#00ff00' }} /> :
                                <ErrorSharpIcon sx={{ ml: 0.5, fontSize: isMobile ? 14 : 20, color: '#ffcdd2' }} />
                            }
                        </Typography>
                    </Item>
                    <Item sx={{ p: isMobile ? 0.5 : 1 }}>
                        <Typography
                            variant="body2"
                            color="#fff"
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                px: isMobile ? 1 : 1.5,
                                py: 0.5,
                                borderRadius: '15px',
                                fontSize: isMobile ? '0.65rem' : '0.875rem',
                                fontWeight: 600
                            }}
                        >
                            {isMobile ? "EIV" : "INTERVENTION"}
                        </Typography>
                    </Item>
                    <Item sx={{ ml: 'auto', display: 'flex', gap: 0.5, p: isMobile ? 0.5 : 1 }}>
                        {!isMobile && (
                            <>
                                <Tooltip title={copied ? "Link copied!" : "Copy link"}>
                                    <IconButton
                                        onClick={handleCopyLink}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                                        }}
                                    >
                                        <ContentCopyIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Open in new tab">
                                    <IconButton
                                        onClick={handleOpenInNewTab}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                                        }}
                                    >
                                        <OpenInNewIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        <ExpandMoreIcon sx={{
                            transform: isClicked ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                            fontSize: isMobile ? 20 : 24
                        }} />
                    </Item>
                </Stack>
            </Button>

            {isClicked && (
                <Box sx={{
                    my: isMobile ? 1 : 2,
                    p: isMobile ? 1.5 : 2.5,
                    backgroundColor: '#f8f9fa',
                    borderRadius: isMobile ? '12px' : '15px',
                    border: hasError ? '2px solid #d32f2f' : '2px solid #1976d2'
                }}>
                    {/* Mobile action buttons */}
                    {isMobile && (
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<ContentCopyIcon />}
                                onClick={handleCopyLink}
                                sx={{ borderRadius: 2, flex: 1 }}
                            >
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<OpenInNewIcon />}
                                onClick={handleOpenInNewTab}
                                sx={{ borderRadius: 2, flex: 1 }}
                            >
                                Open
                            </Button>
                        </Stack>
                    )}

                    <Typography
                        variant={isMobile ? "subtitle1" : "h5"}
                        fontWeight="bold"
                        color="#1976d2"
                        sx={{
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <AccountTreeIcon sx={{ mr: 1, fontSize: isMobile ? 20 : 28 }} />
                        KSP Data {isMobile ? "" : "(Parent)"}
                    </Typography>
                    <JsonViewer data={data.ksp} compact={isMobile} />
                </Box>
            )}
        </div>
    );
}

// Child Component - Shows both flistra and KSP
const ChildBauprojekt = ({ data, index }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isClicked, setIsClicked] = useState(false);
    const [copied, setCopied] = useState(false);

    // Truncate title for mobile (20 chars) or desktop (80 chars)
    const maxTitleLength = isMobile ? 20 : 80;
    const displayTitle = data.title?.length > maxTitleLength
        ? `${data.title.substring(0, maxTitleLength)}...`
        : data.title;

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
                        {isMobile && data.bemerkung.length > 50
                            ? `${data.bemerkung.substring(0, 50)}...`
                            : data.bemerkung}
                    </Typography>
                </Alert>
            )}

            <Button
                onClick={() => handleClick()}
                sx={{
                    width: '100%',
                    minHeight: isMobile ? 44 : 50,
                    height: 'auto',
                    py: isMobile ? 0.75 : 1,
                    backgroundColor: hasError ? '#d32f2f' : '#1976d2',
                    borderRadius: isMobile ? '10px' : '15px',
                    justifyContent: 'flex-start',
                    mb: 1,
                    pr: 1,
                    '&:hover': {
                        backgroundColor: hasError ? '#b71c1c' : '#1565c0',
                    }
                }}>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={isMobile ? 0.5 : 1}
                    sx={{ width: '100%', flexWrap: 'nowrap' }}
                >
                    <Item sx={{ p: isMobile ? 0.25 : 1 }}>
                        <ChildCareIcon sx={{ fontSize: isMobile ? 16 : 20 }} />
                    </Item>
                    <Item sx={{ p: isMobile ? 0.25 : 1, minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="#fff"
                            sx={{
                                fontSize: isMobile ? '0.7rem' : '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <Box component="span" sx={{ mr: 0.5 }}>{`[${index}]`}</Box>
                            {displayTitle}
                            {data.transfered ?
                                <CheckCircleSharpIcon sx={{ ml: 0.5, fontSize: isMobile ? 12 : 16, color: '#00ff00', flexShrink: 0 }} /> :
                                <ErrorSharpIcon sx={{ ml: 0.5, fontSize: isMobile ? 12 : 16, color: '#ffcdd2', flexShrink: 0 }} />
                            }
                        </Typography>
                    </Item>
                    <Item sx={{ p: isMobile ? 0.25 : 1 }}>
                        <Typography
                            variant="body2"
                            color="#fff"
                            sx={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                px: isMobile ? 0.75 : 1.5,
                                py: 0.25,
                                borderRadius: '15px',
                                fontSize: isMobile ? '0.6rem' : '0.75rem',
                                fontWeight: 600
                            }}
                        >
                            {isMobile ? "KOM" : "KOMPENSATION"}
                        </Typography>
                    </Item>
                    {hasError && !isMobile && (
                        <Item sx={{ p: 0.5 }}>
                            <Chip
                                icon={<ErrorIcon sx={{ color: '#fff', fontSize: 14 }} />}
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
                    <Item sx={{ ml: 'auto', display: 'flex', gap: 0.5, p: isMobile ? 0.25 : 1 }}>
                        {!hasError && !isMobile && (
                            <>
                                <Tooltip title={copied ? "Link copied!" : "Copy link"}>
                                    <IconButton
                                        onClick={handleCopyLink}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                                        }}
                                    >
                                        <ContentCopyIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Open in new tab">
                                    <IconButton
                                        onClick={handleOpenInNewTab}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            color: '#fff',
                                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                                        }}
                                    >
                                        <OpenInNewIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        <ExpandMoreIcon sx={{
                            transform: isClicked ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                            fontSize: isMobile ? 18 : 20
                        }} />
                    </Item>
                </Stack>
            </Button>

            {isClicked && (
                <Box sx={{
                    mx: isMobile ? 1 : 2.5,
                    my: isMobile ? 1 : 1.5,
                    p: isMobile ? 1.5 : 2,
                    backgroundColor: '#f8f9fa',
                    borderRadius: isMobile ? '10px' : '12px',
                    border: hasError ? '2px solid #d32f2f' : '2px solid #1976d2'
                }}>
                    {/* Mobile action buttons */}
                    {isMobile && !hasError && (
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<ContentCopyIcon />}
                                onClick={handleCopyLink}
                                sx={{ borderRadius: 2, flex: 1, fontSize: '0.7rem' }}
                            >
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<OpenInNewIcon />}
                                onClick={handleOpenInNewTab}
                                sx={{ borderRadius: 2, flex: 1, fontSize: '0.7rem' }}
                            >
                                Open
                            </Button>
                        </Stack>
                    )}

                    {/* Error details if available */}
                    {hasError && data.bemerkung && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2, borderRadius: 2 }}
                        >
                            <AlertTitle sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}>
                                Error Details
                            </AlertTitle>
                            <Typography variant="body2" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                                {data.bemerkung}
                            </Typography>
                        </Alert>
                    )}

                    <Stack
                        direction={isMobile ? 'column' : 'row'}
                        spacing={isMobile ? 2 : 3}
                    >
                        {/* Column 1 - Flistra */}
                        {data.flistra && (
                            <Box sx={{ flex: 1, minWidth: isMobile ? '100%' : '300px' }}>
                                <Typography
                                    variant={isMobile ? "subtitle2" : "h6"}
                                    fontWeight="bold"
                                    color="text.secondary"
                                    sx={{
                                        py: 1,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    📥 Flistra {isMobile ? "" : "(Input)"}
                                </Typography>
                                <JsonViewer data={data.flistra} compact={isMobile} />
                            </Box>
                        )}

                        {/* Column 2 - KSP */}
                        {data.ksp && (
                            <Box sx={{ flex: 1, minWidth: isMobile ? '100%' : '300px' }}>
                                <Typography
                                    variant={isMobile ? "subtitle2" : "h6"}
                                    fontWeight="bold"
                                    color="text.secondary"
                                    sx={{
                                        py: 1,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    📤 KSP {isMobile ? "" : "(Output)"}
                                </Typography>
                                <JsonViewer data={data.ksp} compact={isMobile} />
                            </Box>
                        )}
                    </Stack>
                </Box>
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
            <Box sx={{
                p: compact ? 1 : 1.5,
                backgroundColor: "#f9f9f9",
                borderRadius: 2,
                border: "2px solid #ccc",
            }}>
                <Typography variant="body2" color="text.secondary">
                    No data available
                </Typography>
            </Box>
        );
    }

    let parsedData;
    try {
        parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
        return (
            <Box sx={{
                p: compact ? 1 : 1.5,
                backgroundColor: "#ffebee",
                borderRadius: 2,
                border: "2px solid #f44336",
            }}>
                <Typography variant="body2" color="error">
                    Invalid JSON data
                </Typography>
                <Box
                    component="pre"
                    sx={{
                        overflow: 'auto',
                        maxHeight: 200,
                        fontSize: compact ? '0.65rem' : '0.75rem',
                        mt: 1
                    }}
                >
                    {data}
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{
            p: compact ? 1 : 1.5,
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            border: "2px solid #1976d2",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            fontSize: compact ? '0.75rem' : '1rem',
            overflow: 'auto'
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
                style={{ fontSize: compact ? '0.7rem' : '0.85rem' }}
            />
        </Box>
    );
};

export default ViewTransfer;