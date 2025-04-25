import CrudRest from "./CrudRest";
import axios from "axios";

class DecisionTypeRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/decisiontype");
    }

    updateList = list => {
        return axios.put(this.baseUrl + "/update-list", list);
    };

    findBymoduleId(moduleId) {
        return axios.get(this.baseUrl + "/by-module/" + moduleId);
    }
}
export default DecisionTypeRest;
