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

import {useTranslation} from 'react-i18next';

import React from "react";
import logo from "../assets/images/KICockpit_White.png";
import logo2 from "../assets/images/KICockpit_FullColour.png";
import ConfigMenu from "../features/config/ConfigMenu";
import InfoMenu from "../features/info/InfoMenu";

function CockpitAppBar() {
    const {t} = useTranslation();
    return (
        <>
            <Container>
                <AppBar color="secondary" >
                    {/*<AppBar sx={{mr: 2, backgroundImage: "linear-gradient(60deg, #ed4037 0%, #f59346 100%)"}}>*/}
                    <Toolbar>

                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            href="./"
                            aria-label="menu"
                            sx={{m: 0, p: 0, mr: 2}}
                        >
                            <img src={logo2} height={40} alt="LI-Cockpit" />
                        </IconButton>
                        <Typography variant="h1" component="div" sx={{flexGrow: 1}}>{t('home.title')}</Typography>
                        <Tooltip title={t('map.tooltip')}>
                            <IconButton
                                onClick={() => {/*TODO*/}}

                                href="./#/decision-map-view"
                                variant="outlined">
                                <MapIcon />
                            </IconButton>
                        </Tooltip >
                        <ConfigMenu />
                        <InfoMenu />
                    </Toolbar >
                </AppBar >
            </Container >
        </>
    );
}

export default CockpitAppBar;
