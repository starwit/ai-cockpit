import CrudRest from "./CrudRest";
import axios from "axios";

class DecisionRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/decision");
    }

    findAllOpen() {
        return axios.get(this.baseUrl + "/open");
    }

    findAllOpenByType(typeName) {
        return axios.get(this.baseUrl + "/open/type/" + typeName);
    }
}
export default DecisionRest;
