import HomeIcon from "@mui/icons-material/Home";
import {AppBar, Container, IconButton, Toolbar, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {Route, Routes} from "react-router-dom";
import TrafficIncidentOverview from "./features/trafficIncident/TrafficIncidentOverview";
import Level1 from "./features/trafficIncident/mock/Level1";
import Level2 from "./features/trafficIncident/mock/Level2";
import Level3 from "./features/trafficIncident/mock/Level3";
import CockpitAppBar from "./commons/CockpitAppBar";

function MainContentRouter() {
    const {t} = useTranslation();

    const linkStyle = {
        margin: "1rem",
        textDecoration: "none",
        color: "black"
    };

    return (
        <>
            <CockpitAppBar />
            <Routes>
                <Route path="/" element={<TrafficIncidentOverview />} />
                <Route path="/1" element={<Level1 />} />
                <Route path="/2" element={<Level2 />} />
                <Route path="/3" element={<Level3 />} />
                <Route path="/logout" component={() => {
                    window.location.href = window.location.pathname + "api/user/logout";
                    return null;
                }} />
            </Routes>
        </>
    );
}

export default MainContentRouter;
