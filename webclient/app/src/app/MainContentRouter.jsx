import {Container} from "@mui/material";
import React from "react";
import {Route, Routes} from "react-router-dom";
import CockpitAppBar from "./commons/CockpitAppBar";
import ActionTypeOverview from "./features/config/ActionTypeOverview";
import DecisionTypeOverview from "./features/config/DecisionTypeOverview";
import DecisionOverview from "./features/decision/DecisionOverview";
import ComponentBreakDown from "./features/info/ComponentBreakDown";
import DecisionOverviewMap from "./features/decision/DecisionOverviewMap";

function MainContentRouter() {
    return (
        <>
            <CockpitAppBar />
            <Container sx={{paddingTop: "4em"}}>
                <Routes>
                    <Route path="/" element={<DecisionOverview />} />
                    <Route path="/decision-map-view" element={<DecisionOverviewMap />} />
                    <Route path="/action-type" element={<ActionTypeOverview />} />
                    <Route path="/decision-type" element={<DecisionTypeOverview />} />
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
