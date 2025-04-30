import {useEffect, useMemo, useState} from "react";
import {useParams} from 'react-router';
import ModuleRest from "../services/ModuleRest";
import CockpitAppBar from "./CockpitAppBar";
import CockpitFooter from "./CockpitFooter";

function LayoutSimple({disabled = false, children}) {
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
            {children}
            <CockpitFooter />
        </>
    );
};

export default LayoutSimple;