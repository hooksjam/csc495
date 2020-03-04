///* globals Promise */

//import {authHeader, Axios, getApiUrl} from 'Helpers';

async function getPatientList(username) {
    const patients = [{id:0, name:'John Doe'}, {id: 1, name:'Jane Doe'}]
    console.log('Getting patients for user ', username)
    return patients
}

export const StudyServices = {
    getPatientList,
};