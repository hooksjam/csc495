import { OptionConstants } from 'Constants'
import { OptionServices } from 'Services'

function reloadForms() {
    return async dispatch => {
        dispatch(request());

        await OptionServices.reloadForms()
            .then(
                x => dispatch(success(x)),
                error => dispatch(failure(error.toString()))
            );

    };

    function request() { return { type: OptionConstants.CLEAR_REQUEST } }
    function success(x) { return { type: OptionConstants.CLEAR_SUCCESS, x } }
    function failure(error) { return { type: OptionConstants.CLEAR_FAILURE, error } }
}

function clear() {
    return async dispatch => {
        dispatch(request());

        await OptionServices.clear()
            .then(
                x => dispatch(success(x)),
                error => dispatch(failure(error.toString()))
            );

    };

    function request() { return { type: OptionConstants.CLEAR_REQUEST } }
    function success(x) { return { type: OptionConstants.CLEAR_SUCCESS, x } }
    function failure(error) { return { type: OptionConstants.CLEAR_FAILURE, error } }
}

export const OptionActions = {
    reloadForms,
    clear,
}