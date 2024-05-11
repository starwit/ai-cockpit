import React from "react";
import {Route, Switch} from "react-router-dom";
import TrafficIncidentMain from "./features/trafficIncident/TrafficIncidentMain";
import MitigationActionMain from "./features/mitigationAction/MitigationActionMain";
import AutonomyLevelMain from "./features/autonomyLevel/AutonomyLevelMain";
import TrafficIncidentTypeMain from "./features/trafficIncidentType/TrafficIncidentTypeMain";
import MitigationActionTypeMain from "./features/mitigationActionType/MitigationActionTypeMain";
import Home from "./features/home/Home";

function MainContentRouter() {
    return (
        <>
            <Switch>
                <Route path={"/trafficincident"} component={TrafficIncidentMain}/>
                <Route path={"/mitigationaction"} component={MitigationActionMain}/>
                <Route path={"/autonomylevel"} component={AutonomyLevelMain}/>
                <Route path={"/trafficincidenttype"} component={TrafficIncidentTypeMain}/>
                <Route path={"/mitigationactiontype"} component={MitigationActionTypeMain}/>
            </Switch>
            <Route exact path={"/"} component={Home}/>
            <Route path="/logout" component={() => {
                window.location.href = window.location.pathname + "api/user/logout";
                return null;
            }}/>
        </>
    );
}

export default MainContentRouter;
