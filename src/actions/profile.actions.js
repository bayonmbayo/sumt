import Swal from "sweetalert2";
import { profileConstants } from "../constants";
import { profileService } from "../services/profile.service";



export const profileActions = {
    createUser,
    updateUser,
    getProfileList,
}

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


function createUser(userdata) {
    return dispatch => {
        dispatch({ type: profileConstants.CREATE_PROFIL_REQUEST });

        profileService.createUser(userdata)
            .then(response => {
                // Directly use response.status to check the HTTP status code
                if (!response.ok) {
                    dispatch({ type: profileConstants.CREATE_PROFIL_FAILURE, payload: [response, userdata] })

                    Toast.fire({
                        icon: "warning",
                        title: "Please verify if you complete correctly the profil"
                    });

                    throw new Error('Network response was not ok. Status Code: ' + response.status);
                }
                return response.json(); // Assuming the response is JSON. Use response.text() if it's plain text.
            })
            .then(data => {
                dispatch({ type: profileConstants.CREATE_PROFIL_SUCCESS, payload: [data, userdata] })
            })
            .catch(error => {
                dispatch({ type: profileConstants.CREATE_PROFIL_FAILURE, payload: [error, userdata] })
            })
    }
}

function updateUser(userdata) {
    return dispatch => {
        dispatch({ type: profileConstants.UPDATE_PROFIL_REQUEST });

        profileService.modifyUser(userdata)
            .then(response => {
                // Directly use response.status to check the HTTP status code
                if (!response.ok) {
                    dispatch({ type: profileConstants.UPDATE_PROFIL_FAILURE, payload: [response, userdata] })

                    Toast.fire({
                        icon: "warning",
                        title: "Please verify if you complete correctly the profil"
                    });

                    throw new Error('Network response was not ok. Status Code: ' + response.status);
                }
                return response.json(); // Assuming the response is JSON. Use response.text() if it's plain text.
            })
            .then(data => {
                dispatch({ type: profileConstants.UPDATE_PROFIL_SUCCESS, payload: [data, userdata] })
            })
            .catch(error => {
                dispatch({ type: profileConstants.UPDATE_PROFIL_FAILURE, payload: [error, userdata] })
            })
    }
}

function getProfileList() {
    console.log("in Actions in TopicList")
    return dispatch => {
        dispatch({ type: profileConstants.GET_PROFILS_REQUEST });

        profileService.getProfileList()
            .then(res => res.json())
            .then(data => dispatch({ type: profileConstants.GET_PROFILS_SUCCESS, payload: data }))
            .catch(error => dispatch({ type: profileConstants.GET_PROFILS_FAILURE, payload: error }));
    };
}