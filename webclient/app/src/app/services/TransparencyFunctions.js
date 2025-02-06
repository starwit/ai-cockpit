import axios from "axios";

class TransparencyFunctions {

    constructor() {
        this.baseUrl = window.location.pathname + "api/transparency";
    }

    isReportGenerationEnabled = () => {
        return axios.get(this.baseUrl + '/reports/enabled');
    }

    getModuleList = () => {
        return axios.get(this.baseUrl + '/modules');
    };

    getModuleDetails = (id) => {
        return axios.get(this.baseUrl + '/modules/' + id);
    };

    loadSBOM = (id, component) => {
        return axios.get(this.baseUrl + '/modules/sbom/' + id + '/' + component);
    }

}

export default TransparencyFunctions;