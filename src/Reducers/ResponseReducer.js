import { ResponseConstants } from 'Constants'

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

            console.log("REPSONSES", action.responses)
            for(let i = 0; i < action.responses.length; i++) {
                newState.results[action.patientID].push(action.responses[i]._id)

                var response = action.responses[i]
                console.log("ANSWRS", response.answers)
                response.map = response.answers.reduce((map, obj) => {
                    map[`${obj.nodeID}_${obj.instance}`] = obj
                    return map
                }, {})
                console.log("MAP", response.map)
                response.answers = []
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
            /*console.log("RESP", response)
            response.map = response.answers.reduce((map, obj) => {
                map[`${obj.nodeID}_${obj.instance}`] = obj
                return map
            }, {})*/
            response.map = {}
            newState.cache[response._id] = response
            return newState
        }
        case ResponseConstants.SET_PROCEDURE_SUCCESS: {
            var newState = {...state}
            newState.cache[action.responseID].diagnosticProcedureID = action.diagnosticProcedureID
            return newState
        }
        case ResponseConstants.ADD_ANSWER_SUCCESS: {
            var newState = {...state}
            // Update answer list and map
            var answer = action.answer
            var key = `${answer.nodeID}_${answer.instance}`
            var response = newState.cache[answer.responseID]
            response.map[key] = answer
        }
        default:
            return state
    }
}