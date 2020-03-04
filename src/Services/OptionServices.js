import { Axios } from 'Helpers';

async function clear() {
    let response = {};
    response = await Axios.get(`/api/dummy/clear`)

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
};
