// import { AlertActions } from 'Actions'
// import { History } from 'Helpers'
import { StudyConstants } from 'Constants'
import { StudyServices } from 'Services'

function getPatientList(username) {
    return dispatch => {
        dispatch(request({ username }))
        StudyServices.getPatientList(username)
            .then(
                patients => {
                    dispatch(success(patients))
                },
                error => {
                    dispatch(failure(error.toString))
                })
    };

    function request(patients) { return { type: StudyConstants.GET_PATIENT_LIST_REQUEST, patients } }
    function success(patients) { return { type: StudyConstants.GET_PATIENT_LIST_SUCCESS, patients } }
    function failure(error) { return { type: StudyConstants.GET_PATIENT_LIST_ERROR, error } }
}

export const StudyActions = {
    getPatientList,
};