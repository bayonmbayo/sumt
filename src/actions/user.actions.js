import Swal from "sweetalert2";
import { userConstants } from "../constants";
import { userService } from "../services";

export const userActions = {
    register,
    login,
    session,
    logout
};


const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

function register(profil) {
    // console.log(searchText)
    // console.log("in search news")
    return dispatch => {
        dispatch({ type: userConstants.REGISTER_REQUEST });

        userService.register(profil)
            .then(response => {
                // Directly use response.status to check the HTTP status code
                if (!response.ok) {
                    dispatch({ type: userConstants.REGISTER_FAILURE, payload: [response, profil] })
                    // dispatch(userActions.session());

                    Toast.fire({
                        icon: "warning",
                        title: "Please verify if you complete correctly"
                    });

                    throw new Error('Network response was not ok. Status Code: ' + response.status);
                }
                return response.json(); // Assuming the response is JSON. Use response.text() if it's plain text.
            })
            .then(data => {
                dispatch({ type: userConstants.REGISTER_SUCCESS, payload: [data, profil] })
            })
            .catch(error => {
                dispatch({ type: userConstants.REGISTER_FAILURE, payload: [error, profil] })
                // dispatch(userActions.session());
            })
    }
}

function login(credentials) {
    return dispatch => {
        dispatch(request({ credentials }));

        userService.login(credentials)
            .then(res => res.json())
            .then(data => {
                localStorage.setItem('user', JSON.stringify(data));
                dispatch({ type: userConstants.LOGIN_SUCCESS, payload: data })
            })
            .catch(res => {
                dispatch({ type: userConstants.LOGIN_FAILURE, payload: res })
                // dispatch(failure(getErrorMessage(res)));
                // dispatch(error(getErrorMessage(res)));
            });
    };

    function request(payload) { return { type: userConstants.LOGIN_REQUEST, payload } }
    function success(payload) { return { type: userConstants.LOGIN_SUCCESS, payload } }
    function failure(payload) { return { type: userConstants.LOGIN_FAILURE, payload } }
    // function error(payload) { return { type: alertConstants.ERROR, payload } }
}

function session() {
    return dispatch => {
        dispatch(request({ "username": "" }));
        dispatch(success(JSON.parse(localStorage.getItem('user'))))
    };
    function request(payload) { return { type: userConstants.LOGIN_REQUEST, payload } }
    function success(payload) { return { type: userConstants.LOGIN_SESSION, payload } }
}

function logout() {
    // history.push('/examensportal/login');
    userService.logout();
    return { type: userConstants.LOGOUT };
}