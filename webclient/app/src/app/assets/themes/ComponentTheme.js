import {createTheme} from "@mui/material";
import ColorTheme from "./ColorTheme";

const ComponentTheme = createTheme(ColorTheme,
    {
        components: {
            MuiContainer: {
                defaultProps: {
                    maxWidth: false
                }
            },
            MuiCard: {
                defaultProps: {
                    elevation: 10
                }
            },
            MuiFab: {
                defaultProps: {
                    color: "secondary"
                }
            },
            MuiStack: {
                defaultProps: {
                    spacing: 2
                }
            },
            MuiIconButton: {
                defaultProps: {
                    color: "inherit",
                    backgroundImage: "linear-gradient(60deg, #ed4037 0%, #f59346 100%)"
                }
            }
        }
    });
export default ComponentTheme;
