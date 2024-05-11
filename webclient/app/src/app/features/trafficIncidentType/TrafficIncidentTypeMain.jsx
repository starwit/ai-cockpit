import React from "react";
import {Route} from "react-router-dom";
import TrafficIncidentTypeOverview from "./TrafficIncidentTypeOverview";
import TrafficIncidentTypeDetail from "./TrafficIncidentTypeDetail";

function TrafficIncidentTypeMain() {
    return (
        <>
            <React.Fragment>
                <Route exact path="/trafficincidenttype" component={TrafficIncidentTypeOverview}/>
                <Route exact path="/trafficincidenttype/create" component={TrafficIncidentTypeDetail}/>
                <Route exact path="/trafficincidenttype/update/:id" component={TrafficIncidentTypeDetail}/>
            </React.Fragment>
        </>
    );
}

export default TrafficIncidentTypeMain;
