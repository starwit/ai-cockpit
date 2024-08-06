import CrudRest from "./CrudRest";
import axios from "axios";

class TrafficIncidentTypeRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/trafficincidenttype");
    }

    updateList = list => {
        return axios.put(this.baseUrl + "/updateList", list);
    };
}
export default TrafficIncidentTypeRest;
