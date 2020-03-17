///* globals Promise */

//import {authHeader, Axios, getApiUrl} from 'Helpers';
import { reduceResults, getAnswers } from 'Helpers'

async function getPatientList(username) {
    const patients = [{id:0, name:'John Doe'}, {id: 1, name:'Jane Doe'}]
    console.log('Getting patients for user ', username)
    return patients
}

function initStudy(form, rawResults, reduction, predicates) {
    // How many nodules?
    var results = reduceResults(form, rawResults, reduction)
    // Sort by date
    results = results.sort((a, b) => {
        //return b.createdAt.localeCompare(a.createdAt)//
        return new Date(b.date) - new Date(a.date)
    }) 

    var answers = getAnswers(results, predicates)

    console.log("RESULTS!", results)
    console.log("ANSWERS", answers)
    return {
    	results:results,
    	answers:answers,
    }
}

export const StudyServices = {
    getPatientList,
    initStudy,
}