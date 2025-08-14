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
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { HomeNavigation } from "./Home";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../assets/spinner";
import { workerConstants } from "../constants";
import { authHeaderWithoutContentType } from "../helpers/auth-header";


const WORKER = workerConstants.WORKER

const NewTransfer = () => {
    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation />
            <NewTransferBody />
        </div>
    );
}

const NewTransferBody = () => {
    const u = useSelector((state) => state.user.user)
    const navigate = useNavigate()

    const [inputMode, setInputMode] = useState("id");
    const [featureIdFields, setFeatureIdFields] = useState(Array(10).fill(""));
    const [jsonFields, setJsonFields] = useState(Array(10).fill(""));
    const [geoJsonFile, setGeoJsonFile] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [loading, setLoading] = useState(false)



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

            const isJsonMime = f.type === "application/json" || f.type === "application/geo+json";
            const hasValidExt = lowerName.endsWith(".json") || lowerName.endsWith(".geojson");

            if (!isJsonMime || !hasValidExt) {
                setFileError("Please upload a file with .json or .geojson extension.");
                setGeoJsonFile(null);
            } else {
                setFileError(null);
                setGeoJsonFile(f);
            }
        } else {
            // No file selected
            setGeoJsonFile(null);
            setFileError(null);
        }

        // Reset the input so same file can be reselected later
        e.target.value = "";
    };

    const removeGeoJsonFile = () => {
        setGeoJsonFile(null);
        setFileError(null);
    };

    const combinedJson = jsonFields
        .filter((value) => value.trim() !== "")
        .map((str) => {
            try {
                return JSON.parse(str); // safely parse
            } catch (e) {
                throw new Error(`Invalid JSON in one of the fields: ${str}`);
            }
        });

    const handleSubmit = async () => {
        const formData = new FormData();

        if (inputMode === "id") {
            formData.append("featureIds", JSON.stringify(featureIdFields));
        } else if (inputMode === "json") {
            const jsonObjects = [];

            for (const raw of jsonFields.filter((v) => v.trim() !== "")) {
                try {
                    jsonObjects.push(JSON.parse(raw)); // test if it's valid
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

        setLoading(true)
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
            navigate("/transfers")
            setLoading(false)
        }
    };

    const renderInputSection = () => {
        switch (inputMode) {
            case "id":
                return (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {featureIdFields
                            .map((field, index) => (
                                <TextField
                                    key={index}
                                    label={`Feature ID ${index + 1}`}
                                    value={field}
                                    onChange={(e) => handleFieldChange(setFeatureIdFields, index, e.target.value)}
                                    fullWidth
                                />
                            ))}
                    </Box>
                );
            case "json":
                return (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {jsonFields
                            .map((field, index) => (
                                <TextField
                                    key={index}
                                    label={`Field ${index + 1}`}
                                    value={field}
                                    onChange={(e) => handleFieldChange(setJsonFields, index, e.target.value)}
                                    fullWidth
                                />
                            ))}
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
                            <Typography variant="body2" color="error">{fileError}</Typography>
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
                                <FormControlLabel value="id" control={<Radio />} label="Feature ID" />
                                <FormControlLabel value="json" control={<Radio />} label="JSON Fields" />
                                <FormControlLabel value="file" control={<Radio />} label="GeoJSON File" />
                            </RadioGroup>
                        </FormControl>

                        <Divider sx={{ my: 2 }} />

                        {renderInputSection()}

                        <Divider sx={{ my: 2 }} />

                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
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

export default NewTransfer;