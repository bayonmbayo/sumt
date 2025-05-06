export function getErrorMessage(err) {
    if (err) {
        if (err.response) {
            if (err.response.data.errors) {
                return err.response.data.message + " " + err.response.data.errors.join(", ");

            } else if (err.response.data.warnings) {
                return err.response.data.message + " " + err.response.data.warnings.join(", ");

            } else {
                return err.response.data.message
            }
        } else {
            return err.response;
        }
    } else {
        return "Es ist ein Fehler aufgetreten";
    }
}