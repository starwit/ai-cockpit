import React from "react";
import {Route} from "react-router-dom";
import MitigationActionOverview from "./MitigationActionOverview";
import MitigationActionDetail from "./MitigationActionDetail";

function MitigationActionMain() {
    return (
        <>
            <React.Fragment>
                <Route exact path="/mitigationaction" component={MitigationActionOverview}/>
                <Route exact path="/mitigationaction/create" component={MitigationActionDetail}/>
                <Route exact path="/mitigationaction/update/:id" component={MitigationActionDetail}/>
            </React.Fragment>
        </>
    );
}

export default MitigationActionMain;
