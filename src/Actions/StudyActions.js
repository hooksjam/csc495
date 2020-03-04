// import { AlertActions } from 'Actions'
// import { History } from 'Helpers'
import { StudyConstants } from 'Constants'
import { StudyServices } from 'Services'

function getPatients(username) {
    return dispatch => {
        dispatch(request({ username }))
        StudyServices.getPatients(username)
            .then(
                patients => {
                    dispatch(success(patients))
                },
                error => {
                    dispatch(failure(error.toString))
                })
    };

    function request(patients) { return { type: StudyConstants.GET_PATIENTS_REQUEST, patients } }
    function success(patients) { return { type: StudyConstants.GET_PATIENTS_SUCCESS, patients } }
    function failure(error) { return { type: StudyConstants.GET_PATIENTS_ERROR, error } }
}

export const StudyActions = {
    getPatients,
};