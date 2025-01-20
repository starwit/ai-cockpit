import React, {useState, useEffect, useCallback, useRef} from 'react';
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
const ANIMATION_SPEED = 0.5;

function DecisionOverviewMap() {
    // Add state to store decisions
    const {t, i18n} = useTranslation();
    const [selectedType, setSelectedType] = useState(['all']);
    const [decisions, setDecisions] = useState([]);
    const [hoveredDecisions, setHoveredDecisions] = useState(null); // To track a hover
    const decisionRest = new DecisionRest();
    const [showPanel, setShowPanel] = useState(true);
    const [, setFilteredDecisions] = useState([]);

    // UseRef to store the animation frame ID
    const animationFrameId = useRef(null);
    const lastUpdateTime = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);

    // UseCallback to memoize the animate function
    const animate = useCallback((timestamp) => {
        if (!lastUpdateTime.current) {
            lastUpdateTime.current = timestamp;
        }

        const deltaTime = timestamp - lastUpdateTime.current;
        lastUpdateTime.current = timestamp;

        setCurrentTime(t => (t + (deltaTime * ANIMATION_SPEED * 0.1)) % 1000);
        animationFrameId.current = window.requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        setCurrentTime(0); // Reset time on component mount
        lastUpdateTime.current = null;
        animationFrameId.current = window.requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current) {
                window.cancelAnimationFrame(animationFrameId.current);
                lastUpdateTime.current = null;
                setCurrentTime(0);
            }
        };
    }, [animate]);

    useEffect(() => {
        const animationFrame = window.requestAnimationFrame(animate);
        return () => window.cancelAnimationFrame(animationFrame);
    }, [animate]);


    useEffect(() => {
        reloadDecisions();
        const interval = setInterval(reloadDecisions, 5000); // Update every 5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (decisions.length > 0) { // Check for decisions existence
            filterDecisions(decisions);
        }
    }, [selectedType, decisions]); // Keep tracking both dependencies

    function filterDecisions(data) {
        if (!data) return; // Check for data existence

        if (selectedType.includes('all')) {
            setFilteredDecisions(data);
        } else {
            const filtered = data.filter(d =>
                d.decisionType && selectedType.includes(d.decisionType.name)
            );
            setFilteredDecisions(filtered);
        }
    }


    //Load Decisions
    function reloadDecisions() {
        decisionRest.findAllOpen().then(response => {
            if (response && response.data) {
                const validDecisions = response.data.filter(d => d != null);
                setDecisions(validDecisions);
                filterDecisions(validDecisions);
            }
        }).catch(error => {
            console.error('Error loading decisions:', error);
            setDecisions([]); // Set empty array on error
            setFilteredDecisions([]); // Clear filtered decisions as well
        });
    }

    // This grouping is necessary to combine multiple decisions that occur at the same location (same coordinates)
    function groupDecisionsByLocation(decisions, selectedType) {
        if (!decisions) return {};

        return decisions
            .filter(d => d && (
                selectedType.includes('all') ||
                (d.decisionType && selectedType.includes(d.decisionType.name))
            ))
            .reduce((acc, decision) => {
                if (decision.cameraLatitude && decision.cameraLongitude) {
                    const key = `${decision.cameraLatitude}-${decision.cameraLongitude}`; // Create a unique key from the coordinates
                    if (!acc[key]) {        // If the array for these coordinates does not exist yet, create it
                        acc[key] = [];
                    }
                    acc[key].push(decision);
                }
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
            getRadius: d => {
                const baseRadius = Math.sqrt(d[1].length) * 5;

                // Add a pulsating effect for the icons with more than 5 decisions
                if (d[1].length > 5) {
                    // Heartbeat effect
                    /* currentTime * 0.006   BIGGER = FASTER heart rate, SMALLER = SLOWER heart rate
                    Example values: 0.002 (slow), 0.004 (medium), 0.008 (fast) */
                    const t = (currentTime * 0.006) % 1; // Slowing down the time
                    let pulseEffect = 1;

                    // pulseEffect = 1 + M * Math.sin(t * Math.PI * N);
                    //Where: M - amplitude, N - frequency
                    // First beat   
                    if (t < 0.1) {
                        pulseEffect = 1 + 1 * Math.sin(t * Math.PI * 1);
                    }
                    // Second beat
                    else if (t < 0.17) {
                        pulseEffect = 1 + 1.5 * Math.sin((t - 0.1) * Math.PI * 1);
                    }

                    return baseRadius * pulseEffect;
                }

                return baseRadius;
            },
            getFillColor: d => getIconColor(d[1].length),
            getLineColor: [0, 0, 0, 255],
            onHover: info => {
                if (info.object) {      // Check whether the user has actually pointed the cursor at an object (marker) on the map.
                    setHoveredDecisions(info.object[1]);
                }
            },
            updateTriggers: {
                getRadius: [currentTime] // Update the radius when the time changes
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
            sizeScale: 2,      // Increase the size of the text
            sizeUnits: 'pixels',  // Use pixels for text size
            sizeMinPixels: 16,    // Min
            sizeMaxPixels: 48,    // Max 
            getAngle: 0,
            getTextAnchor: 'middle',
            getAlignmentBaseline: 'center',
            getColor: [255, 255, 255],
            outlineWidth: 2,
            outlineColor: [0, 0, 0],
            fontSettings: {
                sdf: true,     // Turn on Signed Distance Field (SDF) for better text rendering
                fontSize: 24,   // Base font size
                buffer: 10      // Buffer for better text visibility
            }
        })

    }

    function createWaveLayer(groupedDecisions) {
        // Create a wave effect for the icons
        const waveCount = 6;
        const waveData = Object.entries(groupedDecisions).flatMap(entry => {
            return Array.from({length: waveCount}, (_, i) => ({
                ...entry,
                waveIndex: i
            }));
        });

        return new ScatterplotLayer({
            id: 'wave-layer',
            data: waveData,
            pickable: false,
            stroked: false,
            filled: true,
            opacity: 0.9,
            radiusScale: 7,
            radiusMinPixels: 2,
            radiusMaxPixels: 2000,

            // Wave position
            getPosition: d => [
                d[1][0].cameraLongitude,
                d[1][0].cameraLatitude
            ],

            // Wave radius
            getRadius: d => {
                const baseRadius = Math.sqrt(d[1].length) * 5;
                const phaseOffset = (1000 / waveCount) * d.waveIndex;
                const time = (currentTime + phaseOffset) % 1000;
                const waveProgress = time / 1000;

                // Add smooth appear and spread effects
                const appearEffect = Math.min(1, waveProgress * 3);
                const spreadEffect = 1 + waveProgress * 5;

                return baseRadius * spreadEffect * appearEffect * (Math.sqrt(d[1].length));
            },

            // Wave color
            getFillColor: d => {
                const baseColor = getIconColor(d[1].length);
                const phaseOffset = (1000 / waveCount) * d.waveIndex;
                const time = (currentTime + phaseOffset) % 1000;
                const waveProgress = time / 1000;

                // Smooth fade out
                const fadeOut = Math.pow(1 - waveProgress, 3);
                // Smooth fade in
                const fadeIn = Math.min(1, waveProgress * 3);

                const alpha = Math.max(0, 200 * fadeOut * fadeIn);
                return [...baseColor.slice(0, 3), alpha];
            },
            updateTriggers: {
                getRadius: [currentTime],
                getFillColor: [currentTime]
            }
        });
    }
    /////////////////////////////////////////////////////////////////////////////

    const groupedDecisions = groupDecisionsByLocation(decisions, selectedType);

    //Filter decisions that have a type => retrieve type names => create Set to remove duplicates => convert Set back to an array
    const decisionTypes = Array.from(new Set(decisions
        .filter(d => d.decisionType?.name)
        .map(d => d.decisionType.name)
    ));

    const layers = [
        createBaseMapLayer(),
        createWaveLayer(groupedDecisions),
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
                                    multiple
                                    value={selectedType}
                                    onChange={(e) => {
                                        const values = e.target.value;
                                        // If 'all' is selected - toggle it
                                        if (values.includes('all')) {
                                            // If 'all' was not selected - select it and deselect all other values
                                            if (!selectedType.includes('all')) {
                                                setSelectedType(['all']);
                                            }
                                            // If 'all' was already selected - deselect it
                                            else {
                                                const newValues = values.filter(v => v !== 'all');
                                                setSelectedType(newValues.length ? newValues : ['all']);
                                            }
                                        } else {
                                            setSelectedType(values.length ? values : ['all']);
                                        }
                                    }}
                                    label={t('decision.type.filter')}
                                    renderValue={(selected) => {
                                        // Translate 'all' to the localized string
                                        return selected.map(value =>
                                            value === 'all' ? t('decision.type.all') : value
                                        ).join(', ');
                                    }}
                                >
                                    {/* Bold font for selected items */}
                                    <MenuItem
                                        value="all"
                                        sx={{fontWeight: selectedType.includes('all') ? 'bold' : 'normal'}}
                                    >
                                        {t('decision.type.all')}
                                    </MenuItem>

                                    {decisionTypes.map(type => (
                                        <MenuItem
                                            key={type}
                                            value={type}
                                            sx={{fontWeight: selectedType.includes(type) ? 'bold' : 'normal'}}
                                        >
                                            {type}
                                        </MenuItem>
                                    ))}

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
                                        count: hoveredDecisions.length
                                    })}
                                </Typography>
                                <Box sx={{flex: 1, overflowY: 'auto'}}>
                                    {hoveredDecisions
                                        .filter(d => selectedType.includes('all') || d.decisionType?.name && selectedType.includes(d.decisionType.name))
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