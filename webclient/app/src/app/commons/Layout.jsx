import {Box, Container, alpha} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useParams} from 'react-router';
import ModuleRest from "../services/ModuleRest";
import CockpitAppBar from "./CockpitAppBar";
import CockpitFooter from "./CockpitFooter";

function Layout({disabled = false, children}) {
    const {moduleId} = useParams() ?? "";
    const [moduleName, setModuleName] = useState("");
    const [applicationIdentifier, setApplicationIdentifier] = useState("");
    const moduleRest = useMemo(() => new ModuleRest(), []);

    useEffect(() => {
        if (!isNaN(moduleId))
            moduleRest.findById(moduleId).then((response) => {
                if (response.data == null) {
                    return;
                } else {
                    setModuleName(response.data.name);
                    setApplicationIdentifier(response.data.applicationIdentifier)
                }
            });
    }, [moduleId]);

    return (
        <>
            <CockpitAppBar disabled={disabled} moduleName={moduleName} applicationIdentifier={applicationIdentifier} />
            <Box sx={{
                minHeight: "100%",
                minWidth: "100%",
                padding: 0,
                margin: 0,
                position: "fixed",
                zIndex: "-2",
                backgroundImage: applicationIdentifier && `url(${window.location.pathname + "api/decision/download/app/" + applicationIdentifier + ".jpg"})`,
                backgroundColor: (theme) => theme.palette.background.bgimage,
                backgroundRepeat: 'no-repeat',
                backgroundSize: "cover"
            }}>
            </Box>
            <Box sx={{backgroundColor: (theme) => alpha(theme.palette.background.bgimage, 0.8), minHeight: "100%", minWidth: "100%", position: "fixed", zIndex: "-1"}}></Box>
            <Container sx={{paddingTop: "5em", paddingBottom: "4em"}}>
                {children}
            </Container >
            <CockpitFooter />
        </>
    );
};

export default Layout;