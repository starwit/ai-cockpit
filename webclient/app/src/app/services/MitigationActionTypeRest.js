import CrudRest from "./CrudRest";

class MitigationActionTypeRest extends CrudRest {
    constructor() {
        super(window.location.pathname + "api/mitigationactiontype");
    }
}
export default MitigationActionTypeRest;
