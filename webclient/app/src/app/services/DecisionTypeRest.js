import CrudRest from "./CrudRest";
import axios from "axios";

class DecisionTypeRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/decisiontype");
    }

    updateList = list => {
        return axios.put(this.baseUrl + "/updateList", list);
    };
}
export default DecisionTypeRest;
