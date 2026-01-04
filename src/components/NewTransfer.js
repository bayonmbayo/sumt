import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    InputAdornment,
    MenuItem,
    Pagination,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HomeNavigation } from "./Home";

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';

import { Spinner } from "../assets/spinner";
import { workerConstants } from "../constants";
import { authHeaderWithJSON, authHeaderWithoutContentType } from "../helpers/auth-header";

const WORKER = workerConstants.WORKER;

const NewTransfer = () => {
    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation showSearchField={false} />
            <NewTransferBody />
        </div>
    );
};

const NewTransferBody = () => {
    const u = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    const [inputMode, setInputMode] = useState("construction");
    const [featureIdFields, setFeatureIdFields] = useState(Array(10).fill(""));
    const [jsonFields, setJsonFields] = useState(Array(10).fill(""));
    const [geoJsonFile, setGeoJsonFile] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Construction projects state
    const [constructionProjects, setConstructionProjects] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [projectsLoading, setProjectsLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const itemsPerPageOptions = [10, 20, 50, 100];

    // Ref to prevent double fetch in StrictMode
    const hasFetched = useRef(false);

    // Fetch construction projects when mode is "construction"
    useEffect(() => {
        if (inputMode === "construction" && !hasFetched.current) {
            hasFetched.current = true;
            fetchConstructionProjects();
        }
    }, [inputMode]);

    // Reset page when search term or items per page changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm, itemsPerPage]);

    const fetchConstructionProjects = async () => {
        setProjectsLoading(true);
        try {
            const response = await fetch(WORKER + "construction-projects", {
                headers: authHeaderWithJSON(),
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch construction projects");
            const data = await response.json();

            // Add unique index to each project for React keys and selection tracking
            const projectsWithIndex = (data.constructionProjects || []).map((project, index) => ({
                ...project,
                _index: index, // Unique identifier for React keys and selection
            }));

            setConstructionProjects(projectsWithIndex);
        } catch (error) {
            console.error("Error fetching construction projects:", error);
            // Fallback to mock data for development
            const mockData = [
                { uuid: "a1b2c3d4-e5f6-7890-abcd-ef1234567801", title: "Neubau Wohnanlage Köln-Ehrenfeld" },
                { uuid: "b2c3d4e5-f6a7-8901-bcde-f12345678902", title: "Sanierung Rheinbrücke Düsseldorf" },
                { uuid: "c3d4e5f6-a7b8-9012-cdef-123456789003", title: "Erweiterung Hauptbahnhof München" },
                { uuid: "d4e5f6a7-b8c9-0123-def0-234567890104", title: "Bürokomplex Frankfurt Westend" },
                { uuid: "e5f6a7b8-c9d0-1234-ef01-345678901205", title: "Schulneubau Berlin-Mitte" },
                { uuid: "f6a7b8c9-d0e1-2345-f012-456789012306", title: "Windpark Nordsee Phase III" },
                { uuid: "a7b8c9d0-e1f2-3456-0123-567890123407", title: "Autobahnausbau A3 Köln-Frankfurt" },
                { uuid: "b8c9d0e1-f2a3-4567-1234-678901234508", title: "Krankenhaus Erweiterung Hamburg-Eppendorf" },
                { uuid: "c9d0e1f2-a3b4-5678-2345-789012345609", title: "Einkaufszentrum Stuttgart City" },
                { uuid: "d0e1f2a3-b4c5-6789-3456-890123456710", title: "Hochwasserschutz Elbe Dresden" },
                { uuid: "e1f2a3b4-c5d6-7890-4567-901234567811", title: "Solarpark Brandenburg Süd" },
                { uuid: "f2a3b4c5-d6e7-8901-5678-012345678912", title: "U-Bahn Verlängerung Nürnberg" },
                { uuid: "a3b4c5d6-e7f8-9012-6789-123456789013", title: "Logistikzentrum Leipzig-Halle" },
                { uuid: "b4c5d6e7-f8a9-0123-7890-234567890114", title: "Wohnquartier Hannover-List" },
                { uuid: "c5d6e7f8-a9b0-1234-8901-345678901215", title: "Hafenerweiterung Bremerhaven" },
                { uuid: "d6e7f8a9-b0c1-2345-9012-456789012316", title: "Gewerbepark Dortmund-West" },
                { uuid: "e7f8a9b0-c1d2-3456-0123-567890123417", title: "Stadtbahn Ausbau Karlsruhe" },
                { uuid: "f8a9b0c1-d2e3-4567-1234-678901234518", title: "Forschungszentrum Aachen RWTH" },
                { uuid: "a9b0c1d2-e3f4-5678-2345-789012345619", title: "Kläranlage Modernisierung Essen" },
                { uuid: "b0c1d2e3-f4a5-6789-3456-890123456720", title: "Sportstadion Sanierung Gelsenkirchen" },
            ].map((project, index) => ({ ...project, _index: index }));

            setConstructionProjects(mockData);
        } finally {
            setProjectsLoading(false);
        }
    };

    const handleFieldChange = (setStateFn, index, value) => {
        setStateFn((prevFields) => {
            const newFields = [...prevFields];
            newFields[index] = value;
            return newFields;
        });
    };

    const handleGeoJsonFileChange = (e) => {
        const f = e.target.files?.[0] || null;

        if (f) {
            const lowerName = f.name.toLowerCase();
            const hasValidExt = lowerName.endsWith(".json") || lowerName.endsWith(".geojson");

            if (!hasValidExt) {
                setFileError("Please upload a file with .json or .geojson extension.");
                setGeoJsonFile(null);
            } else {
                setFileError(null);
                setGeoJsonFile(f);
            }
        } else {
            setGeoJsonFile(null);
            setFileError(null);
        }

        e.target.value = "";
    };

    const removeGeoJsonFile = () => {
        setGeoJsonFile(null);
        setFileError(null);
    };

    // Construction project selection handlers - use _index for unique identification
    const handleSelectProject = (project) => {
        const isSelected = selectedProjects.some((p) => p._index === project._index);
        if (isSelected) {
            setSelectedProjects(selectedProjects.filter((p) => p._index !== project._index));
        } else {
            setSelectedProjects([...selectedProjects, project]);
        }
    };

    const handleRemoveSelected = (index) => {
        setSelectedProjects(selectedProjects.filter((p) => p._index !== index));
    };

    const clearAllSelected = () => {
        setSelectedProjects([]);
    };

    // Use useMemo to prevent recalculation on every render
    const filteredProjects = useMemo(() => {
        if (!searchTerm.trim()) return constructionProjects;

        const lowerSearch = searchTerm.toLowerCase().trim();
        return constructionProjects.filter(
            (project) =>
                project.title.toLowerCase().includes(lowerSearch) ||
                project.uuid.toLowerCase().includes(lowerSearch)
        );
    }, [constructionProjects, searchTerm]);

    const paginatedProjects = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProjects, page, itemsPerPage]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredProjects.length / itemsPerPage);
    }, [filteredProjects.length, itemsPerPage]);

    const isProjectSelected = (index) => {
        return selectedProjects.some((p) => p._index === index);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(event.target.value);
    };

    const handleSubmit = async () => {
        const formData = new FormData();

        if (inputMode === "construction") {
            if (selectedProjects.length === 0) {
                alert("Please select at least one construction project.");
                return;
            }
            // Send unique UUIDs only (deduplicate at submission time)
            const uniqueUuids = [...new Set(selectedProjects.map((p) => p.uuid))];
            formData.append("constructionProjects", JSON.stringify(uniqueUuids));
        } else if (inputMode === "id") {
            formData.append("featureIds", JSON.stringify(featureIdFields));
        } else if (inputMode === "json") {
            const jsonObjects = [];

            for (const raw of jsonFields.filter((v) => v.trim() !== "")) {
                try {
                    jsonObjects.push(JSON.parse(raw));
                } catch (err) {
                    alert("One of the JSON fields is invalid.");
                    return;
                }
            }

            formData.append("jsonFields", JSON.stringify(jsonObjects));
        } else if (inputMode === "file") {
            if (!geoJsonFile) return alert("No file selected");
            formData.append("geoJsonFile", geoJsonFile);
        }

        setLoading(true);
        try {
            const response = await fetch(WORKER + "maketransfer", {
                headers: authHeaderWithoutContentType(),
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");
            alert("Transfer submitted successfully");
        } catch (error) {
            console.error("Error submitting transfer:", error);
            alert("Failed to submit transfer");
        } finally {
            navigate("/transfers");
            setLoading(false);
        }
    };

    const renderConstructionProjectsSection = () => {
        // Calculate display range
        const startItem = filteredProjects.length > 0 ? (page - 1) * itemsPerPage + 1 : 0;
        const endItem = Math.min(page * itemsPerPage, filteredProjects.length);

        return (
            <Box display="flex" flexDirection="column" gap={3}>
                {/* Search Field */}
                <TextField
                    label="Search by Title or UUID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setSearchTerm("")}>
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Selected Projects Section - Only shows when projects are selected */}
                {selectedProjects.length > 0 && (
                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: "#e3f2fd",
                            borderRadius: 2,
                            border: "1px solid #1976d2",
                        }}
                    >
                        {/* Header Row */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold" color="#1976d2">
                                Selected Projects ({selectedProjects.length})
                                {selectedProjects.length !== new Set(selectedProjects.map(p => p.uuid)).size && (
                                    <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        ({new Set(selectedProjects.map(p => p.uuid)).size} unique UUIDs)
                                    </Typography>
                                )}
                            </Typography>
                            <Button
                                size="small"
                                color="error"
                                onClick={clearAllSelected}
                                startIcon={<DeleteIcon />}
                            >
                                Clear All
                            </Button>
                        </Box>

                        {/* Selected Chips */}
                        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                            {selectedProjects.map((project) => (
                                <Chip
                                    key={project._index}
                                    label={project.title}
                                    onDelete={() => handleRemoveSelected(project._index)}
                                    color="primary"
                                    variant="filled"
                                    sx={{ maxWidth: 300 }}
                                />
                            ))}
                        </Box>

                        {/* Submit Button - Bottom Right */}
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSubmit}
                                startIcon={<SendIcon />}
                                sx={{
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1,
                                }}
                            >
                                Submit
                                <Chip
                                    label={selectedProjects.length}
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        backgroundColor: "rgba(255,255,255,0.3)",
                                        color: "white",
                                        fontWeight: "bold",
                                    }}
                                />
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Projects Grid */}
                {projectsLoading ? (
                    <Box display="flex" justifyContent="center" py={4}>
                        <Spinner show={true} />
                    </Box>
                ) : (
                    <>
                        {/* Pagination Controls - Top */}
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={2}
                        >
                            <Typography variant="body2" color="text.secondary">
                                {filteredProjects.length > 0
                                    ? `Showing ${startItem}-${endItem} of ${filteredProjects.length} project(s)`
                                    : "No projects found"}
                                {searchTerm && ` for "${searchTerm}"`}
                            </Typography>

                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Items per page:
                                </Typography>
                                <Select
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    size="small"
                                    sx={{ minWidth: 80 }}
                                >
                                    {itemsPerPageOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>

                        {/* CSS Grid for fixed-size cards with full-width container */}
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "repeat(auto-fill, minmax(150px, 1fr))",
                                    sm: "repeat(auto-fill, minmax(170px, 1fr))",
                                    md: "repeat(auto-fill, minmax(180px, 1fr))",
                                },
                                gap: 2,
                                width: "100%",
                            }}
                        >
                            {paginatedProjects.map((project) => (
                                <ConstructionProjectCard
                                    key={project._index}
                                    project={project}
                                    isSelected={isProjectSelected(project._index)}
                                    onSelect={() => handleSelectProject(project)}
                                />
                            ))}
                        </Box>

                        {filteredProjects.length === 0 && (
                            <Box textAlign="center" py={4}>
                                <SearchIcon style={{ fontSize: 48, color: "#ccc" }} />
                                <Typography variant="body1" color="text.secondary" mt={1}>
                                    No projects found matching "{searchTerm}"
                                </Typography>
                            </Box>
                        )}

                        {/* Pagination Controls - Bottom */}
                        {totalPages > 1 && (
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                mt={2}
                            >
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                    siblingCount={1}
                                    boundaryCount={1}
                                />
                            </Box>
                        )}
                    </>
                )}
            </Box>
        );
    };

    const renderInputSection = () => {
        switch (inputMode) {
            case "construction":
                return renderConstructionProjectsSection();
            case "id":
                return (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {/* Mock Data Notice */}
                        <Box
                            sx={{
                                p: 2,
                                backgroundColor: "#fff3e0",
                                borderRadius: 2,
                                border: "1px solid #ff9800",
                            }}
                        >
                            <Typography variant="body2" color="#e65100" fontWeight="medium">
                                ⚠️ Hinweis: Diese Funktion nutzt derzeit Mock-Daten für die Demo
                            </Typography>
                        </Box>

                        {featureIdFields.map((field, index) => (
                            <TextField
                                key={index}
                                label={`Feature ID ${index + 1}`}
                                value={field}
                                onChange={(e) => handleFieldChange(setFeatureIdFields, index, e.target.value)}
                                fullWidth
                            />
                        ))}
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Box>
                    </Box>
                );
            case "json":
                return (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {jsonFields.map((field, index) => (
                            <TextField
                                key={index}
                                label={`Field ${index + 1}`}
                                value={field}
                                onChange={(e) => handleFieldChange(setJsonFields, index, e.target.value)}
                                fullWidth
                            />
                        ))}
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Submit
                            </Button>
                        </Box>
                    </Box>
                );
            case "file":
                return (
                    <Box display="flex" flexDirection="column" gap={1.5}>
                        <Button variant="contained" component="label">
                            Upload GeoJSON File
                            <input
                                type="file"
                                accept="application/json"
                                hidden
                                onChange={handleGeoJsonFileChange}
                            />
                        </Button>

                        {fileError && (
                            <Typography variant="body2" color="error">
                                {fileError}
                            </Typography>
                        )}

                        {geoJsonFile && (
                            <Box display="flex" alignItems="center" gap={1}>
                                <Chip
                                    label={`${geoJsonFile.name} — ${(geoJsonFile.size / 1024).toFixed(1)} KB`}
                                    onDelete={removeGeoJsonFile}
                                    variant="outlined"
                                />
                                <Button size="small" onClick={removeGeoJsonFile}>
                                    Remove
                                </Button>
                            </Box>
                        )}

                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={!geoJsonFile}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                );
            default:
                return null;
        }
    };

    if (u && u.role && (u.role.includes("ADMIN") || u.role.includes("MANAGER"))) {
        return (
            <Container>
                <Spinner show={loading} />
                <Card>
                    <CardHeader title="New Transfer" />
                    <CardContent>
                        <FormControl component="fieldset">
                            <RadioGroup
                                row
                                value={inputMode}
                                onChange={(e) => setInputMode(e.target.value)}
                            >
                                <FormControlLabel
                                    value="construction"
                                    control={<Radio />}
                                    label="Construction Projects"
                                />
                                <FormControlLabel value="id" control={<Radio />} label="Feature ID" />
                                <FormControlLabel value="json" control={<Radio />} label="JSON Fields" />
                                <FormControlLabel value="file" control={<Radio />} label="GeoJSON File" />
                            </RadioGroup>
                        </FormControl>

                        <Divider sx={{ my: 2 }} />

                        {renderInputSection()}
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                {"New Transfer"}
            </Typography>

            <Typography variant="body2" color="text.secondary" style={{ paddingTop: 10, paddingBottom: 30 }}>
                Diese Funktion ist nicht verfügbar.
            </Typography>
        </Container>
    );
};

