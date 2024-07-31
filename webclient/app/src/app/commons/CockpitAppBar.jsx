import HomeIcon from "@mui/icons-material/Home";
import {AppBar, Button, Container, IconButton, Toolbar, Tooltip, Typography} from "@mui/material";
import {styled} from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import React from "react";
import HorizontalNonLinearStepper from "./Stepper/Stepper";
import {useTranslation} from "react-i18next";
import Info from "@mui/icons-material/Info";
import SettingsIcon from '@mui/icons-material/Settings';
import Drawer from '@mui/material/Drawer';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'; import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import {useNavigate} from "react-router";




function CockpitAppBar() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const {t} = useTranslation();
    const navigate = useNavigate();
    const configSites = [{name: 'Actions', href: "/action-config"}, {name: 'IncidentTypes', href: "/incidenttype-config"}];

    const DrawerHeader = styled('div')(({theme}) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    }));


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
                            <Button variant="contained" size="large" onClick={() => setOpenDrawer(true)}
                                startIcon={<SettingsIcon />}>
                                <Typography>Config</Typography>
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
            <Drawer
                anchor={"right"}
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
            >
                <DrawerHeader>
                    <IconButton onClick={() => setOpenDrawer(false)}>
                        <ChevronRightIcon />
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {configSites.map((site, index) => (
                        <ListItem key={index} disablePadding onClick={() => navigate(site.href)}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <KeyboardDoubleArrowRightIcon />
                                </ListItemIcon>
                                <ListItemText primary={site.name} />
                            </ListItemButton>
                        </ListItem>

                    ))}
                </List>

            </Drawer>
        </>
    );
}

export default CockpitAppBar;
