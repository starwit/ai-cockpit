import React, {useState, useEffect, useMemo} from 'react';
import {MapView} from '@deck.gl/core';
import {TileLayer} from "@deck.gl/geo-layers";

import {
    BitmapLayer,
    TextLayer,
    ScatterplotLayer
} from "@deck.gl/layers";

import DeckGL from "@deck.gl/react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import DecisionTypeRest from '../../services/DecisionTypeRest';
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
    ListItemText
} from '@mui/material';


import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import MediaContent from "../../commons/MediaContent";

import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
    const [showFilterPanel, setShowFilterPanel] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDecisions, setSelectedDecisions] = useState(null);
    const [currentDecisionIndex, setCurrentDecisionIndex] = useState(0);

    useEffect(() => {
        reloadDecisions();

        let interval;

        // Run interval only if the dialog is closed
        if (!dialogOpen) {
            interval = setInterval(reloadDecisions, 5000);
        }  // Update every 5 seconds

        // After loading the decisions immediately show them in the panel
        if (decisions.length > 0) {
            setHoveredDecisions(decisions);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [selectedType, dialogOpen]);

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



    // Dialog component for displaying and managing decision details
    // This component opens when a marker on the map is clicked
    function DecisionDialog() {
        const {t, i18n} = useTranslation();
        const [actionTypes, setActionTypes] = useState([]);
        const [description, setDescription] = useState('');
        const [decisionType, setDecisionType] = useState(null);
        const [allDecisionTypes, setAllDecisionTypes] = useState([]);
        const actionTypeRest = useMemo(() => new ActionTypeRest(), []);
        const decisionTypeRest = useMemo(() => new DecisionTypeRest(), []);

        if (!selectedDecisions || !dialogOpen || !selectedDecisions[currentDecisionIndex]) return null;

        const currentDecision = selectedDecisions[currentDecisionIndex];

        useEffect(() => {
            if (dialogOpen && currentDecision?.decisionType?.id) {
                // Load decision types
                decisionTypeRest.findAll().then(response => {
                    if (response.data) {
                        setAllDecisionTypes(response.data);
                        // Set if the current decision type is found in the list
                        setDecisionType(response.data.find(type => type.id === currentDecision.decisionType.id) || null);
                    }
                });

                // Load action types for the current decision type
                actionTypeRest.findByDecisionType(currentDecision.decisionType.id)
                    .then(response => {
                        if (response.data) {
                            setActionTypes(response.data);
                        }
                    });
            }
        }, [dialogOpen, currentDecision, actionTypeRest, decisionTypeRest]);

        const handleChangeDecisionType = (event) => {
            setDecisionType(event.target.value); // Update state with the selected decision type
        };

        return (
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth={false}
                fullWidth
                PaperProps={{
                    sx: {
                        position: "fixed",
                        top: "40%",
                        maxHeight: "80%",
                        transform: `translate(-0%, -40%)`,
                        borderRadius: 0
                    }
                }}
            >
                <DialogTitle component="div" sx={{paddingBottom: 0, marginBottom: 0}}>
                    <Box>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                textTransform: 'uppercase',
                                fontSize: '1.8rem'
                            }}>
                            {currentDecision.decisionType?.name}
                        </Typography>
                        <Typography variant="subtitle2" noWrap>
                            {formatDateFull(currentDecision.acquisitionTime, i18n)}
                        </Typography>
                    </Box>
                </DialogTitle>

                <IconButton
                    onClick={() => setDialogOpen(false)}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent sx={{height: 'auto', overflow: 'hidden', padding: 3}}>
                    <Stack direction="row" spacing={2}>
                        <Stack sx={{width: "100%"}}>
                            {/* Details Section */}
                            <FormControl fullWidth variant="outlined">
                                <TextField
                                    autoFocus
                                    required
                                    margin="dense"
                                    id="description"
                                    name="description"
                                    label={t("decision.description")}
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    sx={{borderRadius: 0}}
                                />
                            </FormControl>

                            {/* Decision Type Section */}
                            <FormControl fullWidth variant="outlined" sx={{mt: 2}}>
                                <InputLabel id="decision.decisionType.label">
                                    {t("decision.decisionType")}
                                </InputLabel>
                                <Select
                                    labelId="decision.decisionType.label"
                                    id="decision.decisionType"
                                    value={decisionType || ''}
                                    onChange={handleChangeDecisionType}
                                    label={t("decision.decisionType")}
                                    input={<OutlinedInput label={t("decision.decisionType")} />}
                                    renderValue={selected => (
                                        <Chip label={selected ? selected.name : t("decision.decisionType")} variant="outlined" sx={{border: "none"}} />
                                    )}
                                >
                                    {allDecisionTypes.map((type, index) => (
                                        <MenuItem key={index} value={type}>
                                            <ListItemText>{type.name}</ListItemText>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <MediaContent
                                sx={{
                                    aspectRatio: "16/9",
                                    objectFit: "cover",
                                    width: "100%",
                                    mt: 2,
                                    transform: "translateX(25.5%) translateY(10%) scale(1.1) scaleX(1.3)"
                                }}

                                src={window.location.pathname + "api/decision/download/" + currentDecision.mediaUrl}
                            />
                        </Stack>

                        <Stack sx={{width: 1 / 2, pt: 6.5}}>
                            {/* action Actions Section */}
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="decision.action.label">
                                    {t("decision.action")}
                                </InputLabel>
                                <Select
                                    labelId="decision.action.label"
                                    id="decision.action.select"
                                    multiple
                                    value={actionTypes}
                                    input={<OutlinedInput label={t("decision.action")} />}
                                    renderValue={selected => (
                                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                                            {selected.map((value, index) => (
                                                <Chip key={index} label={value.name} variant="outlined" sx={{color: "green"}} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {actionTypes.map((value, index) => (
                                        <MenuItem key={index} value={value}>
                                            {value.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 2
                }}>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={() => handleSave(actionTypes, decisionType, description, currentDecision.state)}
                        sx={{ml: 1, borderRadius: 0}}
                    >
                        {t("button.save")}
                    </Button>

                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <IconButton onClick={() => setCurrentDecisionIndex(prev =>
                            prev > 0 ? prev - 1 : selectedDecisions.length - 1
                        )}>
                            <ArrowBackIosIcon />
                        </IconButton>
                        <Typography>{currentDecisionIndex + 1}/{selectedDecisions.length}</Typography>
                        <IconButton onClick={() => setCurrentDecisionIndex(prev =>
                            prev < selectedDecisions.length - 1 ? prev + 1 : 0
                        )}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>

                    <Box>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<ErrorIcon />}
                            onClick={() => handleSave(actionTypes, decisionType, description, "REJECTED")}
                            sx={{mr: 1, borderRadius: 0}}
                        >
                            {t("decision.button.reportmistake")}
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckIcon />}
                            onClick={() => handleSave(actionTypes, decisionType, description, "ACCEPTED")}
                            sx={{mr: 1, borderRadius: 0}}
                        >
                            {t("decision.button.acknowledged")}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        );
    }
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
                    layers={layers}
                    views={MAP_VIEW}
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={{dragRotate: false}}
                />

                {/* Filter panel on the left */}
                {showFilterPanel && (
                    <Paper
                        elevation={3}
                        sx={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            bottom: '10px',
                            width: '300px',
                            padding: '16px',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            zIndex: 1, // Ensure the panel is above the map
                            maxHeight: '110px', // Limit the height
                            overflowY: 'auto' // Allow scrolling only inside the panel if needed
                        }}
                    >
                        <Box sx={{mb: 2}}>
                            <FormControl fullWidth>
                                <InputLabel>{t('decision.type.filter')}</InputLabel>
                                <Select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    label={t('decision.type.filter')}
                                >
                                    <MenuItem value="all">{t('decision.type.all')}</MenuItem>
                                    {decisionTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Paper>
                )}

                {/* Button to show/hide the filter panel */}
                <IconButton
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    sx={{
                        position: 'absolute',
                        top: '10px',
                        left: showFilterPanel ? '320px' : '10px',
                        bgcolor: 'white',
                        zIndex: 2 // Ensure the button is above other elements
                    }}
                    size="small"
                >
                    {showFilterPanel ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>

                {/* Results list on the right */}
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
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            maxHeight: 'calc(100vh - 100px)',
                            zIndex: 1
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            {t('decision.list.title')}
                        </Typography>
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                {t('decision.found', {
                                    count: hoveredDecisions
                                        ? hoveredDecisions.filter((d) =>
                                            selectedType === 'all' || d.decisionType?.name === selectedType
                                        ).length
                                        : decisions.filter((d) =>
                                            selectedType === 'all' || d.decisionType?.name === selectedType
                                        ).length
                                })}
                            </Typography>
                            <Box sx={{flex: 1, overflowY: 'auto'}}>
                                {(hoveredDecisions || decisions)
                                    .filter((d) => selectedType === 'all' || d.decisionType?.name === selectedType)
                                    .sort((a, b) => new Date(b.acquisitionTime) - new Date(a.acquisitionTime))
                                    .map((decision) => (
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
                    </Paper>
                )}

                {/* Button to show/hide the results list */}
                <IconButton
                    onClick={() => setShowPanel(!showPanel)}
                    sx={{
                        position: 'absolute',
                        top: '10px',
                        right: showPanel ? '320px' : '10px',
                        bgcolor: 'white',
                        zIndex: 2 // Ensure the button is above other elements
                    }}
                    size="small"
                >
                    {showPanel ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>

                <DecisionDialog />
            </Box>
        </ThemeProvider>
    );
}


export default DecisionOverviewMap;