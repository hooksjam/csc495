import { StudyConstants } from 'Constants'

export function study(state = {patients:[]}, action) {
    switch (action.type) {
        case StudyConstants.GET_PATIENT_LIST_SUCCESS:
            return {
                ...state,
                patients:action.patients,
            }
        default:
            return state
    }
}