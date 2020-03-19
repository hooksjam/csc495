import { ResponseConstants } from 'Constants'

var initResponse = (response) => {
    if(response.answers.length == 0) {
        response.map = {}
    } else {
        response.map = response.answers.reduce((map, obj) => {
            map[`${obj.nodeID}_${obj.instance}`] = obj
            return map
        }, {})
        response.answers = []
    }
    response.getAnswerFn = (nodeID, instance=0) => {
        var key = `${nodeID}_${instance}`
        return response.map[key]
    }
}
export function response(state = {loading:false, results:{}, cache:{}}, action) {
    switch (action.type) {
        // case ResponseConstants.GET_LIST_REQUEST:
        //     return {
        //         ...state,
        //         loading: true,                
        //     }
        case ResponseConstants.GET_LIST_SUCCESS:
            var newState = {...state}
            if(action.responses.length == 0)
                return newState

            if(action.patientID in newState.results)
                delete newState.results[action.patientID]
            newState.results[action.patientID] = []

            for(let i = 0; i < action.responses.length; i++) {
                newState.results[action.patientID].push(action.responses[i]._id)

                var response = action.responses[i]
                initResponse(response)
                newState.cache[response._id] = response
            }
            return newState
        case ResponseConstants.GET_LIST_FAILURE:
            return { 
                ...state,
                error: action.error,                
            }

        case ResponseConstants.ADD_SUCCESS: {
            var newState = {...state}
            if(!(action.response.patientID in newState.results))
                newState.results[action.response.patientID] = []
            newState.results[action.response.patientID].push(action.response._id)

            var response = action.response
            initResponse(response)
            newState.cache[response._id] = response
            return newState
        }
        case ResponseConstants.SET_PROCEDURE_SUCCESS: {
            var newState = {...state}
            newState.cache[action.responseID].diagnosticProcedureID = action.diagnosticProcedureID
            return newState
        }
        case ResponseConstants.SET_DATE_SUCCESS: {
            var newState = {...state}
            newState.cache[action.responseID].date = action.date
            return newState
        }
        case ResponseConstants.ADD_ANSWER_SUCCESS: {
            // Update answer list and map
            var answer = action.answer
            var key = `${answer.nodeID}_${answer.instance}`
            var response = state.cache[answer.responseID]
            console.log("ADD ANSWER", answer, action.options)
            if(answer.choices != null && answer.choices.length > 0 && 'maxSelections' in action.options && action.options.maxSelections == 0 && key in response.map) {
                console.log("DERP")
                // Add to existing answer
                var existing = response.map[key]
                var choice = answer.choices[0]
                var index = existing.choices.findIndex(x => {return x.choiceID == choice.choiceID})
                if(index != -1) {
                    if(choice.field != null)
                        existing.choices[index] = choice
                } else {
                    existing.choices.push(choice)
                }
            } else {
                console.log("LERP")
                response.map[key] = answer
            }
            console.log("AFTER ADD", response.map[key])
            return {...state}
        }
        case ResponseConstants.DELETE_ANSWER_SUCCESS: {
            // Update answer list and map
            var key = `${action.nodeID}_${action.instance}`
            var response = state.cache[action.responseID]
            if(key in response.map) {
                console.log("DELETE CHOICE!", action.choiceID)
                if(action.choiceID) {
                    response.map[key].choices = response.map[key].choices.filter(x => {
                        return x.choiceID != action.choiceID
                    })
                } else {
                    delete response.map[key]
                }
                console.log("AFTER DELETE", response.map[key])
            }
            return {...state}
        }
        default:
            return state
    }
}