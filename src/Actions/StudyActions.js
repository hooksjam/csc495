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

function initStudy(form, rawResults, reduction, predicates) {
    console.log("INIT STUDY!", form, rawResults, reduction, predicates)
    return dispatch => {
        //dispatch(request())
        var x = StudyServices.initStudy(form, rawResults, reduction, predicates)
        dispatch(success(x.results, x.answers))
        /*error => {
            dispatch(failure(error.toString))
        })*/
    };

    function request() { return { type: StudyConstants.INIT_REQUEST } }
    function success(results, answers) { return { type: StudyConstants.INIT_SUCCESS, results, answers } }
    function failure(error) { return { type: StudyConstants.INIT_FAILURE, error } } 
}

function focusItems(items) {
    return dispatch => {
        //dispatch(request())
        dispatch(success(items))
        /*error => {
            dispatch(failure(error.toString))
        })*/
    };

    function request() { return { type: StudyConstants.FOCUS_ITEMS_REQUEST } }
    function success(items) { return { type: StudyConstants.FOCUS_ITEMS_SUCCESS, items} }
    function failure(error) { return { type: StudyConstants.FOCUS_ITEMS_FAILURE, error } } 
}

export const StudyActions = {
    getPatientList,
    initStudy,
    focusItems,
}