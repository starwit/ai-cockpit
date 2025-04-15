import axios from "axios";

class AutomationRest {
    constructor() {
        this.baseUrl = window.location.pathname + "api/automation";
    }

    update = automation => {
        return axios.put(this.baseUrl + "/" + automation);
    };

    find = () => {
        return axios.get(this.baseUrl);
    };

}
export default AutomationRest;
