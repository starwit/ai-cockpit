import {Container} from "@mui/material";
import React from "react";
import {Route, Routes} from "react-router-dom";
import CockpitAppBar from "./commons/CockpitAppBar";
import ActionTypeOverview from "./features/config/ActionTypeOverview";
import DecisionTypeOverview from "./features/config/DecisionTypeOverview";
import DecisionOverview from "./features/decision/DecisionOverview";
import ComponentBreakDown from "./features/info/ComponentBreakDown";
import DecisionOverviewMap from "./features/decision/DecisionOverviewMap";
import DecisionHeatmapView from "./features/decision/DecisionHeatmapView";
import CockpitFooter from "./commons/CockpitFooter";
import ModuleOverview from "./features/module/ModuleOverview";

function MainContentRouter() {
    return (
        <>
            <CockpitAppBar />
            <Container sx={{paddingTop: "4em", paddingBottom: "4em"}}>
                <Routes>
                    <Route path="/:moduleId?" element={<DecisionOverview />} />
                    <Route path="/module" element={<ModuleOverview />} />
                    <Route path="/decision-map-view" element={<DecisionOverviewMap />} />
                    <Route path="/decision-heatmap-view" element={<DecisionHeatmapView />} />
                    <Route path="/action-type/:moduleId?" element={<ActionTypeOverview />} />
                    <Route path="/decision-type/:moduleId?" element={<DecisionTypeOverview />} />
                    <Route path="/info/component-breakdown" element={<ComponentBreakDown />} />
                    <Route path="/logout" component={() => {
                        window.location.href = window.location.pathname + "api/user/logout";
                        return null;
                    }} />
                </Routes>
            </Container>
            <CockpitFooter />
        </>
    );
}

export default MainContentRouter;
