import { Axios } from 'Helpers';

function buildQueryParam(param, value) {
    return value ? `&${param}=${value}` : "";
}

async function sendQuery(query) {
    console.log(query);
    let response = {};
    try {
        let queryString = `/api/query?diagnosticProcedureID=${query.formID}`;
        queryString += buildQueryParam("nodeID", query.nodeID);
        queryString += buildQueryParam("choiceID", query.choiceID);
        queryString += buildQueryParam("type", query.type);
        queryString += buildQueryParam("operator", query.operator);
        queryString += buildQueryParam("numberValue", query.numberValue);
        queryString += buildQueryParam("stringValue", query.stringValue);
        queryString += buildQueryParam("sort", query.sortOrder)
        queryString += buildQueryParam("patientID", query.patientID);
        queryString += buildQueryParam("limit", query.limit);
        console.log(queryString);
        response = await Axios.get(queryString);
    } catch (e) {
        console.error(e);
        return response;
    }

    return response.data;
}

async function sendESQuery(query) {
    console.log("QUERYING!", query)
    let response = {};
    try {
        var body = JSON.stringify({queries:query})
        console.log("BODY",body)
        response = await Axios.put(`/api/query/test/`, body);
    } catch (e) {
        console.error(e);
        return response;
    }

    return response.data;
}

export const QueryServices = {
    sendQuery,
    sendESQuery,
};
