import {createTheme} from "@mui/material";

const ColorTheme = createTheme({
    palette: {
        type: "light",
        primary: {
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
            contrastText: "#e93e3a"
        },
        background: {
            default: "#fefefe",
            paper: "#fff"
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
        fontFamily: "Lato, sans-serif",
        fontSize: 16,
        body1: {},
        body2: {},
        h1: {
            fontSize: "2rem",
            fontWeight: 400,
            textTransform: "uppercase"
        },
        h2: {
            fontSize: "1.7rem",
            fontWeight: 400,
            textTransform: "uppercase"
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
