import { workerConstants } from "../constants";
import { authHeaderWithJSON } from "../helpers/auth-header";

export const profileService = {
    createUser,
    modifyUser,
    deleteUser,
    getProfileList,
    getProfile,

};

const WORKER = workerConstants.WORKER

function createUser(data) {
    const body = JSON.stringify(data);

    return fetch(WORKER + "register",
        {
            method: 'POST',
            headers: authHeaderWithJSON(),
            body: body
        });
}

function modifyUser(data) {
    const body = JSON.stringify(data);

    return fetch(WORKER + "modify",
        {
            method: 'POST',
            headers: authHeaderWithJSON(),
            body: body
        });
}

function deleteUser(uuid) {
    const body = JSON.stringify({ uuid });

    return fetch(WORKER + "delete",
        {
            method: 'POST',
            headers: authHeaderWithJSON(),
            body: body
        });
}

function getProfileList() {
    return fetch(WORKER + "users",
        {
            method: 'GET',
            headers: authHeaderWithJSON(),
            // headers: { 'Accept': 'application/json', /*'mode': "no-cors", "Access-Control-Allow-Origin": "*"*/ }
        });
}

function getProfile(uuid) {
    const body = JSON.stringify({ uuid });

    return fetch(WORKER + "users",
        {
            method: 'POST',
            headers: authHeaderWithJSON(),
            body: body
        });
}