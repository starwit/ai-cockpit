import HomeIcon from "@mui/icons-material/Home";
import {AppBar, Button, Container, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import SettingsIcon from "@mui/icons-material/Settings";
import Info from "@mui/icons-material/Info";

function CockpitAppBar() {
    const {t} = useTranslation();

    return (
        <>
            <Container sx={{margin: "1em"}} >
                <AppBar>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            href="/"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <HomeIcon />
                        </IconButton>
                        <Typography variant="h1" component="div" sx={{flexGrow: 1}}>KI Cockpit</Typography>
                        <Button variant="contained" size="large"
                            startIcon={<SettingsIcon />}>
                            <Typography>{t("menu.config")}</Typography>
                        </Button>
                        <Tooltip title={t("home.about")} size="large">
                            <IconButton variant="outlined">
                                <Info />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
            </Container>
        </>
    );
}

export default CockpitAppBar;
