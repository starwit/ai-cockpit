import {MapView} from "@deck.gl/core";
import {TileLayer} from "@deck.gl/geo-layers";
import {BitmapLayer, IconLayer} from "@deck.gl/layers";
import DeckGL from "@deck.gl/react";
import cameraicon from "./../../assets/images/camera3.png";

const MAP_VIEW = new MapView({repeat: true});
const ICON_MAPPING = {
    marker: {x: 0, y: 0, width: 128, height: 128, mask: false}
};

function TrafficIncidentMap(props) {
    const {latitude, longitude} = props;
    const INITIAL_VIEW_STATE = {
        longitude: longitude,
        latitude: latitude,
        zoom: 15,
        pitch: 0,
        bearing: 0
    };

    const layers = [
        new TileLayer({
            data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
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
        }),
        new IconLayer({
            id: "icon-layer",
            data: [INITIAL_VIEW_STATE],
            pickable: true,
            iconAtlas: cameraicon,
            iconMapping: ICON_MAPPING,
            getIcon: d => "marker",

            sizeScale: 10,
            getPosition: d => {
                const c = [2];
                c[0] = d.longitude ?? 91;
                c[1] = d.latitude ?? 181;
                return c;
            },
            getSize: d => 5,
            getColor: d => [Math.sqrt(d.exits), 140, 0]
        })
    ];

    return (
        <>
            <DeckGL
                layers={layers}
                views={MAP_VIEW}

                initialViewState={INITIAL_VIEW_STATE}
                controller={{dragRotate: false}}
            >
            </DeckGL >
        </>
    );
}

export default TrafficIncidentMap;

