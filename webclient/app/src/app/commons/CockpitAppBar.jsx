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
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from 'react-i18next';
import general from "../assets/images/general_Logo.png";
import kic from "../assets/images/kic_Logo.png";
import ConfigMenu from "../features/config/ConfigMenu";
import InfoMenu from "../features/info/InfoMenu";
import AutomationSwitch from "./AutomationSwitch";
import MapMenu from "./MapMenu";
import {useParams} from 'react-router';
import ModuleRest from '../services/ModuleRest';


function CockpitAppBar(props) {
    const {moduleId} = useParams() ?? "";
    const {disabled} = props;
    const {t} = useTranslation();
    const [moduleName, setModuleName] = useState("");
    const themeName = import.meta.env.VITE_THEME;
    const themeMap = {general, kic};
    const DynamicLogo = themeMap[themeName];
    const moduleRest = useMemo(() => new ModuleRest(), []);

    useEffect(() => {
        if (!isNaN(moduleId))
            moduleRest.findById(moduleId).then((response) => {
                if (response.data == null) {
                    return;
                } else {
                    setModuleName(response.data.name);
                }
            });
    }, [moduleId]);

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
                            sx={{margin: 0, padding: 0, marginRight: 2}}
                        >
                            <img src={DynamicLogo} height={40} alt="KI-Cockpit" />
                        </IconButton>
                        <Typography variant="h1" component="div">
                            {import.meta.env.VITE_TITLE}
                        </Typography>
                        <Typography variant="h3" component="div" marginLeft={2}>
                            {moduleName}
                        </Typography>
                        <AutomationSwitch />
                        <Tooltip title={t('list.tooltip')}>
                            <IconButton
                                href={"#/decision/" + moduleId}
                                size="large"
                                variant="outlined"
                                disabled={disabled}
                            >
                                <ViewListIcon />
                            </IconButton>
                        </Tooltip>
                        <MapMenu moduleId={moduleId} disabled={disabled} />
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <ConfigMenu moduleId={moduleId} disabled={disabled} />
                        <InfoMenu />
                    </Toolbar>
                </AppBar>
            </Container >

        </>
    );
}

export default CockpitAppBar;
