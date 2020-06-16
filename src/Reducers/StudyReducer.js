import { StudyConstants } from 'Constants'

export function study(state = {patients:[], answers:[], results: [], focusItems:[]}, action) {
    switch (action.type) {
        case StudyConstants.GET_PATIENT_LIST_SUCCESS:
            return {
                ...state,
                patients:action.patients,
            }

        case StudyConstants.INIT_SUCCESS: {
        	var newState = {
        		...state,
        		results:action.results,
        		answers:action.answers,
                names:action.names,
                ordering:action.ordering,
        	}
        	return newState
        }
        case StudyConstants.FOCUS_ITEMS_SUCCESS: {
            	return {
        		...state,
        		focusItems:action.items || []
        	}
        }
        default:
            return state
    }
}