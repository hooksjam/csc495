import { AssessmentConstants } from 'Constants';

export function assessment(state = {}, action) {
    switch (action.type) {
        case AssessmentConstants.GET_PATIENTS_SUCCESSS:
            console.log("PATIENTS", action.patients)
            break
        default:
            return state;
    }
}