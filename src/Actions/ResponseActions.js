import { ResponseConstants } from 'Constants'
import { ResponseServices } from 'Services'

function addAnswer(response, node, answer) {
    return async (dispatch, getState) => {
        dispatch(request(node.referenceID));
            await FormServices.addAnswer(response.referenceID, node.referenceID, answer)
                .then(
                    answer => dispatch(success(answer)),
                    error => dispatch(failure(error.toString()))
                )
        }
    }

    function request(referenceID) {return { type: FormConstants.ADD_ANSWER_REQUEST, referenceID }
    function success(answer) { return { type: FormConstants.ADD_ANSWER_SUCCESS, answer } }
    function failure(error) { return { type: FormConstants.ADD_ANSWER_FAILURE, error } }
}


function getResponseList(formFillerID, patientID) {
    return async dispatch => {
        dispatch(request(formFillerID));

        await FormServices.getResponseList(formFillerID, patientID)
            .then(
                responses => dispatch(success(responses, patientID)),
                error => dispatch(failure(error.toString()))
            )
    }

    function request(formFillerID){ return { type: FormConstants.GET_RESPONSE_LIST_REQUEST, diagnosticProcedureID }}
    function success(responses, patientID) { return { type: FormConstants.GET_RESPONSE_LIST_SUCCESS, responses, patientID } }
    function failure(error) { return { type: FormConstants.GET_RESPONSE_LIST_FAILURE, error } }
}

export const ResponseActions = {
    addAnswer,
    getResponseList,
}