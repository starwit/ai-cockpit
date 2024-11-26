import CrudRest from "./CrudRest";
import axios from "axios";

class ActionTypeRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/actiontype");
    }

    updateList = list => {
        return axios.put(this.baseUrl + "/updateList", list);
    };

    findByDecisionType(decisionTypeId) {
        return axios.get(this.baseUrl + "/by-decision-type/" + decisionTypeId);
    }
}
export default ActionTypeRest;
