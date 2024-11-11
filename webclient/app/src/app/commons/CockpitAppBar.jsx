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

import { useTranslation } from 'react-i18next';

import React from "react";
import ConfigMenu from "../features/config/ConfigMenu";
import InfoMenu from "../features/info/InfoMenu";

function CockpitAppBar() {
    const {t} = useTranslation();
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
                        <Typography variant="h1" component="div" sx={{flexGrow: 1}}>{t('home.title')}</Typography>
                        <Tooltip title={t('map.tooltip')}>
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
