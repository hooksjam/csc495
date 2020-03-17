import { Axios } from 'Helpers'

async function getResponseList(formFillerID, patient) {
    let responses = {}
    
    try {
        responses = await Axios.get(`/api/response/search?full=1&formFillerID=${formFillerID}&patientID=${patient}`)
    } catch(e) {
        console.log(e)
        return responses
    }

    return responses.data
}

async function addResponse(formFillerID, patientID, diagnosticProcedureDI) {
    let responses = {}
    try {
        responses = await Axios.post(`/api/response`, {formFillerID, patientID, diagnosticProcedureDI} )
    } catch(e) {
        console.log(e)
        return {}
    }
    return responses.data
}

async function addAnswer(answer, options) {
    let responses = {}
    try {
        var body = {
            answer:answer
        }
        for(var key in options) {
            body[key] = options[key]
        }
        responses = await Axios.post(`/api/response/answer`, body)
    } catch(e) {
        console.log(e)
        return {}
    }
    return responses.data
}

async function deleteAnswer(responseID, nodeID, instance, choiceID=null) {
    let responses = {}
    try {
        var query 
        if(choiceID != null)
            query = `/api/response/answer?responseID=${responseID}&nodeID=${nodeID}&instance=${instance}&choiceID=${choiceID}`
        else
            query = `/api/response/answer?responseID=${responseID}&nodeID=${nodeID}&instance=${instance}`
        responses = await Axios.delete(query)
    } catch(e) {
        console.log(e)
        return {}
    }
    return responses.data
}

async function setProcedure(responseID, diagnosticProcedureID) {
    let responses = {}
    try {
        responses = await Axios.put(`/api/response/procedure`, {_id:responseID, diagnosticProcedureID} )
    } catch(e) {
        console.log(e)
        throw e
    }
    return responses.data
}

async function setDate(responseID, date) {
    let responses = {}
    try {
        responses = await Axios.put(`/api/response/date`, {_id:responseID, date:date} )
    } catch(e) {
        console.log(e)
        throw e
    }
    return responses.data
}

export const ResponseServices = {
    addAnswer,
    deleteAnswer,
    addResponse,
    getResponseList,
    setProcedure,
    setDate,
}
