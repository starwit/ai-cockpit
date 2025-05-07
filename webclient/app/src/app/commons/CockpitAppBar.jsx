import ViewListIcon from '@mui/icons-material/ViewList';
import {
    AppBar,
    Button,
    Container,
    Divider,
    IconButton,
    Link,
    Stack,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import React from "react";
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router';
import general from "../assets/images/general_Logo.png";
import kic from "../assets/images/kic_Logo.png";
import ConfigMenu from "../features/config/ConfigMenu";
import InfoMenu from "../features/info/InfoMenu";
import AutomationSwitch from "./AutomationSwitch";
import MapMenu from "./MapMenu";
import LogoutIcon from '@mui/icons-material/Logout';


function CockpitAppBar(props) {
    const {moduleId} = useParams() ?? "";
    const {disabled, moduleName, applicationIdentifier} = props;
    const {t} = useTranslation();
    const themeName = import.meta.env.VITE_THEME;
    const themeMap = {general, kic};
    const DynamicLogo = themeMap[themeName];

    return (
        <>
            <Container>
                <AppBar color="secondary">
                    <Toolbar>
                        <Stack
                            direction="row"
                            sx={{justifyContent: "flex-start"}}
                        >
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
                            <Typography variant="h1" component="div" noWrap>
                                {import.meta.env.VITE_TITLE}
                            </Typography>
                            {applicationIdentifier && moduleName &&
                                (<>
                                    <Button
                                        href="./"
                                        variant="h3"
                                        color='warning'
                                    >
                                        <Typography variant="button" noWrap>
                                            {t('module.appbar')}: {applicationIdentifier} / {moduleName}
                                        </Typography>
                                    </Button>
                                </>
                                )

                            }
                        </Stack>
                        <Stack
                            direction="row" spacing={0}
                            sx={{justifyContent: "right", flex: 1}}

                        >
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
                            <Divider orientation="vertical" variant="middle" flexItem />
                            <IconButton href="./logout" size="large">
                                <LogoutIcon/>
                            </IconButton>
                        </Stack>
                    </Toolbar>
                </AppBar>
            </Container >

        </>
    );
}

export default CockpitAppBar;
