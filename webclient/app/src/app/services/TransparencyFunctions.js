import axios from "axios";

class TransparencyFunctions {

    constructor() {
        this.baseUrl = window.location.pathname + "api/transparency";
    }

    getModuleList = () => {
        return axios.get(this.baseUrl + '/modules');
    };

    getModuleDetails = (id) => {
        return axios.get(this.baseUrl + '/modules/' + id);
    };

    loadSBOM = (url) => {
        return axios.get(url);
    }

}

export default TransparencyFunctions;