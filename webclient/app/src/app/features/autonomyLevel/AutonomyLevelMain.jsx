import React from "react";
import {Route} from "react-router-dom";
import AutonomyLevelOverview from "./AutonomyLevelOverview";
import AutonomyLevelDetail from "./AutonomyLevelDetail";

function AutonomyLevelMain() {
    return (
        <>
            <React.Fragment>
                <Route exact path="/autonomylevel" component={AutonomyLevelOverview}/>
                <Route exact path="/autonomylevel/create" component={AutonomyLevelDetail}/>
                <Route exact path="/autonomylevel/update/:id" component={AutonomyLevelDetail}/>
            </React.Fragment>
        </>
    );
}

export default AutonomyLevelMain;
