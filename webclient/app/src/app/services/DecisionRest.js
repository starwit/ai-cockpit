import CrudRest from "./CrudRest";
import axios from "axios";

class DecisionRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/decision");
    }
}
export default DecisionRest;
