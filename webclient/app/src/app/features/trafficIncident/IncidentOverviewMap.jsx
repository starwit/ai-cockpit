import React, {useState, useEffect} from 'react';
import {MapView} from '@deck.gl/core';
import {TileLayer} from "@deck.gl/geo-layers";
import {BitmapLayer, IconLayer} from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import cameraicon from "./../../assets/images/camera3.png";
import TrafficIncidentRest from '../../services/TrafficIncidentRest';

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
    // Add state to store incidents
    const [trafficIncidents, setTrafficIncidents] = useState([]);
    const trafficIncidentRest = new TrafficIncidentRest();

    useEffect(() => {
        reloadTrafficIncidents();
        const interval = setInterval(reloadTrafficIncidents, 5000); // Update alle 5 Sekunden
        return () => clearInterval(interval);
    }, []);

    //Load Incidents
    function reloadTrafficIncidents() {
        trafficIncidentRest.findAll().then(response => {
            if (response.data) {
                setTrafficIncidents(response.data);
                console.log("Loaded incidents:", response.data);
            }
        });
    }

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
            data: "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
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
        }),
        // Add layer with Incident Icons
        new IconLayer({
            id: 'icon-layer',
            data: trafficIncidents,
            pickable: true,
            iconAtlas: cameraicon,
            iconMapping: ICON_MAPPING,
            getIcon: d => "marker",
            sizeScale: 10,
            getPosition: d => [
                d.cameraLongitude,
                d.cameraLatitude
            ],
            getSize: d => 5
        })
    ];



    // Return the map component with minimum required styles
    return (
        //There is a bug for Brave Browser v1.71.123 after removing `div` container with CSS-styling. 
        //Otherwise this code works for other browsers without `div`. 
        //<Container disableGutters> <DeckGL ... /> </Container> didn't help either.
        <div style={{height: 'calc(100vh - 64px)', position: 'relative'}}>
            <DeckGL
                layers={layers}               // Add map layers
                views={MAP_VIEW}              // Add map view settings
                initialViewState={INITIAL_VIEW_STATE}  // Set initial position
                controller={{dragRotate: false}}       // Disable rotation
            />
        </div>
    );
}

export default IncidentOverviewMap;