import {MapView} from '@deck.gl/core';
import {TileLayer} from "@deck.gl/geo-layers";
import React, {useEffect, useState, useMemo} from 'react';
import {
    BitmapLayer,
    ScatterplotLayer,
    TextLayer
} from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import DecisionRest from '../../services/DecisionRest';
import {IconButton} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DecisionDetail from './DecisionDetail';
import DecisionResultPanel from './DecisionResultPanel';
import DecisionTypeFilter from './DecisionTypeFilter';

// Create map view settings - enable map repetition when scrolling horizontally
const MAP_VIEW = new MapView({repeat: true});

// Set initial map position and zoom level
const INITIAL_VIEW_STATE = {
    longitude: -86.13470,     // Initial longitude (X coordinate)
    latitude: 39.91,      // Initial latitude (Y coordinate)
    zoom: 10,            // Initial zoom level
    pitch: 0,           // No tilt
    bearing: 0          // No rotation
};

function DecisionOverviewMap({filters}) {
    // Add state to store decisions
    const [selectedType, setSelectedType] = useState(['all']);
    const [decisions, setDecisions] = useState([]);
    const [hoveredDecisions, setHoveredDecisions] = useState(null);
    const decisionRest = new DecisionRest();
    const [showPanel, setShowPanel] = useState(true);
    const [selectedDecisions, setSelectedDecisions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowData, setRowData] = useState({});
    const [automaticNext, setAutomaticNext] = useState(false);

    // Filter decisions based on selected filters
    const filteredDecisions = useMemo(() => {
        return decisions.filter(decision => {
            // Apply type filter
            const typeMatch = selectedType.includes('all') ||
                (decision.decisionType && selectedType.includes(decision.decisionType.name));
            if (!typeMatch) return false;

            // Apply state filter from global filters
            if (filters.selectedStates.length > 0) {
                const decisionState = decision.state || 'NEW';
                if (!filters.selectedStates.includes(decisionState)) {
                    return false;
                }
            }

            // Apply time range filter from global filters
            if (filters.timeFilter === -1 && filters.startDate && filters.endDate) {
                const start = new Date(filters.startDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(filters.endDate);
                end.setHours(23, 59, 59, 999);
                const decisionTime = new Date(decision.acquisitionTime);
                if (!(decisionTime >= start && decisionTime <= end)) return false;
            } else if (filters.timeFilter > 0) {
                const cutoffTime = new Date();
                cutoffTime.setHours(cutoffTime.getHours() - filters.timeFilter);
                const decisionTime = new Date(decision.acquisitionTime);
                if (!(decisionTime >= cutoffTime)) return false;
            }

            return true;
        });
    }, [decisions, selectedType, filters]);

    // This grouping is necessary to combine multiple decisions that occur at the same location
    const groupedDecisions = useMemo(() => {
        return filteredDecisions.reduce((locationGroups, decision) => {
            if (decision.cameraLatitude && decision.cameraLongitude) {
                const key = `${decision.cameraLatitude}-${decision.cameraLongitude}`;
                if (!locationGroups[key]) {
                    locationGroups[key] = [];
                }
                locationGroups[key].push(decision);
            }
            return locationGroups;
        }, {});
    }, [filteredDecisions]);

    // Filter decisions that have a type => retrieve type names => create Set to remove duplicates => convert Set back to an array
    const decisionTypes = Array.from(
        new Set(
            decisions
                .filter(decision => decision.decisionType?.name)
                .map(decision => decision.decisionType.name)
        )
    );

    useEffect(() => {
        reloadDecisions();
        const interval = setInterval(reloadDecisions, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, []);

    // Load Decisions
    function reloadDecisions() {
        decisionRest.findAll().then(response => {
            if (response.data) {
                setDecisions(response.data);
            }
        });
    }

    function getIconColor(decisionCount) {
        if (decisionCount > 5) {
            return [255, 0, 0, 255]; // Red
        } else if (decisionCount === 5) {
            return [255, 210, 0, 255]; // Yellow
        } else {
            return [0, 128, 0, 255]; // Green - default
        }
    }

    // Define map layers
    const layers = [
        // Creating base map layer using OpenStreetMap theme
        new TileLayer({
            data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            minZoom: 0,     // Minimum zoom level
            maxZoom: 19,    // Maximum zoom level
            tileSize: 256,  // Size of each map tile

            // Function to render each map tile
            renderSubLayers: props => {
                const {
                    bbox: {west, south, east, north}
                } = props.tile;

                // Create image layer for the tile
                return new BitmapLayer(props, {
                    data: null,
                    image: props.data,
                    bounds: [west, south, east, north]
                });
            }
        }),
        // Add layer with Decision Icons
        new ScatterplotLayer({
            id: 'scatterplot-layer',
            data: Object.entries(groupedDecisions),
            pickable: true,     // Enable hover interactions with the icons
            opacity: 0.8,       // 80% opacity for icons
            stroked: true,      // Show border around icons
            filled: true,       // Fill icons with color

            // Size settings for markers
            radiusScale: 15,
            radiusMinPixels: 5,
            radiusMaxPixels: 100,
            lineWidthMinPixels: 1,

            // Function to determine icon position
            getPosition: decision => [
                decision[1][0].cameraLongitude,
                decision[1][0].cameraLatitude
            ],
            getRadius: decision => Math.sqrt(decision[1].length) * 5,
            getFillColor: decision => getIconColor(decision[1].length),
            getLineColor: [0, 0, 0, 255],
            onHover: info => {
                if (info.object) {
                    setHoveredDecisions(info.object[1]);
                }
            },
            onClick: handleOpenDecision
        }),
        // Add text labels showing the number of decisions at each point
        new TextLayer({
            id: 'text-layer',
            data: Object.entries(groupedDecisions),
            pickable: true,
            getPosition: decision => [
                decision[1][0].cameraLongitude,
                decision[1][0].cameraLatitude
            ],
            getText: decision => String(decision[1].length),
            getSize: 16,
            getAngle: 0,
            getTextAnchor: 'middle',
            getAlignmentBaseline: 'center',
            getColor: [255, 255, 255]
        })
    ];

    function handleOpenDecision(pickingInfo) {
        if (pickingInfo.object) {
            setSelectedDecisions(pickingInfo.object[1]);
            setDialogOpen(true);
            setRowData(pickingInfo.object[1][0]);
        }
    }

    function handleNext(data, index) {
        const nextIndex = index + 1;
        if (nextIndex < data.length) {
            setRowData(data[nextIndex]);
        } else {
            setRowData(data[0]);
        }
    }

    function handleBefore(data, index) {
        const nextIndex = index - 1;
        if (nextIndex >= 0) {
            setRowData(data[nextIndex]);
        } else {
            setRowData(data[data.length - 1]);
        }
    }

    function handleClose() {
        setDialogOpen(false);
    }

    function toggleAutomaticNext() {
        setAutomaticNext(!automaticNext);
    }

    function handleSave(actionTypes, decisionType, description, state) {
        const foundDecision = selectedDecisions.find(value => value.id === rowData.id);
        const actionTypeIds = actionTypes.map(actionType => actionType['id']);

        if (foundDecision) {
            foundDecision.decisionType = decisionType;
            foundDecision.description = description;
            foundDecision.state = state;

            decisionRest.updateWithActions(foundDecision, actionTypeIds).then(() => {
                if (automaticNext) {
                    handleNext(selectedDecisions, selectedDecisions.findIndex(value => value.id === rowData.id));
                } else {
                    setDialogOpen(false);
                }
            });
        } else {
            setDialogOpen(false);
        }
    }

    function renderDialog() {
        if (!dialogOpen) {
            return null;
        }
        return (
            <DecisionDetail
                open={dialogOpen}
                handleClose={handleClose}
                handleSave={handleSave}
                handleNext={handleNext}
                handleBefore={handleBefore}
                rowData={rowData}
                automaticNext={automaticNext}
                toggleAutomaticNext={toggleAutomaticNext}
                data={selectedDecisions}
                showMap={false}
            />
        );
    }

    return (
        <>
            <DecisionTypeFilter
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                decisionTypes={decisionTypes}
            />
            <DeckGL
                layers={layers}
                views={MAP_VIEW}
                initialViewState={INITIAL_VIEW_STATE}
                controller={{dragRotate: false}}
            />

            <IconButton
                onClick={() => setShowPanel(!showPanel)}
                sx={{
                    bgcolor: 'white',
                    position: 'fixed',
                    right: showPanel ? 330 : 10,
                }}
                size="small"
            >
                {showPanel ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>

            <DecisionResultPanel
                show={showPanel}
                decisions={hoveredDecisions}
            />
            {renderDialog()}
        </>
    );
}

export default DecisionOverviewMap;