import axios from "axios";

class TransparencyFunctions {

    constructor() {
        this.baseUrl = window.location.pathname + "api/transparency";
    }

    aicockpitSbomFrontend = () => {
        return axios.get(this.baseUrl + '/sbom-frontend.json');
    };

    aicockpitSbomBackend = () => {
        return axios.get(this.baseUrl + '/sbom-backend.json');
    };

    getComponentList = () => {
        let testurl = window.location.pathname + '/transparencyModuleData.json';
        //return axios.get(this.baseUrl + '/aicmodules');
        return axios.get(testurl);
    };

    getComponentList = () => {
        let testurl = window.location.pathname + '/transparencyModuleData.json';
        //return axios.get(this.baseUrl + '/aicmodules');
        return axios.get(testurl);
    };

}

export default TransparencyFunctions;