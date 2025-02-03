import MapIcon from "@mui/icons-material/Map";

import {
    AppBar,
    Container,
    Divider,
    IconButton,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";

import {useTranslation} from 'react-i18next';

import React from "react";
import general from "../assets/images/general_Logo.png";
import kic from "../assets/images/kic_Logo.png";
import ConfigMenu from "../features/config/ConfigMenu";
import InfoMenu from "../features/info/InfoMenu";
import ViewListIcon from '@mui/icons-material/ViewList';

function CockpitAppBar() {
    const {t} = useTranslation();
    const themeName = import.meta.env.VITE_THEME;
    const themeMap = {general, kic};
    const DynamicLogo = themeMap[themeName];
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
                            <img src={DynamicLogo} height={40} alt="KI-Cockpit" />
                        </IconButton>
                        <Typography variant="h1" component="div" sx={{flexGrow: 1}}>{import.meta.env.VITE_TITLE}</Typography>
                        <Tooltip title={t('list.tooltip')}>
                            <IconButton
                                href="./"
                                size="large"
                                variant="outlined">
                                <ViewListIcon />
                            </IconButton>
                        </Tooltip >
                        <Tooltip title={t('map.tooltip')}>
                            <IconButton
                                onClick={() => {/*TODO*/}}
                                href="./#/decision-map-view"
                                size="large"
                                variant="outlined">
                                <MapIcon />
                            </IconButton>
                        </Tooltip >
                        <Divider orientation="vertical" variant="middle" flexItem></Divider>
                        <ConfigMenu />
                        <InfoMenu />
                    </Toolbar >
                </AppBar >
            </Container >
        </>
    );
}

export default CockpitAppBar;
