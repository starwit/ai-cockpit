import CrudRest from "./CrudRest";
import axios from "axios";

class ActionRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/action");
    }

    findAllWithoutDecision(selected) {
        if (isNaN(selected)) {
            return axios.get(this.baseUrl + "/find-without-decision");
        } else {
            return axios.get(this.baseUrl + "/find-without-other-decision/" + selected);
        }
    }

    findAllWithoutActionType(selected) {
        if (isNaN(selected)) {
            return axios.get(this.baseUrl + "/find-without-actionType");
        } else {
            return axios.get(this.baseUrl + "/find-without-other-actionType/" + selected);
        }
    }
}
export default ActionRest;
