import CrudRest from "./CrudRest";
import axios from "axios";

class DecisionRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/decision");
    }

    findAllOpen() {
        return axios.get(this.baseUrl + "/open");
    }
}
export default DecisionRest;