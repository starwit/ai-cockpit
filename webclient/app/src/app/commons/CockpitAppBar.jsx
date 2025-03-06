import ViewListIcon from '@mui/icons-material/ViewList';
import {
    AppBar,
    Container,
    Divider,
    IconButton,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import React from "react";
import {useTranslation} from 'react-i18next';
import general from "../assets/images/general_Logo.png";
import kic from "../assets/images/kic_Logo.png";
import ConfigMenu from "../features/config/ConfigMenu";
import InfoMenu from "../features/info/InfoMenu";
import AutomationSwitch from "./AutomationSwitch";
import MapMenu from "./MapMenu";

function CockpitAppBar() {
    const {t} = useTranslation();
    const themeName = import.meta.env.VITE_THEME;
    const themeMap = {general, kic};
    const DynamicLogo = themeMap[themeName];

    return (
        <>
            <Container>
                <AppBar color="secondary">
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
                        <Typography variant="h1" component="div">
                            {import.meta.env.VITE_TITLE}
                        </Typography>
                        <AutomationSwitch />
                        <Tooltip title={t('list.tooltip')}>
                            <IconButton
                                href="./"
                                size="large"
                                variant="outlined">
                                <ViewListIcon />
                            </IconButton>
                        </Tooltip>
                        <MapMenu />
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <ConfigMenu />
                        <InfoMenu />
                    </Toolbar>
                </AppBar>
            </Container >

        </>
    );
}

export default CockpitAppBar;
