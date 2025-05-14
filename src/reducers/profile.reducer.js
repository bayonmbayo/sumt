import { profileConstants } from "../constants";



export function profiles(state = { loading: false }, action) {
    switch (action.type) {
        case profileConstants.GET_PROFILS_REQUEST:
            return {
                profilList: "",
                loading: true,
                done: false,
                error: undefined
            };
        case profileConstants.GET_PROFILS_SUCCESS:
            // console.log(action.payload)
            return {
                profilList: action.payload,
                loading: false,
                done: true,
                error: undefined
            };
        case profileConstants.GET_PROFILS_FAILURE:
            return {
                error: action.payload,
                profilList: Object.keys({ ...state.profilList }).length === 0 ? "" : { ...state.profilList },
                loading: false,
                done: true
            };
        default:
            // console.log("in default")
            // console.log(state)
            return state;
    }
}

export function profil(state = { loading: false }, action) {
    switch (action.type) {
        case profileConstants.CREATE_PROFIL_REQUEST:
            return {
                done: false,
                loading: true,
                error: undefined,
                profil: "",
                userdata: ""
            };
        case profileConstants.CREATE_PROFIL_SUCCESS:
            return {
                done: true,
                loading: false,
                error: undefined,
                profil: action.payload[1],
                userdata: action.payload[0],
            };
        case profileConstants.CREATE_PROFIL_FAILURE:
            return {
                done: true,
                loading: false,
                profil: Object.keys({ ...state.profil }).length === 0 ? "" : { ...state.profil },
                error: action.payload[0],
                userdata: action.payload[1],
            };
        case profileConstants.CREATE_PROFIL_SUCCESS_DONE:
            return {
                done: false,
                loading: false,
                error: undefined,
                userdata: Object.keys({ ...state.userdata }).length === 0 ? "" : { ...state.userdata },
                profil: Object.keys({ ...state.profil }).length === 0 ? "" : { ...state.profil },
            };
        case profileConstants.CREATE_PROFIL_FAILURE_DONE:
            return {
                done: false,
                loading: false,
                error: Object.keys({ ...state.error }).length === 0 ? "" : { ...state.error },
                profil: Object.keys({ ...state.profil }).length === 0 ? "" : { ...state.profil },
                userdata: Object.keys({ ...state.userdata }).length === 0 ? "" : { ...state.userdata },
            };
        case profileConstants.UPDATE_PROFIL_REQUEST:
            return {
                done: false,
                loading: true,
                error: undefined,
                profil: "",
                userdata: ""
            };
        case profileConstants.UPDATE_PROFIL_SUCCESS:
            return {
                done: true,
                loading: false,
                error: undefined,
                profil: action.payload[1],
                userdata: action.payload[0],
            };
        case profileConstants.UPDATE_PROFIL_FAILURE:
            return {
                done: true,
                loading: false,
                profil: Object.keys({ ...state.profil }).length === 0 ? "" : { ...state.profil },
                error: action.payload[0],
                userdata: action.payload[1],
            };
        case profileConstants.UPDATE_PROFIL_SUCCESS_DONE:
            return {
                done: false,
                loading: false,
                error: undefined,
                profil: Object.keys({ ...state.profil }).length === 0 ? "" : { ...state.profil },
                userdata: Object.keys({ ...state.userdata }).length === 0 ? "" : { ...state.userdata },
            };
        case profileConstants.UPDATE_PROFIL_FAILURE_DONE:
            return {
                done: false,
                loading: false,
                profil: Object.keys({ ...state.profil }).length === 0 ? "" : { ...state.profil },
                error: Object.keys({ ...state.error }).length === 0 ? "" : { ...state.error },
                userdata: Object.keys({ ...state.userdata }).length === 0 ? "" : { ...state.userdata },
            };

        default:
            return state;
    }
}