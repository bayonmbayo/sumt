import { workerConstants } from "../constants";
import { authHeaderWithJSON } from "../helpers/auth-header";

export const userService = {
    register,
    confirmation,
    login,
    logout,
    requestNewPassword,
    resetPassword
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

function login(credentials) {
    const body = JSON.stringify(credentials);

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

function requestNewPassword(email) {
    const body = JSON.stringify({ email });

    return fetch(WORKER + "newpassword",
        {
            method: 'POST',
            headers: authHeaderWithJSON(),
            body: body
        });
}

function resetPassword(data) {
    const body = JSON.stringify(data);

    return fetch(WORKER + "resetpassword",
        {
            method: 'POST',
            headers: authHeaderWithJSON(),
            body: body
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}