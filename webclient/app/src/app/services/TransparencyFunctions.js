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

    getModuleList = () => {
        return axios.get(this.baseUrl + '/modules');
    };

    getModuleDetails = (id) => {
        return axios.get(this.baseUrl + '/modules/' + id);
    };

}

export default TransparencyFunctions;