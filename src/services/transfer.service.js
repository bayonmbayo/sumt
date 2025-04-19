

export const transferService = {
    getTransfer,
    getAllTransfers
};

function getTransfer() {
    console.log("in Service transfer")
    return fetch("transfer.json",
        {
            method: 'GET',
            headers: { 'Accept': 'application/json', /*'mode': "no-cors", "Access-Control-Allow-Origin": "*"*/ }
        });
}

function getAllTransfers() {
    console.log("in Service transfer")
    return fetch("transfer2.json",
        {
            method: 'GET',
            headers: { 'Accept': 'application/json', /*'mode': "no-cors", "Access-Control-Allow-Origin": "*"*/ }
        });
}