// Fixed-size Construction Project Card Component
const CARD_HEIGHT = 200;
const TEXT_MAX_LENGTH = 30;

const ConstructionProjectCard = ({ project, isSelected, onSelect }) => {
    const [expanded, setExpanded] = useState(false);

    const isLongTitle = project.title.length > TEXT_MAX_LENGTH;
    const displayTitle = expanded || !isLongTitle
        ? project.title
        : `${project.title.substring(0, TEXT_MAX_LENGTH)}...`;

    const handleToggleExpand = (e) => {
        e.stopPropagation();
        setExpanded(!expanded);
    };

    return (
        <Tooltip title={project.uuid} placement="top">
            <Box
                onClick={onSelect}
                sx={{
                    cursor: "pointer",
                    width: "100%",
                    height: CARD_HEIGHT,
                    border: isSelected ? "3px solid #1976d2" : "1px solid #e0e0e0",
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "all 0.2s ease-in-out",
                    backgroundColor: isSelected ? "#e3f2fd" : "#fff",
                    "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        transform: "translateY(-2px)",
                    },
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Selection indicator */}
                {isSelected && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1,
                        }}
                    >
                        <CheckCircleIcon color="primary" />
                    </Box>
                )}

                {/* Default Image Placeholder - Fixed Height */}
                <Box
                    sx={{
                        height: 100,
                        flexShrink: 0,
                        backgroundColor: isSelected ? "#bbdefb" : "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <AccountTreeIcon
                        sx={{
                            fontSize: 48,
                            color: isSelected ? "#1976d2" : "#bdbdbd",
                        }}
                    />
                </Box>

                {/* Title Section - Fixed Height */}
                <Box
                    sx={{
                        p: 1.5,
                        height: 100,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        overflow: "hidden",
                    }}
                >
                    <Typography
                        variant="body2"
                        fontWeight="medium"
                        sx={{
                            fontSize: "0.8rem",
                            lineHeight: 1.3,
                            color: isSelected ? "#1976d2" : "text.primary",
                            wordBreak: "break-word",
                            overflow: expanded ? "visible" : "hidden",
                        }}
                    >
                        {displayTitle}
                    </Typography>

                    {/* More/Less Button */}
                    {isLongTitle && (
                        <Button
                            size="small"
                            onClick={handleToggleExpand}
                            sx={{
                                mt: 0.5,
                                p: 0,
                                minWidth: "auto",
                                fontSize: "0.7rem",
                                textTransform: "none",
                                alignSelf: "flex-start",
                            }}
                        >
                            {expanded ? "less..." : "more..."}
                        </Button>
                    )}
                </Box>
            </Box>
        </Tooltip>
    );
};

export default NewTransfer;