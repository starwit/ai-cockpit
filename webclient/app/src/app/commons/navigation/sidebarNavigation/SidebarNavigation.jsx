import {
    Box,
    CssBaseline
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function SidebarNavigation(props) {
    const drawerWidth = 240;
    const {t} = useTranslation();
    const navigate = useNavigate();

    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{display: "flex", height: "100%"}}>
            <CssBaseline />
            <Box component="main" sx={{flexGrow: 1}}>
                {props.children}
            </Box>
        </Box>
    );
}

export default SidebarNavigation;
