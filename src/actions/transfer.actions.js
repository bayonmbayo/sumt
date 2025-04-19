import { transferConstants, transfersConstants } from "../constants";
import { transferService } from "../services/transfer.service";


export const transferActions = {
    getTransfer,
    getAllTransfers
};

function getTransfer() {
    console.log("in Actions in Transfer")
    return dispatch => {
        dispatch({ type: transferConstants.GET_REQUEST });

        transferService.getTransfer()
            .then(res => res.json())
            .then(data => dispatch({ type: transferConstants.GET_SUCCESS, payload: data }))
            .catch(error => dispatch({ type: transferConstants.GET_FAILURE, payload: error }));
    };
}

function getAllTransfers() {
    console.log("in Actions in Transfers")
    return dispatch => {
        dispatch({ type: transfersConstants.GET_REQUEST });

        transferService.getAllTransfers()
            .then(res => res.json())
            .then(data => dispatch({ type: transfersConstants.GET_SUCCESS, payload: data }))
            .catch(error => dispatch({ type: transfersConstants.GET_FAILURE, payload: error }));
    };
}