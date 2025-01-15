import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app/App";
import * as serviceWorker from "./serviceWorker";
import {HashRouter as Router} from "react-router-dom";
import "./localization/i18n";
import {ToastContainer} from "react-toastify";
import MainTheme from "./app/assets/themes/MainTheme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
        <MainTheme>
            <App />
            <ToastContainer
                position="bottom-left"
                closeOnClick
                limit={1}
                pauseOnFocusLoss
                draggable={false}
                theme="colored"
            />
        </MainTheme>
    </Router>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
