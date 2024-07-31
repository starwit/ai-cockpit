import React from "react";
import {useTranslation} from "react-i18next";
import {Route, Routes} from "react-router-dom";
import TrafficIncidentOverview from "./features/trafficIncident/TrafficIncidentOverview";
import Level2 from "./features/trafficIncident/mock/Level2";
import Level3 from "./features/trafficIncident/mock/Level3";
import MitigationActionTypeOverview from "./features/config/MitigationActionTypeOverview";
import TrafficIncidentTypeOverview from "./features/config/TrafficIncidentTypeOverview";
import CockpitAppBar from "./commons/CockpitAppBar";

function MainContentRouter() {
    const {t} = useTranslation();

    return (
        <>
            <CockpitAppBar />
            <Routes>
                <Route path="/" element={<TrafficIncidentOverview />} />
                <Route path="/1" element={<TrafficIncidentOverview />} />
                <Route path="/2" element={<Level2 />} />
                <Route path="/3" element={<Level3 />} />
                <Route path="/mitigation-action-type" element={<MitigationActionTypeOverview />} />
                <Route path="/traffic-incident-type" element={<TrafficIncidentTypeOverview />} />
                <Route path="/logout" component={() => {
                    window.location.href = window.location.pathname + "api/user/logout";
                    return null;
                }} />
            </Routes>
        </>
    );
}

export default MainContentRouter;
