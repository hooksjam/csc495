import { ResponseConstants } from 'Constants'

export function response(state = {loading:false, cache:{}}, action) {
    switch (action.type) {
        case ResponseConstants.GET_LIST_REQUEST:
            return {
                ...state,
                loading: true,                
            }
        case ResponseConstants.GET_LIST_SUCCESS:
            return {
                ...state,
                responses: action.formResponses,
                loading: false,                
            }
        case ResponseConstants.GET_LIST_FAILURE:
            return { 
                ...state,
                loading: false,
                error: action.error,                
            }
        default:
            return state
    }
}