import { workerConstants } from "../constants";


export const transferService = {
    getTransfer,
    getAllTransfers
};


const WORKER = workerConstants.WORKER

function getTransfer(transfer) {
    console.log("in Service transfer")
    return fetch(WORKER + "transfers/" + transfer,
        {
            method: 'GET',
            headers: { 'Accept': 'application/json', /*'mode': "no-cors", "Access-Control-Allow-Origin": "*"*/ }
        });
}

function getAllTransfers() {
    console.log("in Service transfer")
    return fetch(WORKER + "transfers",
        {
            method: 'GET',
            headers: { 'Accept': 'application/json', /*'mode': "no-cors", "Access-Control-Allow-Origin": "*"*/ }
        });
}