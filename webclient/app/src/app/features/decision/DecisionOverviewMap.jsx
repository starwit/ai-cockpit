import React, {useState, useEffect} from 'react';
import {MapView} from '@deck.gl/core';
import {TileLayer} from "@deck.gl/geo-layers";

import {
    BitmapLayer,
    TextLayer,
    ScatterplotLayer
} from "@deck.gl/layers";

import DeckGL from "@deck.gl/react";
import DecisionRest from '../../services/DecisionRest';
import {useTranslation} from 'react-i18next';

import {IconButton} from '@mui/material';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DecisionResultPanel from './DecisionResultPanel';
import DecisionDetail from './DecisionDetail';

import DecisionTypeFilter from './DecisionTypeFilter';

// Create map view settings - enable map repetition when scrolling horizontally
const MAP_VIEW = new MapView({repeat: true});

function DecisionOverviewMap() {
    // Add state to store decisions
    const {t, i18n} = useTranslation();
    const [selectedType, setSelectedType] = useState(['all']);
    const [decisions, setDecisions] = useState([]);
    const [hoveredDecisions, setHoveredDecisions] = useState(null); // To track a hover
    const decisionRest = new DecisionRest();
    const [showPanel, setShowPanel] = useState(true);
    const [selectedDecisions, setSelectedDecisions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowData, setRowData] = React.useState({});
    const [automaticNext, setAutomaticNext] = React.useState(false);

    const groupedDecisions = groupDecisionsByLocation();

    const layers = [
        createBaseMapLayer(),
        createDecisionPointsLayer(groupedDecisions),
        createTextLayer(groupedDecisions)

    ];

    // Set initial map position and zoom level
    const INITIAL_VIEW_STATE = {
        longitude: -86.13470,     // Initial longitude (X coordinate)
        latitude: 39.91,      // Initial latitude (Y coordinate)
        zoom: 10,            // Initial zoom level
        pitch: 0,           // No tilt
        bearing: 0          // No rotation
    };

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
        const interval = setInterval(reloadDecisions, 5000); // Update alle 5 Sekunden
        return () => clearInterval(interval);
    }, []);

    //Load Decisions
    function reloadDecisions() {
        decisionRest.findAllOpen().then(response => {
            if (response.data) {
                setDecisions(response.data);
            }
        });
    }
    // This grouping is necessary to combine multiple decisions that occur at the same location (same coordinates)
    function groupDecisionsByLocation() {
        return decisions
            .filter(decision => decision && (
                selectedType.includes('all') ||
                (decision.decisionType && selectedType.includes(decision.decisionType.name))
            ))
            .reduce((acc, decision) => {
                if (decision.cameraLatitude && decision.cameraLongitude) {
                    const key = `${decision.cameraLatitude}-${decision.cameraLongitude}`;   // Create a unique key using the camera coordinates. For example: "39.78-86.15"
                    if (!acc[key]) {    // If this is the first decision at these coordinates, initialize an empty array for this location
                        acc[key] = [];
                    }
                    acc[key].push(decision);    // Add the current decision to the array for this location
                }
                return acc;
            }, {});
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

    /////////////////////////////////////////////////////////////////////////////

    // Define map layers
    function createBaseMapLayer() {
        // Creating base map layer using CartoDB light theme
        return new TileLayer({
            // URL for map tiles
            data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            minZoom: 0,     // Minimum zoom level
            maxZoom: 19,    // Maximum zoom level
            tileSize: 256,  // Size of each map tile

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
        })
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
            radiusScale: 15,
            radiusMinPixels: 5,
            radiusMaxPixels: 100,
            lineWidthMinPixels: 1,

            // Function to determine icon position
            // d[1][0] contains the first decision in the group (all have same coordinates)
            getPosition: decision => [
                decision[1][0].cameraLongitude,
                decision[1][0].cameraLatitude
            ],
            getRadius: decision => Math.sqrt(decision[1].length) * 5,
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
        })
    }

    function handleOpenDecision(pickingInfo) {
        if (pickingInfo.object) {
            setSelectedDecisions(pickingInfo.object[1]);
            setDialogOpen(true);
            setRowData(pickingInfo.object[1][0]);
        }
    }

    function createTextLayer() {
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
        })

    }
    /////////////////////////////////////////////////////////////////////////////

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
    };

    function toggleAutomaticNext() {
        setAutomaticNext(!automaticNext);
    }

    function handleSave(actionTypes, decisionType, description, state) {
        const foundDecision = selectedDecisions.find(value => value.id == rowData.id);
        if (foundDecision) {
            foundDecision.decisionType = decisionType;
            foundDecision.description = description;
            foundDecision.state = state;
            const remoteFunctions = [];

            const newActions = actionTypes;

            let newActionTypes = actionTypes;
            rowData.action.forEach(action => {
                const found = actionTypes.find(value => value.id == action.actionType.id);
                if (found === undefined) {
                    remoteFunctions.push(actionRest.delete(action.id));
                } else {
                    newActionTypes = newActionTypes.filter(value => value.id !== action.actionType.id);
                    newActions.push(action);
                }
            });

            newActionTypes.forEach(mActiontype => {
                const entity = {
                    name: "",
                    description: "",
                    decision: {id: rowData.id},
                    actionType: mActiontype
                };
                remoteFunctions.push(actionRest.create(entity));
            });

            decisionRest.update(foundDecision).then(response => {
                Promise.all(remoteFunctions).then(() => {
                    if (automaticNext) {
                        handleNext(selectedDecisions, selectedDecisions.findIndex(value => value.id == rowData.id));
                    } else {
                        setDialogOpen(false);
                    }
                });
            });
        } else {
            setDialogOpen(false);
        }
    };

    // Return the map component with minimum required styles
    return (
        <>
            <DecisionTypeFilter
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                decisionTypes={decisionTypes}
            />
            <DeckGL
                layers={layers}               // Add map layers
                views={MAP_VIEW}              // Add map view settings
                initialViewState={INITIAL_VIEW_STATE}  // Set initial position
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
            <DecisionResultPanel show={showPanel} decisions={hoveredDecisions} />
            {renderDialog()}
        </>
    );
}

export default DecisionOverviewMap;