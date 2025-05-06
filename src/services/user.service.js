import { workerConstants } from "../constants";
import { authHeaderWithJSON } from "../helpers/auth-header";

export const userService = {
    register,
    confirmation,
    login,
    logout
};

const WORKER = workerConstants.WORKER

function register(data) {
    const body = JSON.stringify(data);

    return fetch(WORKER + "register",
        {
            method: 'POST',
            headers: authHeaderWithJSON(),
            // headers: { 'Accept': 'application/json', 'mode': "no-cors", "Access-Control-Allow-Origin": "*", 'Content-Type': 'application/json' },
            body: body
        });
}

function login(email, passwort) {
    const body = JSON.stringify({ email, passwort });

    return fetch(WORKER + "login",
        {
            method: 'POST',
            headers: authHeaderWithJSON(),
            body: body
        });
}

function confirmation(token) {

    return fetch(WORKER + "confirmation/" + token,
        {
            method: 'GET',
            headers: authHeaderWithJSON(),
        });
}

function logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('user');
}