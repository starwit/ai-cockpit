import '@mui/material/styles/styled';
import React from "react";
import MainContentRouter from "./MainContentRouter";
import {CssBaseline} from "@mui/material";
import {useTranslation} from "react-i18next";
import ErrorHandler from "./commons/errorHandler/ErrorHandler";

function App() {
    const {t} = useTranslation();

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
