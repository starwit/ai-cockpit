import HomeIcon from "@mui/icons-material/Home";
import {AppBar, Container, IconButton, Toolbar, Typography} from "@mui/material";
import React from "react";
import ConfigMenu from "../features/config/ConfigMenu";
import InfoMenu from "../features/config/InfoMenu";

function CockpitAppBar() {
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
                        <>
                            <ConfigMenu />
                            <InfoMenu />
                        </>
                    </Toolbar>
                </AppBar>
            </Container >
        </>
    );
}

export default CockpitAppBar;
