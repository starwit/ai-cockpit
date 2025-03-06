import '@mui/material/styles/styled';
import React from "react";
import MainContentRouter from "./MainContentRouter";
import {CssBaseline} from "@mui/material";
import ErrorHandler from "./commons/errorHandler/ErrorHandler";

function App() {
    return (
        <React.Fragment>
            <ErrorHandler>
                <CssBaseline />
                <MainContentRouter />
            </ErrorHandler>
        </React.Fragment>
    );
}

export default App;
