import HomeIcon from "@mui/icons-material/Home";
import {AppBar, Button, Container, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import React from "react";
import HorizontalNonLinearStepper from "./Stepper/Stepper";
import {useTranslation} from "react-i18next";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import Info from "@mui/icons-material/Info";

function CockpitAppBar() {
    const [activeStep, setActiveStep] = React.useState(0);
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
                        <Tooltip title={t("autonomyLevel.change.title")}>
                            <Button variant="contained" size="large" color="error"
                                startIcon={<HdrAutoIcon />}>
                                <Typography>Autonomielevel</Typography>
                            </Button>
                        </Tooltip>
                        <Tooltip title={t("home.about")} size="large">
                            <IconButton variant="outlined">
                                <Info />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
            </Container>
            <Container sx={{marginTop: "4em"}} >
                <HorizontalNonLinearStepper activeStep={activeStep} setActiveStep={setActiveStep} sx={{margin: "1em", marginTop: "5em"}} />
            </Container>
        </>
    );
}

export default CockpitAppBar;
