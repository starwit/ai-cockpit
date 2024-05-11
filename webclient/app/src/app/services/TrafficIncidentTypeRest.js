import CrudRest from "./CrudRest";

class TrafficIncidentTypeRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/trafficincidenttype");
    }
}
export default TrafficIncidentTypeRest;
