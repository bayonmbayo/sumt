import { transferConstants } from "../constants";



export function transfer(state = { loading: false }, action) {
    switch (action.type) {
        case transferConstants.GET_REQUEST:
            return {
                transfer: "",
                loading: true
            };
        case transferConstants.GET_SUCCESS:
            // console.log(action.payload)
            return {
                transfer: action.payload,
                loading: false
            };
        case transferConstants.GET_FAILURE:
            // console.log(action.payload)
            return {
                error: action.payload,
                transfer: "",
                loading: false,
                done: true
            };
        case transferConstants.GET_FAILURE_DONE:
            return {
                error: Object.keys({ ...state.error }).length === 0 ? "" : { ...state.error },
                transfer: "",
                loading: false,
                done: false
            };
        default:
            // console.log("in default")
            // console.log(state)
            return state;
    }
}