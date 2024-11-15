import React from 'react';
import {MapView} from '@deck.gl/core';
import {TileLayer} from "@deck.gl/geo-layers";
import {BitmapLayer, IconLayer} from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import cameraicon from "./../../assets/images/camera3.png";

// Create map view settings - enable map repetition when scrolling horizontally
const MAP_VIEW = new MapView({repeat: true});
const ICON_MAPPING = {
    marker: {
        x: 0,           // X position in the icon image
        y: 0,           // Y position in the icon image
        width: 128,     // Width of the icon
        height: 128,    // Height of the icon
        mask: false     // Don't use mask effect
    }
};

function IncidentOverviewMap() {
    // Set initial map position and zoom level
    const INITIAL_VIEW_STATE = {
        longitude: 10.0,     // Initial longitude (X coordinate)
        latitude: 51.0,      // Initial latitude (Y coordinate)
        zoom: 5,            // Initial zoom level
        pitch: 0,           // No tilt
        bearing: 0          // No rotation
    };

    // Define map layers
    const layers = [
        // Creating base map layer using CartoDB light theme
        new TileLayer({
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
    ];

    // Return the map component with minimum required styles
    return (
        <DeckGL
            layers={layers}               // Add map layers
            views={MAP_VIEW}              // Add map view settings
            initialViewState={INITIAL_VIEW_STATE}  // Set initial position
            controller={{dragRotate: false}}       // Disable rotation
        />
    );
}

export default IncidentOverviewMap;