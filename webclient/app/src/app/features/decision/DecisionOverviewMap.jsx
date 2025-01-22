import React, {useState, useEffect, useMemo} from 'react';
import {MapView} from '@deck.gl/core';
import {TileLayer} from "@deck.gl/geo-layers";

import {
    BitmapLayer,
    TextLayer,
    ScatterplotLayer
} from "@deck.gl/layers";

import DeckGL from "@deck.gl/react";
import {HeatmapLayer} from '@deck.gl/aggregation-layers';

import DecisionRest from '../../services/DecisionRest';
import ActionTypeRest from '../../services/ActionTypeRest';

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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Button,
    TextField,
    Chip,
    OutlinedInput,
    FormControlLabel,
    Checkbox
} from '@mui/material';


import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import MediaContent from "../../commons/MediaContent";

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {formatDateShort, formatDateFull} from '../../commons/formatter/DateFormatter';

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

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDecisions, setSelectedDecisions] = useState(null);
    const [currentDecisionIndex, setCurrentDecisionIndex] = useState(0);

    const [viewMode, setViewMode] = useState('normal'); // 'normal' or 'heatmap'


    useEffect(() => {
        const loadData = () => {
            const request = selectedType === 'all'
                ? decisionRest.findAllOpen()
                : decisionRest.findAllOpenByType(selectedType);

            request.then(response => {
                if (response.data) {
                    setDecisions(response.data);
                    // If not hovered, show all decisions
                    if (!hoveredDecisions) {
                        setHoveredDecisions(response.data);
                    }
                }
            });
        };

        // Initial data load
        loadData();

        // Update data every 5 seconds if the dialog is not open
        let interval;
        if (!dialogOpen) {
            interval = setInterval(loadData, 5000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [selectedType, dialogOpen]);


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
            data: viewMode === 'heatmap'
                ? "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                : "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
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
                if (info.object) {
                    const decisions = info.object[1];
                    // Filter decisions by type if selected
                    const filteredDecisions = selectedType === 'all'
                        ? decisions
                        : decisions.filter(d => d.decisionType?.name === selectedType);
                    setHoveredDecisions(filteredDecisions);
                }
            },
            onClick: info => {
                if (info.object) {
                    setSelectedDecisions(info.object[1]),
                        setCurrentDecisionIndex(0),
                        setDialogOpen(true);
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

    function createHeatmapLayer() {
        return new HeatmapLayer({
            id: 'heatmap',
            data: decisions,
            getPosition: d => [d.cameraLongitude, d.cameraLatitude],
            getWeight: 1,
            radiusPixels: 30,
            intensity: 1,
            threshold: 0.05,
            aggregation: 'SUM'
        });
    }

    function createInteractiveLayer(groupedDecisions) { // Add an interactive layer on top of the heat map
        return new ScatterplotLayer({
            id: 'interactive-layer',
            data: Object.entries(groupedDecisions),
            pickable: true,
            visible: true,
            opacity: 0,  // Invisible layer
            stroked: false,
            filled: true,
            radiusScale: 15,
            radiusMinPixels: 5,
            radiusMaxPixels: 100,
            getPosition: d => [
                d[1][0].cameraLongitude,
                d[1][0].cameraLatitude
            ],
            getRadius: d => Math.sqrt(d[1].length) * 5,
            onHover: info => {
                if (info.object) {
                    const decisions = info.object[1];
                    const filteredDecisions = selectedType === 'all'
                        ? decisions
                        : decisions.filter(d => d.decisionType?.name === selectedType);
                    setHoveredDecisions(filteredDecisions);
                }
            },
            onClick: info => {
                if (info.object) {
                    setSelectedDecisions(info.object[1]);
                    setCurrentDecisionIndex(0);
                    setDialogOpen(true);
                }
            }
        });
    }

    /////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////

    const groupedDecisions = groupDecisionsByLocation();

    //Filter decisions that have a type => retrieve type names => create Set to remove duplicates => convert Set back to an array
    const decisionTypes = Array.from(new Set(decisions
        .filter(d => d.decisionType?.name)
        .map(d => d.decisionType.name)
    ));

    const layers = viewMode === 'normal' ? [
        createBaseMapLayer(),
        createDecisionPointsLayer(groupedDecisions),
        createTextLayer(groupedDecisions)

    ] : [
        createBaseMapLayer(),
        createHeatmapLayer(decisions.filter(d =>
            selectedType === 'all' || d.decisionType?.name === selectedType
        )),
        createInteractiveLayer(groupedDecisions)  // Add an interactive layer on top of the heat map
    ];
    ////////////////////////////////////////////////////////////////////////////

    // Dialog component for displaying and managing decision details
    // This component opens when a marker on the map is clicked
    function DecisionDialog() {
        const {t, i18n} = useTranslation();
        // States for form fields and data
        const [description, setDescription] = useState('');         // For description text field
        const [actionTypes, setActionTypes] = useState([]);        // For selected action types
        const [availableActions, setAvailableActions] = useState([]);  // For available action options

        // Initialize action type service
        const actionTypeRest = useMemo(() => new ActionTypeRest(), []);

        // Early return if required data is not available
        if (!selectedDecisions || !dialogOpen || !selectedDecisions[currentDecisionIndex]) {
            return null;
        }

        // Get current decision after validation
        const currentDecision = selectedDecisions[currentDecisionIndex];

        // Load available actions when dialog opens or decision changes
        useEffect(() => {
            if (dialogOpen && currentDecision?.decisionType?.id) {
                actionTypeRest.findByDecisionType(currentDecision.decisionType.id)
                    .then(response => {
                        if (response.data) {
                            setAvailableActions(response.data);
                        }
                    });
            }
        }, [dialogOpen, currentDecision, actionTypeRest]);

        return (
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="lg"
            >
                {/* Header section with decision type and date */}
                <DialogTitle sx={{pb: 3}}> {/* This tag by default creates h2 element, so <h2><h6></h6></h2> is not right. */}
                    <Box> {/* Using a separate Box for headers to avoid nesting h-elements */}
                        <Typography variant="h6" component="div">
                            {currentDecision.decisionType?.name.toUpperCase()}
                        </Typography>
                        <Typography variant="subtitle2" component="div">
                            {formatDateFull(currentDecision.acquisitionTime, i18n)}
                        </Typography>

                        {/* Navigation Controls */}
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2}}>
                            <IconButton onClick={() =>
                                setCurrentDecisionIndex(prev => prev > 0 ? prev - 1 : selectedDecisions.length - 1)
                            }>
                                <ArrowBackIosIcon />
                            </IconButton>
                            <Typography>
                                {currentDecisionIndex + 1} / {selectedDecisions.length}
                            </Typography>
                            <IconButton onClick={() =>
                                setCurrentDecisionIndex(prev => prev < selectedDecisions.length - 1 ? prev + 1 : 0)
                            }>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>
                        {/* End Navigation Controls */}
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={3} sx={{mt: 1}}>
                        {/* Decision Type Selection (disabled, display only) */}
                        <FormControl fullWidth>
                            <InputLabel sx={{backgroundColor: 'white', px: 1}}>
                                {t("decision.decisionType")}
                            </InputLabel>
                            <Select
                                value={currentDecision.decisionType?.id || ''}
                                disabled
                                label={t("decision.decisionType")}
                            >
                                <MenuItem value={currentDecision.decisionType?.id}>
                                    {currentDecision.decisionType?.name}
                                </MenuItem>
                            </Select>
                        </FormControl>

                        {/* Description Input Field */}
                        <TextField
                            label={t("decision.description")}
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            slotProps={{
                                inputLabel: {
                                    sx: {backgroundColor: 'white', px: 1}
                                }
                            }}
                        />

                        {/* "action Actions" Multi-Select */}
                        <FormControl fullWidth>
                            <InputLabel sx={{backgroundColor: 'white', px: 1}}>
                                {t("decision.action")}
                            </InputLabel>
                            <Select
                                multiple
                                value={actionTypes}
                                onChange={(e) => setActionTypes(e.target.value)}
                                input={<OutlinedInput label={t("decision.action")} />}
                                renderValue={(selected) => (
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                        {selected.map((value) => (
                                            <Chip key={value.id} label={value.name} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {availableActions.map((action) => (
                                    <MenuItem key={action.id} value={action}>
                                        {action.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Media Display Section */}
                        <Box>
                            <MediaContent
                                sx={{width: '100%', aspectRatio: '16/9'}}
                                src={window.location.pathname + "api/decision/download/" + currentDecision.mediaUrl}
                            />
                        </Box>
                    </Stack>
                </DialogContent>

                {/* Action Buttons */}
                <DialogActions>
                    {/* Save button */}
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={() => setDialogOpen(false)}
                    >
                        {t("button.save")}
                    </Button>


                    {/* Aknowledged and Report buttons */}
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<ErrorIcon />}
                        onClick={() => setDialogOpen(false)}
                    >
                        {t("decision.button.reportmistake")}
                    </Button>


                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckIcon />}
                        onClick={() => setDialogOpen(false)}
                    >
                        {t("decision.button.acknowledged")}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    // Return the map component with minimum required styles
    return (
        <Box sx={{height: 'calc(100vh - 64px)', position: 'relative'}}>
            <DeckGL
                layers={layers}               // Add map layers
                views={MAP_VIEW}              // Add map view settings
                initialViewState={INITIAL_VIEW_STATE}  // Set initial position
                controller={{dragRotate: false}}       // Disable rotation
            />

            <DecisionDialog />

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
                        {/* View mode switch */}
                        <FormControl fullWidth sx={{mb: 2}}>
                            <InputLabel
                                sx={{
                                    bgcolor: 'white',
                                    px: 1,
                                    '&.MuiInputLabel-shrink': {
                                        bgcolor: 'white'
                                    }
                                }}
                            > View Mode </InputLabel>
                            <Select
                                value={viewMode}
                                onChange={(e) => setViewMode(e.target.value)}
                            >
                                <MenuItem value="normal">Normal</MenuItem>
                                <MenuItem value="heatmap">Heatmap</MenuItem>
                            </Select>
                        </FormControl>


                        <Box sx={{mb: 2}}>
                            <FormControl fullWidth>
                                <InputLabel> {t('decision.type.filter')} </InputLabel>
                                <Select
                                    value={selectedType}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSelectedType(newValue);
                                        // Force a data reload
                                        const loadData = newValue === 'all'
                                            ? decisionRest.findAllOpen()
                                            : decisionRest.findAllOpenByType(newValue);

                                        loadData.then(response => {
                                            if (response.data) {
                                                setDecisions(response.data);
                                                // Update hoveredDecisions with new data
                                                setHoveredDecisions(response.data);
                                            }
                                        });
                                    }}
                                    label={t('decision.type.filter')}
                                >
                                    <MenuItem value="all"> {t('decision.type.all')} </MenuItem>

                                    {decisionTypes.map(type => (<MenuItem key={type} value={type}> {type} </MenuItem>))}

                                </Select>
                            </FormControl>
                        </Box>
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
    );
}


export default DecisionOverviewMap;
