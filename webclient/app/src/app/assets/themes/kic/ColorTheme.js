import {createTheme} from "@mui/material";

const ColorTheme = createTheme({
    palette: {
        type: "light",
        primary: {
            //main: "#f48326",
            main: "#07437F",
            contrastText: "#fff"
        },
        error: {
            main: "#e93e3a"
        },
        success: {
            main: "#2B8753"
        },
        warning: {
            main: "#f48326"
        },
        info: {
            main: "#07437F"
            //main: "#233A59"
            //main: "#25649C"
        },
        secondary: {
            main: "#eee",
            contrastText: "#f48326"
        },
        background: {
            default: "#fefefe",
            paper: "#fff",
            lightdark: "#cecece",
            light: "#fff"
        },
        line: {
            width: 4
        }
    },

    mixins: {
        toolbar: {
            minHeight: 48
        }
    },

    typography: {
        useNextVariants: true,
        fontFamily: "Arial, sans-serif",
        fontSize: 16,
        body1: {},
        body2: {},
        h1: {
            fontSize: "32px",
            fontWeight: 400,
        },
        h2: {
            fontSize: "1.4em",
            fontWeight: 400,
            textTransform: ""
        },
        h3: {
            fontSize: "1.7rem",
            fontWeight: 400
        },
        h5: {
            fontSize: "1.2rem"
        },
        h6: {
            fontSize: "1.2rem",
            fontWeight: 800,
            marginBottom: 5
        }
    },

    shape: {
        borderRadius: 0
    },

    overrides: {}

});

export default ColorTheme;
