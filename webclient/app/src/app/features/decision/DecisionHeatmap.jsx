import React, {useState, useMemo} from 'react';
import DeckGL from '@deck.gl/react';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import {MapView} from '@deck.gl/core';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer, ScatterplotLayer} from '@deck.gl/layers';
import {
    FormGroup,
    FormControlLabel,
    FormControl,
    Checkbox,
    Box,
    Paper,
    Typography,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    TextField
} from '@mui/material';
import {useTranslation} from 'react-i18next';

const MAP_VIEW = new MapView({repeat: true});

const INITIAL_VIEW_STATE = {
    longitude: -86.13470,
    latitude: 39.91,
    zoom: 10,
    pitch: 0,
    bearing: 0
};

const STATES = [
    {id: 'NEW', name: 'NEW'},
    {id: 'ACCEPTED', name: 'ACCEPTED'},
    {id: 'REJECTED', name: 'REJECTED'}
];

const TIME_FILTERS = [
    {value: -1, label: 'time.range.custom'},
    {value: 0, label: 'time.range.allTime'},
    {value: 1, label: 'time.range.lastHour'},
    {value: 3, label: 'time.range.last3Hours'},
    {value: 6, label: 'time.range.last6Hours'},
    {value: 12, label: 'time.range.last12Hours'},
    {value: 24, label: 'time.range.last24Hours'}
];

