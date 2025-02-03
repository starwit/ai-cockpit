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
    MenuItem
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
    {value: 0, label: 'time.range.allTime'},
    {value: 1, label: 'time.range.lastHour'},
    {value: 3, label: 'time.range.last3Hours'},
    {value: 6, label: 'time.range.last6Hours'},
    {value: 12, label: 'time.range.last12Hours'},
    {value: 24, label: 'time.range.last24Hours'}
];

function DecisionHeatmap({decisions, onHover, onClick}) {
    const {t} = useTranslation();
    const [selectedStates, setSelectedStates] = useState([]);
    const [timeFilter, setTimeFilter] = useState(0);


    // Filter decisions based on selected states. Null is considered as 'NEW'
    const filteredDecisions = useMemo(() => {
        if (!decisions) return [];

        let filtered = decisions;

        // Apply state filter
        if (selectedStates.length > 0) {
            filtered = filtered.filter(decision => {
                if (selectedStates.includes('NEW')) {
                    if (!decision.state || decision.state === 'NEW') {
                        return true;
                    }
                }
                return selectedStates.includes(decision.state);
            });
        }

        // Apply time filter
        if (timeFilter > 0) {
            const cutoffTime = new Date();
            cutoffTime.setHours(cutoffTime.getHours() - timeFilter);

            filtered = filtered.filter(decision => {
                const decisionTime = new Date(decision.acquisitionTime);
                return decisionTime >= cutoffTime;
            });
        }

        return filtered;
    }, [decisions, selectedStates, timeFilter]);


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
        // Group decisions by location already filtered
        const groupedFilteredDecisions = filteredDecisions.reduce((locationGroups, decision) => {
            const key = `${decision.cameraLatitude}-${decision.cameraLongitude}`;
            if (!locationGroups[key]) {
                locationGroups[key] = [];
            }
            locationGroups[key].push(decision);
            return locationGroups;
        }, {});

        return new ScatterplotLayer({
            id: 'interactive-layer',
            data: Object.entries(groupedFilteredDecisions), // Use already grouped data
            pickable: true,
            visible: true,
            opacity: 0,
            stroked: false,
            filled: true,
            radiusScale: 15,
            radiusMinPixels: 5,
            radiusMaxPixels: 100,
            getPosition: group => [
                group[1][0].cameraLongitude,
                group[1][0].cameraLatitude
            ],
            getRadius: radius => Math.sqrt(radius[1].length) * 5,
            onHover: onHover,
            onClick: onClick
        });
    }

    // Use useMemo to avoid creating new layers on every render
    const layers = useMemo(() => [
        createBaseMapLayer(),
        createHeatmapLayer(),
        createInteractiveLayer()
    ], [filteredDecisions]); // Re-create layers when filteredDecisions change

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

                    <Box sx={{marginTop: 2}}>
                        <FormControl fullWidth size="small">
                            <InputLabel>{t('time.range')}</InputLabel>
                            <Select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
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

                    <Typography variant="caption" sx={{marginTop: 1, display: 'block'}}>
                        Visible decisions: {filteredDecisions.length}
                    </Typography>
                </Paper>
            </Box>
            <DeckGL
                layers={layers}
                views={MAP_VIEW}
                initialViewState={INITIAL_VIEW_STATE}
                controller={{dragRotate: false}}
                onHover={onHover}
                onClick={onClick}
            />
        </>
    );
}

export default DecisionHeatmap;
