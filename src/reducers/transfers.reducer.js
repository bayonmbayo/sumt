import { transfersConstants } from "../constants";



export function transfers(state = { loading: false }, action) {
    switch (action.type) {
        case transfersConstants.GET_REQUEST:
            return {
                transfers: "",
                loading: true
            };
        case transfersConstants.GET_SUCCESS:
            // console.log(action.payload)
            return {
                transfers: action.payload,
                loading: false
            };
        case transfersConstants.GET_FAILURE:
            // console.log(action.payload)
            return {
                error: action.payload,
                transfers: "",
                loading: false,
                done: true
            };
        case transfersConstants.GET_FAILURE_DONE:
            return {
                error: Object.keys({ ...state.error }).length === 0 ? "" : { ...state.error },
                transfers: "",
                loading: false,
                done: false
            };
        default:
            // console.log("in default")
            // console.log(state)
            return state;
    }
}