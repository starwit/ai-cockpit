import React from "react";
import {ThemeProvider} from "@mui/material";
import general from "./general/ComponentTheme";
import kic from "./kic/ComponentTheme";


function MainTheme(props) {
    const themeName = import.meta.env.VITE_THEME;
    const themeMap = {general, kic};
    const DynamicTheme = themeMap[themeName];
    return (
        <ThemeProvider theme={DynamicTheme}>
            {props.children}

        </ThemeProvider>
    )
}

export default MainTheme;
