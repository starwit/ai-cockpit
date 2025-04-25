import CrudRest from "./CrudRest";
import axios from "axios";

class ActionTypeRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/actiontype");
    }

    updateList = list => {
        return axios.put(this.baseUrl + "/update-list", list);
    };

    findByDecisionType(decisionTypeId) {
        return axios.get(this.baseUrl + "/by-decision-type/" + decisionTypeId);
    }

    findBymoduleId(moduleId) {
        return axios.get(this.baseUrl + "/by-module/" + moduleId);
    }
}
export default ActionTypeRest;
