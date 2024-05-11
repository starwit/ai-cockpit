import React from "react";
import {Route} from "react-router-dom";
import MitigationActionTypeOverview from "./MitigationActionTypeOverview";
import MitigationActionTypeDetail from "./MitigationActionTypeDetail";

function MitigationActionTypeMain() {
    return (
        <>
            <React.Fragment>
                <Route exact path="/mitigationactiontype" component={MitigationActionTypeOverview}/>
                <Route exact path="/mitigationactiontype/create" component={MitigationActionTypeDetail}/>
                <Route exact path="/mitigationactiontype/update/:id" component={MitigationActionTypeDetail}/>
            </React.Fragment>
        </>
    );
}

export default MitigationActionTypeMain;
