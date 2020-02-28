/* globals Promise */

import {authHeader, Axios, getApiUrl} from 'Helpers';

async function getPatients(username) {
    const data = ['abc', 'cde', 'fgh']
    return data;
}

export const StudyServices = {
    getPatients,
};