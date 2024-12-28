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

import {
    Paper,
    Typography,
    Box,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

import {ThemeProvider, createTheme} from '@mui/material/styles';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {formatDateShort} from '../../commons/formatter/DateFormatter';

// Create map view settings - enable map repetition when scrolling horizontally
const MAP_VIEW = new MapView({repeat: true});

function DecisionOverviewMap() {
    // Add state to store decisions
    const {t, i18n} = useTranslation();
    const [selectedType, setSelectedType] = useState('all');
    const [decisions, setDecisions] = useState([]);
    const [hoveredDecisions, setHoveredDecisions] = useState(null); // To track a hover
    const decisionRest = new DecisionRest();
    const [showPanel, setShowPanel] = useState(true);

    useEffect(() => {
        reloadDecisions();
        const interval = setInterval(reloadDecisions, 5000); // Update alle 5 Sekunden
        return () => clearInterval(interval);
    }, [selectedType]);

    //Load Decisions
    function reloadDecisions() {
        if (selectedType === 'all') {
            decisionRest.findAllOpen().then(response => {
                if (response.data) {
                    setDecisions(response.data);
                }
            });
        } else {
            decisionRest.findAllOpenByType(selectedType).then(response => {
                if (response.data) {
                    setDecisions(response.data);
                }
            })
        }
    }

    // This grouping is necessary to combine multiple decisions that occur at the same location (same coordinates)
    function groupDecisionsByLocation() {
        return decisions.reduce((acc, decision) => {
            const key = `${decision.cameraLatitude}-${decision.cameraLongitude}`;   // Create a unique key using the camera coordinates. For example: "39.78-86.15"
            if (!acc[key]) {    // If this is the first decision at these coordinates, initialize an empty array for this location
                acc[key] = [];
            }
            acc[key].push(decision);    // Add the current decision to the array for this location
            return acc;
        }, {});
    }

    // Set initial map position and zoom level
    const INITIAL_VIEW_STATE = {
        longitude: -86.13470,     // Initial longitude (X coordinate)
        latitude: 39.91,      // Initial latitude (Y coordinate)
        zoom: 10,            // Initial zoom level
        pitch: 0,           // No tilt
        bearing: 0          // No rotation
    };

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
            getPosition: d => [
                d[1][0].cameraLongitude,
                d[1][0].cameraLatitude
            ],
            getRadius: d => Math.sqrt(d[1].length) * 5,
            getFillColor: d => getIconColor(d[1].length),
            getLineColor: [0, 0, 0, 255],
            onHover: info => {
                if (info.object) {      // Check whether the user has actually pointed the cursor at an object (marker) on the map.
                    setHoveredDecisions(info.object[1]);
                }
            }
        })
    }

    function createTextLayer() {
        return new TextLayer({
            id: 'text-layer',
            data: Object.entries(groupedDecisions),      // Using Object.entries to convert the grouped object to array of [key, value] pairs.
            pickable: true,
            getPosition: d => [
                d[1][0].cameraLongitude,
                d[1][0].cameraLatitude
            ],
            getText: d => String(d[1].length),
            getSize: 16,
            getAngle: 0,
            getTextAnchor: 'middle',
            getAlignmentBaseline: 'center',
            getColor: [255, 255, 255]
        })

    }
    /////////////////////////////////////////////////////////////////////////////

    const groupedDecisions = groupDecisionsByLocation();

    //Filter decisions that have a type => retrieve type names => create Set to remove duplicates => convert Set back to an array
    const decisionTypes = Array.from(new Set(decisions
        .filter(d => d.decisionType?.name)
        .map(d => d.decisionType.name)
    ));

    const layers = [
        createBaseMapLayer(),
        createDecisionPointsLayer(groupedDecisions),
        createTextLayer(groupedDecisions)

    ];


    ////////////////////////////////////////////////////////
    const theme = createTheme({
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        overflow: 'hidden'
                    },
                    html: {
                        overflow: 'hidden'
                    }
                }
            }
        }
    });
    ////////////////////////////////////////////////////////

    // Return the map component with minimum required styles
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{height: 'calc(100vh - 64px)', position: 'relative'}}>
                <DeckGL
                    layers={layers}               // Add map layers
                    views={MAP_VIEW}              // Add map view settings
                    initialViewState={INITIAL_VIEW_STATE}  // Set initial position
                    controller={{dragRotate: false}}       // Disable rotation
                />

                <IconButton
                    onClick={() => setShowPanel(!showPanel)}
                    sx={{
                        position: 'absolute',
                        top: '10px',
                        right: showPanel ? '320px' : '10px',
                        bgcolor: 'white'
                    }}
                    size="small"
                >
                    {showPanel ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>

                {showPanel && (
                    <Paper
                        elevation={3}
                        sx={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            bottom: '10px',
                            width: '300px',
                            overflowY: 'auto',
                            padding: '16px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)'
                        }}
                    >
                        <Box sx={{mb: 2}}>
                            <FormControl fullWidth>
                                <InputLabel> {t('decision.type.filter')} </InputLabel>
                                <Select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    label={t('decision.type.filter')}
                                >
                                    <MenuItem value="all"> {t('decision.type.all')} </MenuItem>

                                    {decisionTypes.map(type => (<MenuItem key={type} value={type}> {type} </MenuItem>))}

                                </Select>
                            </FormControl>
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            {t('decision.list.title')}
                        </Typography>
                        {hoveredDecisions ? (
                            <Box>
                                <Typography variant="subtitle1" gutterBottom>
                                    {t('decision.found', {
                                        count: hoveredDecisions.filter(d =>
                                            selectedType === 'all' || d.decisionType?.name === selectedType
                                        ).length
                                    })}
                                </Typography>
                                <Box sx={{flex: 1, overflowY: 'auto'}}>
                                    {hoveredDecisions
                                        .filter(d => selectedType === 'all' || d.decisionType?.name === selectedType)
                                        .sort((a, b) => new Date(b.acquisitionTime) - new Date(a.acquisitionTime)) // Sort by Date
                                        .map(decision => (
                                            <Paper
                                                key={decision.id}
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    mb: 1,
                                                    background: 'white'
                                                }}
                                            >
                                                <Typography variant="h6">
                                                    {decision.decisionType?.name}
                                                </Typography>
                                                <Typography>
                                                    {t('decision.acquisitionTime')}: {formatDateShort(decision.acquisitionTime, i18n)}
                                                </Typography>
                                                <Typography>
                                                    {t('decision.state')}: {decision.state || t('decision.decisionType.new')}
                                                </Typography>
                                                {decision.description && (
                                                    <Typography>
                                                        {t('decision.description')}: {decision.description}
                                                    </Typography>
                                                )}
                                            </Paper>
                                        ))}
                                </Box>
                            </Box>
                        ) : (
                            <Typography>
                                {t('decision.list.hover')}
                            </Typography>
                        )}
                    </Paper>

                )}  {/* showPanel && ...*/}

            </Box>
        </ThemeProvider>
    );
}


export default DecisionOverviewMap;