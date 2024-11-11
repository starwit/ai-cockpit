import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";

import {
    AppBar,
    Container,
    IconButton,
    Toolbar,
    Typography,
    Tooltip
} from "@mui/material";

import React from "react";
import ConfigMenu from "../features/config/ConfigMenu";
import InfoMenu from "../features/info/InfoMenu";

function CockpitAppBar() {
    return (
        <>
            <Container>
                <AppBar>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            href="./"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <HomeIcon />
                        </IconButton>
                        <Typography variant="h1" component="div" sx={{flexGrow: 1}}>KI Cockpit</Typography>
                        <Tooltip title="Incident Map">
                            <IconButton
                                onClick={() => {/*TODO*/}}

                                href="./#/incident-map-view"
                                variant="outlined">
                                <MapIcon />
                            </IconButton>
                        </Tooltip>
                        <ConfigMenu />
                        <InfoMenu />
                    </Toolbar>
                </AppBar>
            </Container >
        </>
    );
}

export default CockpitAppBar;
