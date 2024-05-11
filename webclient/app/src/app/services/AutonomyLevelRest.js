import CrudRest from "./CrudRest";

class AutonomyLevelRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/autonomylevel");
    }
}
export default AutonomyLevelRest;
