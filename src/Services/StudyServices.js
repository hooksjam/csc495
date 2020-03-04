///* globals Promise */

//import {authHeader, Axios, getApiUrl} from 'Helpers';

async function getPatients(username) {
    const data = [{id:0, name:'John Doe'}, {id: 1, name:'Jane Doe'}]
    console.log('Getting patients for user ', username)
    return data;
}

export const StudyServices = {
    getPatients,
};