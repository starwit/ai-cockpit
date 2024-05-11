import CrudRest from "./CrudRest";
import axios from "axios";

class MitigationActionRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/mitigationaction");
    }

    findAllWithoutTrafficIncident(selected) {
        if (isNaN(selected)) {
            return axios.get(this.baseUrl + "/find-without-trafficIncident");
        } else {
            return axios.get(this.baseUrl + "/find-without-other-trafficIncident/" + selected);
        }
    }

    findAllWithoutMitigationActionType(selected) {
        if (isNaN(selected)) {
            return axios.get(this.baseUrl + "/find-without-mitigationActionType");
        } else {
            return axios.get(this.baseUrl + "/find-without-other-mitigationActionType/" + selected);
        }
    }
}
export default MitigationActionRest;
