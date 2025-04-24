import axios from "axios";

class TransparencyFunctions {

    constructor() {
        this.baseUrl = window.location.pathname + "api";
    }

    isReportGenerationEnabled = () => {
        return axios.get(this.baseUrl + '/transparency/reports/enabled');
    }

    getModuleList = () => {
        return axios.get(this.baseUrl + '/aic/modules');
    };

    getModuleDetails = (id) => {
        return axios.get(this.baseUrl + '/aic/modules/' + id);
    };

    loadSBOM = (id, component) => {
        return axios.get(this.baseUrl + '/transparency/modules/sbom/' + id + '/' + component);
    }

}

export default TransparencyFunctions;