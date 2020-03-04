import { StudyConstants } from 'Constants'

export function study(state = {patients:[]}, action) {
    switch (action.type) {
        case StudyConstants.GET_PATIENTS_SUCCESS:
            console.log("PATIENTS", action.patients)
            return {
                ...state,
                patients:action.patients,
            }
        default:
            return state
    }
}