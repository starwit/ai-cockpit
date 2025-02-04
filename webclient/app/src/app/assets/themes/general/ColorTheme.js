import {createTheme} from "@mui/material";

const ColorTheme = createTheme({
    palette: {
        type: "light",
        primary: {
            main: "#09284f",
            contrastText: "#fff"
        },
        secondary: {
            main: "#f3f6fe",
            contrastText: "#09284f"
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
