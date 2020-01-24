import { QueryConstants } from 'Constants';
import { QueryServices } from 'Services';

function sendQuery(query) {
    return async dispatch => {
        dispatch(request());

        await QueryServices.sendFormQuery(query)
            .then(
                query => dispatch(success(query)),
                error => dispatch(failure(error.toString()))
            );

    };

    function request() { return { type: QueryConstants.GET_QUERY_REQUEST } }
    function success(query) { return { type: QueryConstants.GET_QUERY_SUCCESS, query } }
    function failure(error) { return { type: QueryConstants.GET_QUERY_FAILURE, error } }
}

function sendESQuery(query) {
    return async dispatch => {
        dispatch(request());

        await QueryServices.sendESQuery(query)
            .then(
                query => dispatch(success(query)),
                error => dispatch(failure(error.toString()))
            );

    };

    function request() { return { type: QueryConstants.GET_QUERY_REQUEST } }
    function success(response) { return { type: QueryConstants.GET_QUERY_SUCCESS, response } }
    function failure(error) { return { type: QueryConstants.GET_QUERY_FAILURE, error } }
}

export const QueryActions = {
    sendQuery,
    sendESQuery,
};