import { Axios } from 'Helpers'

async function getResponseList(formFillerID, patient) {
    let responses = {}
    
    try {
        responses = await Axios.get(`/api/response/search?formFillerID=${formFillerID}&patientID=${patient}`)
    } catch(e) {
        console.log(e)
        return responses
    }

    return responses.data
}

async function addAnswer(responseID, nodeID, answer) {
    let responses = {}
    try {
        responses = await Axios.post(`/api/response/answer`, {responseID, nodeID, answer} )
    } catch(e) {
        console.log(e)
        return {}
    }
    return responses.data
}

export const FormServices = {
    addAnswer,
    // addResponse,
    getResponseList,
}
