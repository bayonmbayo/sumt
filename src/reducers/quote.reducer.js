import { quoteConstants } from "../constants";


export function quote(state = { loading: false }, action) {
    switch (action.type) {
        case quoteConstants.GET_REQUEST:
            return {
                quote: "",
                loading: true
            };
        case quoteConstants.GET_SUCCESS:
            // console.log(action.payload)
            return {
                quote: action.payload,
                loading: false
            };
        case quoteConstants.GET_FAILURE:
            // console.log(action.payload)
            return {
                error: action.payload,
                quote: "",
                loading: false,
                done: true
            };
        default:
            return state;
    }
}