import CrudRest from "./CrudRest";
import axios from "axios";

class DecisionRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/decision");
    }

    findAllWithoutDecisionType(selected) {
        if (isNaN(selected)) {
            return axios.get(this.baseUrl + "/find-without-decisionType");
        } else {
            return axios.get(this.baseUrl + "/find-without-other-decisionType/" + selected);
        }
    }
}
export default DecisionRest;
