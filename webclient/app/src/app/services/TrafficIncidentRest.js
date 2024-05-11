import CrudRest from "./CrudRest";
import axios from "axios";

class TrafficIncidentRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/trafficincident");
    }

    findAllWithoutTrafficIncidentType(selected) {
        if (isNaN(selected)) {
            return axios.get(this.baseUrl + "/find-without-trafficIncidentType");
        } else {
            return axios.get(this.baseUrl + "/find-without-other-trafficIncidentType/" + selected);
        }
    }
}
export default TrafficIncidentRest;
