import React from "react";
import {Route, Routes} from "react-router-dom";
import Home from "./features/home/Home";
import Navigation from "./commons/navigation/Navigation";
import Level1 from "./features/home/Level1";
import Level2 from "./features/home/Level2";
import Level3 from "./features/home/Level3";

function MainContentRouter() {
    return (
        <Navigation>
            <Routes>
                <Route path="/" element={<Level1 />} />
                <Route path="/1" element={<Level1 />} />
                <Route path="/2" element={<Level2 />} />
                <Route path="/3" element={<Level3 />} />
                <Route path="/logout" component={() => {
                    window.location.href = window.location.pathname + "api/user/logout";
                    return null;
                }}/>
            </Routes>
        </Navigation>
    );
}

export default MainContentRouter;
