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

async function addAnswer(answer) {
    let responses = {}
    try {
        responses = await Axios.post(`/api/response/answer`, {answer} )
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


export const ResponseServices = {
    addAnswer,
    addResponse,
    getResponseList,
    setProcedure,
}
