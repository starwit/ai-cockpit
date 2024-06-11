import React from "react";
import {Route, Routes, Link} from "react-router-dom";
import {Container, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import TrafficIncidentOverview from "./features/trafficIncident/TrafficIncidentOverview";
import Level1 from "./features/trafficIncident/mock/Level1";
import Level2 from "./features/trafficIncident/mock/Level2";
import Level3 from "./features/trafficIncident/mock/Level3";

function MainContentRouter() {
    const {t} = useTranslation();

    const linkStyle = {
        margin: "1rem",
        textDecoration: "none",
        color: "black"
    };

    return (
        <>
            <Container sx={{margin: "1em"}} >
                <Link to="/" style={linkStyle}>
                    <Typography variant={"h2"} gutterBottom>
                        {t("home.title")}
                    </Typography>
                    {t("home.welcome")}
                </Link>
            </Container>
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
