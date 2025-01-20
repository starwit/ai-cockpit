import {Card, CardContent, Divider, Stack, Typography} from "@mui/material";
import React from "react";

function CycloneDXViewer(props) {
    const {cycloneData} = props;

    function getUsedTools() {
        if (Array.isArray(cycloneData.metadata.tools)) {
            return <>
                {cycloneData.metadata.tools[0].name + " " + cycloneData.metadata.tools[0].version}
            </>

        } else {
            return <>{cycloneData.metadata.tools.components[0].name}</>
        }
    }

    return (
        <Card sx={{minWidth: 500}}>
            <CardContent>
                <Stack>
                    <Typography variant="h5" sx={{flexGrow: 1}} gutterBottom>
                        {cycloneData.metadata.component.name} {cycloneData.metadata.component.version}
                    </Typography>
                    <Divider />
                    <Typography>{t("transparency.sbom.generated")}: {cycloneData.metadata.timestamp}</Typography>
                    <Typography>{t("transparency.sbom.packagetype")}: {cycloneData.metadata.component.type}</Typography>
                    <Typography>{t("transparency.sbom.usedlibs")}: {cycloneData.components.length}</Typography>
                    <Typography>{t("transparency.sbom.indirectDeps")}: {cycloneData.dependencies.length}</Typography>
                    <Typography>{getUsedTools()}</Typography>
                </Stack>
            </CardContent>
        </Card>
    );

}

export default CycloneDXViewer;
