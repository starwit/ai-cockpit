import CrudRest from "./CrudRest";
import axios from "axios";

class MitigationActionTypeRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/mitigationactiontype");
    }

    updateList = list => {
        return axios.put(this.baseUrl + "/updateList", list);
    };

    findByTrafficIncidentType(incidentTypeId) {
        return axios.get(this.baseUrl + "/by-incident-type/" + incidentTypeId);
    }
}
export default MitigationActionTypeRest;
