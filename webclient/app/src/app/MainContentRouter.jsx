import {Container} from "@mui/material";
import React from "react";
import {Route, Routes} from "react-router-dom";
import CockpitAppBar from "./commons/CockpitAppBar";
import MitigationActionTypeOverview from "./features/config/MitigationActionTypeOverview";
import TrafficIncidentTypeOverview from "./features/config/TrafficIncidentTypeOverview";
import TrafficIncidentOverview from "./features/trafficIncident/TrafficIncidentOverview";
import ComponentBreakDown from "./features/info/ComponentBreakDown";
import Level2 from "./features/trafficIncident/mock/Level2";
import Level3 from "./features/trafficIncident/mock/Level3";

function MainContentRouter() {
    return (
        <>
            <CockpitAppBar />
            <Container sx={{margin: "1em", marginTop: "4em"}} >
                <Routes>
                    <Route path="/" element={<TrafficIncidentOverview />} />
                    <Route path="/1" element={<TrafficIncidentOverview />} />
                    <Route path="/2" element={<Level2 />} />
                    <Route path="/3" element={<Level3 />} />
                    <Route path="/mitigation-action-type" element={<MitigationActionTypeOverview />} />
                    <Route path="/traffic-incident-type" element={<TrafficIncidentTypeOverview />} />
                    <Route path="/info/component-breakdown" element={<ComponentBreakDown />} />
                    <Route path="/logout" component={() => {
                        window.location.href = window.location.pathname + "api/user/logout";
                        return null;
                    }} />
                </Routes>
            </Container>
        </>
    );
}

export default MainContentRouter;
