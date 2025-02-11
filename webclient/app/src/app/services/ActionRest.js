import CrudRest from "./CrudRest";
import axios from "axios";

class ActionRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/action");
    }

    retryActionExecution() {
        return axios.get(this.baseUrl + "/retry-action-execution");
    }

}
export default ActionRest;
