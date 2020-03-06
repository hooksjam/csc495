import { Axios } from 'Helpers'

async function clear(prefix='') {
    let response = {};
    var clearString = (prefix!=''?`${prefix}/clear`:'clear')
    response = await Axios.get(`/api/dummy/${clearString}`)

    return response.data;
}

async function reloadForms() {
    let response = {};
    response = await Axios.get(`/api/dummy/forms`)

    return response.data;
}

export const OptionServices = {
    clear,
    reloadForms,
}
