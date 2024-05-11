import React from "react";
import {Route} from "react-router-dom";
import TrafficIncidentOverview from "./TrafficIncidentOverview";
import TrafficIncidentDetail from "./TrafficIncidentDetail";

function TrafficIncidentMain() {
    return (
        <>
            <React.Fragment>
                <Route exact path="/trafficincident" component={TrafficIncidentOverview}/>
                <Route exact path="/trafficincident/create" component={TrafficIncidentDetail}/>
                <Route exact path="/trafficincident/update/:id" component={TrafficIncidentDetail}/>
            </React.Fragment>
        </>
    );
}

export default TrafficIncidentMain;
