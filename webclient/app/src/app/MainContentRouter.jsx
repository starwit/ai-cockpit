import React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./features/home/Home";
import Navigation from "./commons/navigation/Navigation";

function MainContentRouter() {
    return (
        <Navigation>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/logout" component={() => {
                    window.location.href = window.location.pathname + "api/user/logout";
                    return null;
                }}/>
            </Routes>
        </Navigation>
    );
}

export default MainContentRouter;
