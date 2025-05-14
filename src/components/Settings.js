import { Box, Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { HomeNavigation } from "./Home";



const Settings = () => {
    return (
        <div style={{ marginBottom: 100 }}>
            <HomeNavigation />
            <SettingsBody />
        </div>
    );
}

const SettingsBody = () => {
    const [value, setValue] = useState('m0');
    const u = useSelector((state) => state.user.user)

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    if (u && u.role && u.role.includes("USER")) {
        return (
            <Container>
                <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                    {"Settings"}
                </Typography>

                <Typography variant="body2" color="text.secondary" style={{ paddingTop: 10, paddingBottom: 30 }}>
                    Diese Funktion ist nicht verfügbar.
                </Typography>
            </Container>
        );
    }

    return (
        <>
            <Container>
                <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                    Settings
                </Typography>

                <Typography variant="body2" color="text.secondary" style={{ paddingTop: 10, paddingBottom: 30 }}>
                    Hier können Sie einstellen, das auto-transfer
                </Typography>

                <Box component="form" noValidate autoComplete="off">
                    <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">Transfer Scheduling</FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="m0" control={<Radio />} label="jede 8 Stunden" />
                            <FormControlLabel value="m1" control={<Radio />} label="Täglich" />
                            <FormControlLabel value="m2" control={<Radio />} label="jede 3 Tage" />
                            <FormControlLabel value="m3" control={<Radio />} label="Wöchentlich" />
                            <FormControlLabel value="m4" control={<Radio />} label="jede 2 Wochen" />
                            <FormControlLabel value="m5" control={<Radio />} label="Monatlich" />
                        </RadioGroup>
                    </FormControl>
                    <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                        Save
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default Settings;