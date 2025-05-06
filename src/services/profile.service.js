import { workerConstants } from "../constants";
import { authHeaderWithJSON } from "../helpers/auth-header";

export const profileService = {
    createUser,
    getProfileList
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

function getProfileList() {
    console.log("in Service users")
    return fetch("users.json",
        {
            method: 'GET',
            headers: authHeaderWithJSON(),
            // headers: { 'Accept': 'application/json', /*'mode': "no-cors", "Access-Control-Allow-Origin": "*"*/ }
        });
}