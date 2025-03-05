import React, {useMemo, useState, useEffect, useRef} from 'react';
import DeckGL from '@deck.gl/react';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import {MapView} from '@deck.gl/core';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer, ScatterplotLayer} from '@deck.gl/layers';
import {Box, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

const MAP_VIEW = new MapView({repeat: true});

// Initial map state (will be used only if there's no data)
const INITIAL_VIEW_STATE = {
    longitude: -86.13470,
    latitude: 39.91,
    zoom: 10,
    pitch: 0,
    bearing: 0
};

function DecisionHeatmap({
    decisions = [],
    onHover,
    onClick,
    selectedTypes = ['all'],
    filters = {selectedStates: [], timeFilter: 0, startDate: '', endDate: ''}
}) {
    const {t} = useTranslation();

    // Adding a state for ViewState and ref DeckGL
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const deckRef = useRef(null);
    const isFirstLoad = useRef(true);

    // Function to calculate bounds based on decision coordinates
    function calculateBounds(decisions) {
        if (!decisions || decisions.length === 0) {
            return null;
        }

        let minLng = Infinity;
        let maxLng = -Infinity;
        let minLat = Infinity;
        let maxLat = -Infinity;

        // Find minimum and maximum coordinate values
        decisions.forEach(decision => {
            if (decision.cameraLatitude && decision.cameraLongitude) {
                minLng = Math.min(minLng, decision.cameraLongitude);
                maxLng = Math.max(maxLng, decision.cameraLongitude);
                minLat = Math.min(minLat, decision.cameraLatitude);
                maxLat = Math.max(maxLat, decision.cameraLatitude);
            }
        });

        // If no valid coordinates were found
        if (minLng === Infinity || minLat === Infinity) {
            return null;
        }

        // Add some padding around the bounds
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

        // Approximate zoom calculation based on the area size
        const lngDiff = east - west;
        const latDiff = north - south;
        const maxDiff = Math.max(lngDiff, latDiff);

        // Formula for approximate zoom calculation
        const zoom = Math.floor(Math.log2(360 / maxDiff)) - 1;

        return {
            longitude,
            latitude,
            zoom: Math.min(Math.max(zoom, 3), 18), // Limit zoom between 3 and 18
            pitch: 0,
            bearing: 0
        };
    }

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
            if (filters.selectedStates.length > 0) {
                const decisionState = decision.state || 'NEW';
                if (!filters.selectedStates.includes(decisionState)) {
                    return false;
                }
            }

            // Apply time range filter
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
    }, [decisions, selectedTypes, filters]);

    // Effect to update viewState when filtered data changes
    useEffect(() => {
        if (filteredDecisions.length > 0 && isFirstLoad.current) {
            const bounds = calculateBounds(filteredDecisions);
            const newViewState = boundsToViewState(bounds);
            setViewState(newViewState);
            isFirstLoad.current = false;
        }
    }, [filteredDecisions]);

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
            getPosition: d => d.position,
            getRadius: d => Math.sqrt(d.decisions.length) * 5,
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
                <Typography variant="caption" sx={{
                    bgcolor: 'background.paper',
                    padding: 1,
                    borderRadius: 1
                }}>
                    {t('decision.found', {count: filteredDecisions.length})}
                </Typography>
            </Box>

            <DeckGL
                ref={deckRef}
                layers={layers}
                views={MAP_VIEW}
                initialViewState={viewState}
                controller={{dragRotate: false}}
            />
        </>
    );
}

export default DecisionHeatmap;