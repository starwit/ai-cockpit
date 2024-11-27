import React, {useState, useEffect} from 'react';
import {MapView} from '@deck.gl/core';
import {TileLayer} from "@deck.gl/geo-layers";

import {
    BitmapLayer,
    TextLayer,
    ScatterplotLayer
} from "@deck.gl/layers";

import DeckGL from "@deck.gl/react";
//import cameraicon from "./../../assets/images/camera3.png";
import TrafficIncidentRest from '../../services/TrafficIncidentRest';

import {
    Paper,
    Typography,
    Box,
    IconButton
} from '@mui/material';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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
    const [hoveredIncidents, setHoveredIncidents] = useState(null); // To track a hover
    const trafficIncidentRest = new TrafficIncidentRest();
    const [showPanel, setShowPanel] = useState(true);

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
            }
        });
    }
    // This grouping is necessary to combine multiple incidents that occur at the same location (same coordinates)
    const groupedIncidents = trafficIncidents.reduce((acc, incident) => {
        const key = `${incident.cameraLatitude}-${incident.cameraLongitude}`;   // Create a unique key using the camera coordinates. For example: "39.78-86.15"
        if (!acc[key]) {    // If this is the first incident at these coordinates, initialize an empty array for this location
            acc[key] = [];
        }
        acc[key].push(incident);    // Add the current incident to the array for this location
        return acc;
    }, {});

    // Set initial map position and zoom level
    const INITIAL_VIEW_STATE = {
        longitude: -86.13470,     // Initial longitude (X coordinate)
        latitude: 39.91,      // Initial latitude (Y coordinate)
        zoom: 10,            // Initial zoom level
        pitch: 0,           // No tilt
        bearing: 0          // No rotation
    };

    function getIconColor(incidentCount) {
        if (incidentCount > 5) {
            return [255, 0, 0, 255]; // Red
        } else if (incidentCount === 5) {
            return [255, 255, 0, 255] // Yellow 
        } else {
            return [0, 128, 0, 255] // Green - default
        }
    }

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
        }),
        // Add layer with Incident Icons
        new ScatterplotLayer({
            id: 'scatterplot-layer',
            data: Object.entries(groupedIncidents),     // Using Object.entries to convert the grouped object to array of [key, value] pairs.

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
            // d[1][0] contains the first incident in the group (all have same coordinates)
            getPosition: d => [
                d[1][0].cameraLongitude,
                d[1][0].cameraLatitude
            ],
            getRadius: d => Math.sqrt(d[1].length) * 5,
            getFillColor: d => getIconColor(d[1].length),
            getLineColor: [0, 0, 0, 255],
            onHover: info => {
                if (info.object) {      // Check whether the user has actually pointed the cursor at an object (marker) on the map.
                    setHoveredIncidents(info.object[1]);
                }
            }
        }),
        new TextLayer({
            id: 'text-layer',
            data: Object.entries(groupedIncidents),      // Using Object.entries to convert the grouped object to array of [key, value] pairs.
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

            <IconButton
                onClick={() => setShowPanel(!showPanel)}
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: showPanel ? '320px' : '10px',
                    backgroundColor: 'white'
                }}
                size="small"
            >
                {showPanel ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>

            {showPanel && (
                <Paper
                    elevation={3}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        bottom: '10px',
                        width: '300px',
                        overflowY: 'auto',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.9)'
                    }}
                >

                    <Typography variant="h6" gutterBottom>
                        Incidents List
                    </Typography>
                    {hoveredIncidents ? (
                        <>
                            <Typography variant="subtitle1" gutterBottom>
                                Found {hoveredIncidents.length} incidents at this location
                            </Typography>
                            <Box sx={{flex: 1, overflowY: 'auto'}}>
                                {hoveredIncidents.map((incident, index) => (
                                    <Paper
                                        key={incident.id}
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            mb: 1,
                                            background: 'white'
                                        }}
                                    >
                                        <Typography variant="h6">
                                            {incident.trafficIncidentType?.name}
                                        </Typography>
                                        <Typography>
                                            Time: {new Date(incident.acquisitionTime).toLocaleString('us-US')}
                                        </Typography>
                                        <Typography>
                                            State: {incident.state || 'NEW'}
                                        </Typography>
                                        {incident.description && (
                                            <Typography>
                                                Description: {incident.description}
                                            </Typography>
                                        )}
                                    </Paper>
                                ))}
                            </Box>
                        </>
                    ) : (
                        <Typography>
                            Hover over a camera to see incidents
                        </Typography>
                    )}
                </Paper>

            )}  {/* showPanel && ...*/}

        </div>
    );
}

export default IncidentOverviewMap;