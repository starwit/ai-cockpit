import CrudRest from "./CrudRest";
import axios from "axios";

class ModuleRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/module");
    }

    getWithDecisions = () => {
        return axios.get(this.baseUrl + "/withdecisioncount");
    };
}

export default ModuleRest;