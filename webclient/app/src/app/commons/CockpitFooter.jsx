import {
    AppBar,
    Container,
    Toolbar,
    Typography,
} from "@mui/material";

import logo2 from "../assets/images/logo_red.png";
import {useTranslation} from 'react-i18next';
import React from "react";

function CockpitFooter() {
    const {t} = useTranslation();
    return (
        <Container color="secondary">
            <AppBar color="secondary" sx={{position: "fixed", top: "auto", bottom: 0}}>
                <Toolbar sx={{justifyContent: "center"}}>
                    <img src={logo2} height={30} alt="LI-Cockpit" />
                    <Typography sx={{marginLeft: 1}}>{t('home.copyright')}</Typography>
                </Toolbar >
            </AppBar>
        </Container >
    );
}

export default CockpitFooter;