function DecisionHeatmap({decisions = [], onHover, onClick, selectedTypes = ['all']}) {
    const {t} = useTranslation();
    const [selectedStates, setSelectedStates] = useState([]);
    const [timeFilter, setTimeFilter] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filteredDecisions = useMemo(() => {
        if (!Array.isArray(decisions) || decisions.length === 0) return [];

        return decisions.filter(decision => {
            // Validate required location data
            if (!decision?.cameraLatitude || !decision?.cameraLongitude) {
                return false;
            }

            // Apply type filter
            const typeMatch = selectedTypes.includes('all') ||
                (decision.decisionType && selectedTypes.includes(decision.decisionType.name));
            if (!typeMatch) return false;

            // Apply state filter
            if (selectedStates.length > 0) {
                // Default to 'NEW' state if not set
                const decisionState = decision.state || 'NEW';
                if (!selectedStates.includes(decisionState)) {
                    return false;
                }
            }

            // Apply time range filter
            if (timeFilter === -1 && startDate && endDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                const decisionTime = new Date(decision.acquisitionTime);
                if (!(decisionTime >= start && decisionTime <= end)) return false;
            } else if (timeFilter > 0) {
                const cutoffTime = new Date();
                cutoffTime.setHours(cutoffTime.getHours() - timeFilter);
                const decisionTime = new Date(decision.acquisitionTime);
                if (!(decisionTime >= cutoffTime)) return false;
            }

            return true;
        });
    }, [decisions, selectedTypes, selectedStates, timeFilter, startDate, endDate]);

    function createBaseMapLayer() {
        return new TileLayer({
            data: "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
            minZoom: 0,
            maxZoom: 19,
            tileSize: 256,
            renderSubLayers: props => {
                const {
                    bbox: {west, south, east, north}
                } = props.tile;
                return new BitmapLayer(props, {
                    data: null,
                    image: props.data,
                    bounds: [west, south, east, north]
                });
            }
        });
    }

    function createHeatmapLayer() {
        return new HeatmapLayer({
            id: 'heatmap',
            data: filteredDecisions,
            getPosition: decision => [decision.cameraLongitude, decision.cameraLatitude],
            getWeight: 1,
            radiusPixels: 60,
            intensity: 1,
            threshold: 0.05,
            aggregation: 'SUM'
        });
    }

    function createInteractiveLayer() {
        if (filteredDecisions.length === 0) return null;

        const groupedDecisions = filteredDecisions.reduce((locationGroups, decision) => {
            const key = `${decision.cameraLatitude},${decision.cameraLongitude}`;
            if (!locationGroups[key]) {
                locationGroups[key] = {
                    position: [decision.cameraLongitude, decision.cameraLatitude],
                    decisions: []
                };
            }
            locationGroups[key].decisions.push(decision);
            return locationGroups;
        }, {});

        const points = Object.values(groupedDecisions);

        return new ScatterplotLayer({
            id: 'interactive-layer',
            data: points,
            pickable: true,
            visible: true,
            opacity: 0.1,
            stroked: true,
            filled: true,
            radiusScale: 15,
            radiusMinPixels: 5,
            radiusMaxPixels: 100,
            lineWidthMinPixels: 1,
            getPosition: decision => decision.position,
            getRadius: decision => Math.sqrt(decision.decisions.length) * 5,
            getFillColor: [255, 140, 0, 180],
            getLineColor: [255, 140, 0],
            onHover: (info) => {
                if (onHover) {
                    const hoveredDecisions = info.object ? info.object.decisions : null;
                    onHover({...info, object: hoveredDecisions});
                }
            },
            onClick: (info) => {
                if (onClick) {
                    const clickedDecisions = info.object ? info.object.decisions : null;
                    onClick({...info, object: clickedDecisions});
                }
            }
        });
    }

    const layers = useMemo(() => {
        const layersList = [createBaseMapLayer()];

        if (filteredDecisions.length > 0) {
            layersList.push(createHeatmapLayer());

            const interactiveLayer = createInteractiveLayer();
            if (interactiveLayer) {
                layersList.push(interactiveLayer);
            }
        }

        return layersList;
    }, [filteredDecisions]);

    return (
        <>
            <Box sx={{
                position: 'absolute',
                left: 20,
                bottom: 40,
                zIndex: 1
            }}>
                <Paper sx={{
                    p: 2,
                    maxWidth: 200,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    boxShadow: 3,
                    borderRadius: 2
                }}>
                    <Typography variant="subtitle2" gutterBottom>
                        {t('decision.state')}
                    </Typography>
                    <FormGroup row>
                        {STATES.map(({id, name}) => (
                            <FormControlLabel
                                key={`state-label-${id}`}
                                control={
                                    <Checkbox
                                        key={`state-checkbox-${id}`}
                                        checked={selectedStates.includes(name)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedStates([...selectedStates, name]);
                                            } else {
                                                setSelectedStates(selectedStates.filter(s => s !== name));
                                            }
                                        }}
                                        size="small"
                                    />
                                }
                                label={t(`decision.state.${name.toLowerCase()}`)}
                            />
                        ))}
                    </FormGroup>

                    <Divider sx={{marginY: 2}} />

                    <Box sx={{marginTop: 2}}>
                        <FormControl fullWidth size="small">
                            <InputLabel>{t('time.range')}</InputLabel>
                            <Select
                                value={timeFilter}
                                onChange={(e) => {
                                    setTimeFilter(e.target.value);
                                    if (e.target.value !== -1) {
                                        setStartDate('');
                                        setEndDate('');
                                    }
                                }}
                                label={t('time.range')}
                            >
                                {TIME_FILTERS.map((filter) => (
                                    <MenuItem key={filter.value} value={filter.value}>
                                        {t(filter.label)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {timeFilter === -1 && (
                        <Box sx={{mt: 2}}>
                            <TextField
                                type="date"
                                label={t('time.range.start')}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                size="small"
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                sx={{mb: 1}}
                            />
                            <TextField
                                type="date"
                                label={t('time.range.end')}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                size="small"
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                inputProps={{min: startDate}}
                            />
                        </Box>
                    )}

                    <Typography variant="caption" sx={{marginTop: 1, display: 'block'}}>
                        {t('decision.found', {count: filteredDecisions.length})}
                    </Typography>
                </Paper>
            </Box>

            <DeckGL
                layers={layers}
                views={MAP_VIEW}
                initialViewState={INITIAL_VIEW_STATE}
                controller={{dragRotate: false}}
            />
        </>
    );
}

export default DecisionHeatmap;