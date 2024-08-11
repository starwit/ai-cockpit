
import {useTranslation} from "react-i18next";
import {Typography} from "@mui/material";
import {useParams} from 'react-router-dom'
import React, {useEffect, useState, useMemo} from "react";
import TransparencyFunctions from "../../services/TransparencyFunctions";

function SBom(props) {
    const {t} = useTranslation();
    const {moduleId} = useParams()
    const transparencyFunctions = useMemo(() => new TransparencyFunctions(), []);

    useEffect(() => {
        reload();
    }, []);

    function reload() {
        transparencyFunctions.getComponentList().then(response => {
            if (response.data == null) {
                return;
            } else {
                setModuleList(response.data);
            }

        });
    }

    return <>
        <Typography variant="h1" component="div" sx={{flexGrow: 1}}>
            {t("transparency.sbom.title")}
        </Typography>
        Content for component {moduleId}
    </>;
}

export default SBom;