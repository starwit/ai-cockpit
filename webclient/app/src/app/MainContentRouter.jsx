import {Container} from "@mui/material";
import React, {useState} from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import CockpitAppBar from "./commons/CockpitAppBar";
import ActionTypeOverview from "./features/config/ActionTypeOverview";
import DecisionTypeOverview from "./features/config/DecisionTypeOverview";
import DecisionOverview from "./features/decision/DecisionOverview";
import ComponentBreakDown from "./features/info/ComponentBreakDown";
import DecisionOverviewMap from "./features/decision/DecisionOverviewMap";
import DecisionHeatmapView from "./features/decision/DecisionHeatmapView";
import CockpitFooter from "./commons/CockpitFooter";

function MainContentRouter() {
    const location = useLocation();
    // Initialize shared filter state
    const [filters, setFilters] = useState({
        selectedStates: [],
        timeFilter: 0,
        startDate: '',
        endDate: ''
    });

    // Check if we're on a map view to determine if we should show filters
    const isMapView = location.pathname === '/decision-map-view' ||
        location.pathname === '/decision-heatmap-view';

    // Handle filter changes from the AppBar
    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <>
            <CockpitAppBar
                showFilters={isMapView}
                onFiltersChange={handleFiltersChange}
            />
            <Container sx={{
                // Adjust padding based on whether filters are shown
                paddingTop: isMapView ? "8em" : "4em"
            }}>
                <Routes>
                    <Route path="/" element={<DecisionOverview />} />
                    <Route
                        path="/decision-map-view"
                        element={<DecisionOverviewMap filters={filters} />}
                    />
                    <Route
                        path="/decision-heatmap-view"
                        element={<DecisionHeatmapView filters={filters} />}
                    />
                    <Route path="/action-type" element={<ActionTypeOverview />} />
                    <Route path="/decision-type" element={<DecisionTypeOverview />} />
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