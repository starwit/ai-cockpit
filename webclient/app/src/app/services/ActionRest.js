import CrudRest from "./CrudRest";
import axios from "axios";

class ActionRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/action");
    }
}
export default ActionRest;
