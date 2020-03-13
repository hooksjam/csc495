import { ResponseConstants } from 'Constants'
import { ResponseServices } from 'Services'

function addAnswer(response, node, answer, options = {}) {
    answer.responseID = response._id
    answer.nodeID = node.referenceID
    return async (dispatch, getState) => {
        dispatch(request(node.referenceID))
            await ResponseServices.addAnswer(answer, options)
                .then(
                    x => dispatch(success(answer)),
                    error => dispatch(failure(error.toString()))
                )
    }

    function request(referenceID) {return { type: ResponseConstants.ADD_ANSWER_REQUEST, referenceID } }
    function success(answer) { return { type: ResponseConstants.ADD_ANSWER_SUCCESS, answer } }
    function failure(error) { return { type: ResponseConstants.ADD_ANSWER_FAILURE, error } }
}

function addResponse(formFillerID, patientID, diagnosticProcedureID="") {
    return async (dispatch, getState) => {
        dispatch(request(patientID))
            await ResponseServices.addResponse(formFillerID, patientID, diagnosticProcedureID)
                .then(
                    response => dispatch(success(response)),
                    error => dispatch(failure(error.toString()))
                )
    }

    function request(patientID) {return { type: ResponseConstants.ADD_REQUEST, patientID } }
    function success(response) { return { type: ResponseConstants.ADD_SUCCESS, response } }
    function failure(error) { return { type: ResponseConstants.ADD_FAILURE, error } }
}

function getResponseList(formFillerID, patientID) {
    return async (dispatch, getState) => {
        if(patientID in getState().response.results) {
            dispatch(success([], patientID))
            return
        }
        dispatch(request(formFillerID));

        await ResponseServices.getResponseList(formFillerID, patientID)
            .then(
                responses => dispatch(success(responses, patientID)),
                error => dispatch(failure(error.toString()))
            )
    }

    function request(formFillerID){ return { type: ResponseConstants.GET_LIST_REQUEST, formFillerID } }
    function success(responses, patientID) { return { type: ResponseConstants.GET_LIST_SUCCESS, responses, patientID } }
    function failure(error) { return { type: ResponseConstants.GET_LIST_FAILURE, error } }
}

function setProcedure(responseID, diagnosticProcedureID) {
    return async (dispatch, getState) => {
        dispatch(request(responseID, diagnosticProcedureID))
            await ResponseServices.setProcedure(responseID, diagnosticProcedureID)
                .then(
                    resp => dispatch(success(responseID, diagnosticProcedureID)),
                    error => dispatch(failure(error.toString()))
                )
    }

    function request(responseID, diagnosticProcedureID) {return { type: ResponseConstants.SET_PROCEDURE_REQUEST, responseID, diagnosticProcedureID } }
    function success(responseID, diagnosticProcedureID) { return { type: ResponseConstants.SET_PROCEDURE_SUCCESS, responseID, diagnosticProcedureID } }
    function failure(error) { return { type: ResponseConstants.SET_PROCEDURE_FAILURE, error } }
}

export const ResponseActions = {
    addAnswer,
    addResponse,
    getResponseList,
    setProcedure
}