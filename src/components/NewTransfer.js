import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { HomeNavigation } from "./Home";



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

    if (u && u.role && (u.role.includes("ADMIN") || u.role.includes("MANAGER"))) {
        return (
            <>
                <Container>
                    <Typography variant="h5" fontWeight="bold" color="text.secondary" style={{ paddingTop: 30 }}>
                        New Transfer
                    </Typography>

                    <Typography variant="body2" color="text.secondary" style={{ paddingTop: 10, paddingBottom: 30 }}>
                        Bitte geben Sie Ihren die IDs von Bauprojekte, die Sie transferieren möchten. Achten Sie darauf, dass diese IDs gültig sind.
                    </Typography>

                    <Box component="form" noValidate autoComplete="off">
                        <TextField
                            fullWidth
                            label="Bauprojekt 1"
                            placeholder="Geben Sie die ID des Bauprojekts ein"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Bauprojekt 2"
                            placeholder="Geben Sie die ID des Bauprojekts ein"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Bauprojekt 3"
                            placeholder="Geben Sie die ID des Bauprojekts ein"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Bauprojekt 4"
                            placeholder="Geben Sie die ID des Bauprojekts ein"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Bauprojekt 5"
                            placeholder="Geben Sie die ID des Bauprojekts ein"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Bauprojekt 6"
                            placeholder="Geben Sie die ID des Bauprojekts ein"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Bauprojekt 7"
                            placeholder="Geben Sie die ID des Bauprojekts ein"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Bauprojekt 8"
                            placeholder="Geben Sie die ID des Bauprojekts ein"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Bauprojekt 9"
                            placeholder="Geben Sie die ID des Bauprojekts ein"
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Bauprojekt 10"
                            placeholder="Geben Sie die ID des Bauprojekts ein"
                            margin="normal"
                        />
                        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                            Transfer
                        </Button>
                    </Box>
                </Container>
            </>
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