import React, {useState, useEffect} from 'react';
import DeckGL from '@deck.gl/react';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import {MapView} from '@deck.gl/core';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer, ScatterplotLayer} from '@deck.gl/layers';
import DecisionRest from '../../services/DecisionRest';

const MAP_VIEW = new MapView({repeat: true});

const INITIAL_VIEW_STATE = {
    longitude: -86.13470,
    latitude: 39.91,
    zoom: 10,
    pitch: 0,
    bearing: 0
};

function DecisionHeatmap({onHover, onClick, selectedTypes = ['all']}) {
    const [decisions, setDecisions] = useState([]);
    const decisionRest = new DecisionRest();

    useEffect(() => {
        reloadDecisions();
        const interval = setInterval(reloadDecisions, 5000);
        return () => clearInterval(interval);
    }, []);

    function reloadDecisions() {
        decisionRest.findAllOpen().then(response => {
            if (response.data) {
                setDecisions(response.data);
            }
        });
    }

    // First group decisions by location
    function groupDecisionsByLocation() {
        return decisions.reduce((acc, decision) => {
            // Only include decisions that match the filter criteria
            if (selectedTypes.includes('all') ||
                (decision.decisionType && selectedTypes.includes(decision.decisionType.name))) {
                const key = `${decision.cameraLatitude}-${decision.cameraLongitude}`;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(decision);
            }
            return acc;
        }, {});
    }

    const groupedDecisions = groupDecisionsByLocation();

    // Extract filtered decisions for the heatmap layer
    const filteredDecisions = Object.values(groupedDecisions).flat();

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
        return new ScatterplotLayer({
            id: 'interactive-layer',
            data: Object.entries(groupedDecisions),
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

    const layers = [
        createBaseMapLayer(),
        createHeatmapLayer(),
        createInteractiveLayer()
    ];

    return (
        <DeckGL
            layers={layers}
            views={MAP_VIEW}
            initialViewState={INITIAL_VIEW_STATE}
            controller={{dragRotate: false}}
        />
    );
}

export default DecisionHeatmap;