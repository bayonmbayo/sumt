import { userConstants } from '../constants';
import { ProfileClass } from '../models/profile';


export function user(state = {}, action) {
    switch (action.type) {
        case userConstants.GET_USER_REQUEST:
            return {
                user: new ProfileClass(),
                loading: true
            };
        case userConstants.GET_USER_SUCCESS:
            return {
                user: action.payload.data,
                loading: false
            };
        case userConstants.GET_USER_FAILURE:
            return {
                error: action.payload.data,
                loading: false
            };
        case userConstants.SAVE_TEMPUSER:
            return {
                user: action.user,
                loading: false
            };
        case userConstants.SAVE_USER_REQUEST:
            return {
                loading: true
            };
        case userConstants.SAVE_USER_SUCCESS:
            return {
                user: action.payload.data,
                loading: false
            };
        case userConstants.SAVE_USER_FAILURE:
            return {
                error: action.payload.data,
                loading: false
            };
        case userConstants.LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: action.payload,
                done: false
            };
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                loggingIn: false,
                user: action.payload,
                done: true
            };
        case userConstants.LOGIN_SESSION:
            return {
                loggedIn: true,
                loggingIn: false,
                user: action.payload,
            };
        case userConstants.LOGIN_FAILURE:
            return {
                loggedIn: false,
                loggingIn: false,
                message: action.payload,
                done: true
            };
        case userConstants.LOGOUT:
            return {
                loggedIn: false,
                loggingIn: false,
                user: "",
            };
        case userConstants.REGISTER_REQUEST:
            return {
                done: false,
                loading: true,
                error: undefined,
                profil: new ProfileClass()
            };
        case userConstants.REGISTER_SUCCESS:
            return {
                done: true,
                loading: false,
                error: undefined,
                user: action.payload[0],
                profil: action.payload[1],
            };
        case userConstants.REGISTER_FAILURE:
            return {
                done: true,
                loading: false,
                error: action.payload[0],
                profil: action.payload[1],
            };
        case userConstants.REGISTER_SUCCESS_DONE:
            return {
                done: false,
                loading: false,
                error: undefined,
                user: Object.keys({ ...state.user }).length === 0 ? "" : { ...state.user },
                profil: Object.keys({ ...state.profil }).length === 0 ? "" : { ...state.profil },
            };
        case userConstants.REGISTER_FAILURE_DONE:
            return {
                done: false,
                loading: false,
                error: Object.keys({ ...state.error }).length === 0 ? "" : { ...state.error },
                profil: Object.keys({ ...state.profil }).length === 0 ? "" : { ...state.profil },
            };
        default:
            return state
    }
}