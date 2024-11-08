import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";

import {AppBar, 
        Container, 
        IconButton, 
        Toolbar, 
        Typography, 
        Button
        } from "@mui/material";

import React from "react";
import ConfigMenu from "../features/config/ConfigMenu";
import InfoMenu from "../features/info/InfoMenu";

function CockpitAppBar() {
    return (
        <>
            <Container>
                <AppBar>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            href="./"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <HomeIcon />
                        </IconButton>
                        <Typography variant="h1" component="div" sx={{flexGrow: 1}}>KI Cockpit</Typography>
                        <>
                            <Button             /* MAP BUTTON */                
                                color="inherit"
                                size="large"
                                startIcon={<MapIcon />}
                                href="./incident-map-view"
                                sx={{ mr: 1,    /* margin-right: the more is the value the further away is button from ConfigMenu */ 
                                      boxShadow: 2, 
                                      '&:hover': {

                                        backgroundColor: "primary.dark"

                                      }

                                 }}          
                                onClick={ () => {/*TODO*/} } 
                                > 
                                <Typography>Map of Incidents</Typography>
                            </Button>
                            
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
