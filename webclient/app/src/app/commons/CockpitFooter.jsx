import {
    AppBar,
    Container,
    Toolbar,
    Typography,
} from "@mui/material";

import general from "../assets/images/general_LogoFooter.png";
import kic from "../assets/images/kic_LogoFooter.png";
import {useTranslation} from 'react-i18next';
import React from "react";

function CockpitFooter() {

    const themeName = import.meta.env.VITE_THEME;
    const themeMap = {general, kic};
    const DynamicLogo = themeMap[themeName];
    const {t} = useTranslation();
    return (
        <Container color="secondary">
            <AppBar color="secondary" sx={{position: "fixed", top: "auto", bottom: 0}}>
                <Toolbar sx={{justifyContent: "center"}}>
                    <img src={DynamicLogo} height={30} alt="LI-Cockpit" />
                    <Typography sx={{marginLeft: 1}}>{t('home.copyright')}</Typography>
                </Toolbar >
            </AppBar>
        </Container >
    );
}

export default CockpitFooter;
