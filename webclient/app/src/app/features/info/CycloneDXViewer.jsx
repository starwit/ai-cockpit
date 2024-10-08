import {Card, Divider, List, ListItem, Typography} from "@mui/material";
import React from "react";

function CycloneDXViewer(props) {
    const {cycloneData} = props;

    return (
        <Card sx={{minWidth: 500}}>
            <Typography variant="h5" component="div" sx={{flexGrow: 1}} gutterBottom>
                {cycloneData.metadata.component.name} {cycloneData.metadata.component.version}
            </Typography>
            <Divider />
            <List>
                <ListItem>Generated at: {cycloneData.metadata.timestamp}</ListItem>
                <ListItem>Package type: {cycloneData.metadata.component.type}</ListItem>
                <ListItem>Used libraries: {cycloneData.components.length}</ListItem>
                <ListItem>Indirect dependencies: {cycloneData.dependencies.length}</ListItem>
                <ListItem>Generated with: {cycloneData.metadata.tools[0].name} {cycloneData.metadata.tools[0].version}</ListItem>
            </List>

        </Card>
    );

}

export default CycloneDXViewer;
