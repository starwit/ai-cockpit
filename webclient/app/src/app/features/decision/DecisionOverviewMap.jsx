import {MapView} from '@deck.gl/core';
import {TileLayer} from "@deck.gl/geo-layers";
import React, {useEffect, useState, useRef, useMemo} from 'react';
import {BitmapLayer, ScatterplotLayer, TextLayer} from "@deck.gl/layers";
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

// Initial map state (will be used only if there's no data)
const INITIAL_VIEW_STATE = {
    longitude: -86.13470,     // Initial longitude (X coordinate)
    latitude: 39.91,      // Initial latitude (Y coordinate)
    zoom: 10,            // Initial zoom level
    pitch: 0,           // No tilt
    bearing: 0          // No rotation
};

function DecisionOverviewMap() {
    // Add state to store decisions
    const [selectedType, setSelectedType] = useState(['all']);
    const [decisions, setDecisions] = useState([]);
    const [hoveredDecisions, setHoveredDecisions] = useState(null); // To track a hover
    const decisionRest = new DecisionRest();
    const [showPanel, setShowPanel] = useState(true);
    const [selectedDecisions, setSelectedDecisions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowData, setRowData] = React.useState({});
    const [automaticNext, setAutomaticNext] = React.useState(false);

    // State for viewState and DeckGL ref
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const deckRef = useRef(null);
    const isFirstLoad = useRef(true);

    // This grouping is necessary to combine multiple decisions that occur at the same location (same coordinates)
    const groupedDecisions = useMemo(() => {
        return decisions
            .filter(decision => decision && (
                selectedType.includes('all') ||
                (decision.decisionType && selectedType.includes(decision.decisionType.name))
            ))
            .reduce((locationGroups, decision) => {
                if (decision.cameraLatitude && decision.cameraLongitude) {
                    // Group by coordinates rounded to 4 decimal places
                    const lat = parseFloat(decision.cameraLatitude).toFixed(4);
                    const lng = parseFloat(decision.cameraLongitude).toFixed(4);
                    const key = `${lat}-${lng}`;
                    if (!locationGroups[key]) {
                        locationGroups[key] = [];
                    }
                    locationGroups[key].push(decision);
                }
                return locationGroups;
            }, {});
    }, [decisions, selectedType]);

    // Filter decisions that have a type => retrieve type names => create Set to remove duplicates => convert Set back to an array
    const decisionTypes = useMemo(() => {
        return Array.from(
            new Set(
                decisions
                    .filter(decision => decision.decisionType?.name)
                    .map(decision => decision.decisionType.name)
            )
        );
    }, [decisions]);

    // Function to calculate bounds based on marker coordinates
    function calculateBounds(groupedDecisions) {
        if (!groupedDecisions || Object.keys(groupedDecisions).length === 0) {
            return null;
        }

        let minLng = Infinity;
        let maxLng = -Infinity;
        let minLat = Infinity;
        let maxLat = -Infinity;

        // Process all grouped decisions
        Object.values(groupedDecisions).forEach(decisions => {
            if (decisions.length > 0) {
                const decision = decisions[0]; // Take first decision from group (all in group have same coordinates)
                if (decision.cameraLatitude && decision.cameraLongitude) {
                    minLng = Math.min(minLng, decision.cameraLongitude);
                    maxLng = Math.max(maxLng, decision.cameraLongitude);
                    minLat = Math.min(minLat, decision.cameraLatitude);
                    maxLat = Math.max(maxLat, decision.cameraLatitude);
                }
            }
        });

        // If no valid coordinates found
        if (minLng === Infinity || minLat === Infinity) {
            return null;
        }

        // Add padding around edges
        const padding = 0.1; // ~10% padding
        const lngDiff = maxLng - minLng;
        const latDiff = maxLat - minLat;

        return {
            west: minLng - lngDiff * padding,
            east: maxLng + lngDiff * padding,
            south: minLat - latDiff * padding,
            north: maxLat + latDiff * padding
        };
    }

    // Function to convert bounds to viewState
    function boundsToViewState(bounds) {
        if (!bounds) {
            return INITIAL_VIEW_STATE;
        }

        const {west, east, south, north} = bounds;

        // Calculate map center
        const longitude = (west + east) / 2;
        const latitude = (south + north) / 2;

        // Calculate approximate zoom based on area size
        const lngDiff = east - west;
        const latDiff = north - south;
        const maxDiff = Math.max(lngDiff, latDiff);

        // Formula for approximate zoom calculation
        const zoom = Math.floor(Math.log2(360 / maxDiff)) - 0.1;

        return {
            longitude,
            latitude,
            zoom: Math.min(Math.max(zoom, 3), 18), // Limit zoom between 3 and 18
            pitch: 0,
            bearing: 0
        };
    }

    // Effect to update viewState when grouped data changes
    useEffect(() => {
        if (Object.keys(groupedDecisions).length > 0 && isFirstLoad.current) {
            const bounds = calculateBounds(groupedDecisions);
            const newViewState = boundsToViewState(bounds);
            setViewState(newViewState);
            isFirstLoad.current = false;
        }
    }, [groupedDecisions]);

    const layers = useMemo(() => [
        createBaseMapLayer(),
        createDecisionPointsLayer(groupedDecisions),
        createTextLayer(groupedDecisions)
    ], [groupedDecisions]);

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
            return [255, 210, 0, 255] // Yellow 
        } else {
            return [0, 128, 0, 255] // Green - default
        }
    }

    // Define map layers
    function createBaseMapLayer() {
        // Creating base map layer using CartoDB light theme
        return new TileLayer({
            // URL for map tiles
            data: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
            minZoom: 0,     // Minimum zoom level
            maxZoom: 19,    // Maximum zoom level
            tileSize: 256,  // Size of each map tile
            loadOptions: {
                mode: 'cors',
                credentials: 'same-origin',
            },

            // Function to render each map tile
            renderSubLayers: props => {
                // Get geographical boundaries of the current tile
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
        });
    }

    function createDecisionPointsLayer(groupedDecisions) {
        // Add layer with Decision Icons
        return new ScatterplotLayer({
            id: 'scatterplot-layer',
            data: Object.entries(groupedDecisions),     // Using Object.entries to convert the grouped object to array of [key, value] pairs.

            pickable: true,     // Enable hover interactions with the icons
            opacity: 0.8,       // 80% opacity for icons
            stroked: true,      // Show border around icons
            filled: true,       // Fill icons with color

            // Size settings for markers
            radiusScale: 10, // Reduced scale
            radiusMinPixels: 5,
            radiusMaxPixels: 30, // Maximum size
            lineWidthMinPixels: 1,

            // Function to determine icon position
            // d[1][0] contains the first decision in the group (all have same coordinates)
            getPosition: decision => [
                decision[1][0].cameraLongitude,
                decision[1][0].cameraLatitude
            ],
            // Smooth radius increase with a limit
            getRadius: decision => Math.min(Math.sqrt(decision[1].length) * 4, 30),
            getFillColor: decision => getIconColor(decision[1].length),
            getLineColor: [0, 0, 0, 255],
            onHover: info => {
                if (info.object) {      // Check whether the user has actually pointed the cursor at an object (marker) on the map.
                    setHoveredDecisions(info.object[1]);
                }
            },
            onClick: pickingInfo => {
                handleOpenDecision(pickingInfo)
            }
        });
    }

    function handleOpenDecision(pickingInfo) {
        if (pickingInfo.object) {
            setSelectedDecisions(pickingInfo.object[1]);
            setDialogOpen(true);
            setRowData(pickingInfo.object[1][0]);
        }
    }

    function createTextLayer(groupedDecisions) {
        return new TextLayer({
            id: 'text-layer',
            data: Object.entries(groupedDecisions),      // Using Object.entries to convert the grouped object to array of [key, value] pairs.
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
        });
    }

    function renderDialog() {
        if (!dialogOpen) {
            return null;
        }
        return <DecisionDetail
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
        />;
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
        const foundDecision = selectedDecisions.find(value => value.id == rowData.id);
        const actionTypeIds = actionTypes.map(actionType => actionType['id'])
        if (foundDecision) {
            foundDecision.decisionType = decisionType;
            foundDecision.description = description;
            foundDecision.state = state;

            decisionRest.updateWithActions(foundDecision, actionTypeIds).then(response => {
                if (automaticNext) {
                    handleNext(selectedDecisions, selectedDecisions.findIndex(value => value.id == rowData.id));
                } else {
                    setDialogOpen(false);
                }
            });
        } else {
            setDialogOpen(false);
        }
    }

    // Return the map component with minimum required styles
    return (
        <div className="map-container">
            <DecisionTypeFilter
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                decisionTypes={decisionTypes}
            />
            <DeckGL
                ref={deckRef}
                layers={layers}               // Add map layers
                views={MAP_VIEW}              // Add map view settings
                initialViewState={viewState}  // Set initial position
                controller={{dragRotate: false}}       // Disable rotation
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
        </div>
    );
}

export default DecisionOverviewMap;