import CrudRest from "./CrudRest";
import axios from "axios";

class DecisionRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/decision");
    }

    updateWithActions(decision, actionTypeIds) {
        const toBeSaved = {
            "decision": decision,
            "actionTypeIds": actionTypeIds
        }
        return axios.put(this.baseUrl + "/update-with-actions", toBeSaved);
    }

    findAllOpen() {
        return axios.get(this.baseUrl + "/open");
    }

    findAllOpenPaged(page, pageSize) {
        return axios.get(this.baseUrl + `/openstate-paged?page=${page}&size=${pageSize}`);
    }

    findAllClosedPaged(page, pageSize) {
        return axios.get(this.baseUrl + `/closedstate-paged?page=${page}&size=${pageSize}`);
    }
}
export default DecisionRest;
