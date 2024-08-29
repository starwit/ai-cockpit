import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import TransparencyFunctions from "../../services/TransparencyFunctions";
import CycloneDXViewer from "./CycloneDXViewer";

function ComponentDetailsDialog(props) {
    const transparencyFunctions = useMemo(() => new TransparencyFunctions(), []);
    const {open, moduleData, handleClose} = props;
    const [sbomList, setSbomList] = React.useState([]);

    useEffect(() => {
        reload();
    }, [open]);

    function reload() {
        let sboms = {}
        Object.entries(moduleData.sBOMLocation).map((entry) => {
            transparencyFunctions.loadSBOM(entry[1]).then(response => {
                if (response.data == null) {
                    return;
                }
                const sbomName = entry[0];
                sboms[sbomName] = response.data;
                setSbomList(sboms);
            });
        });
    }

    function test() {
        console.log(sbomList);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}>
            <DialogTitle>{moduleData.name}</DialogTitle>
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                {Object.values(sbomList).map((entry, idx) =>
                (
                    <CycloneDXViewer key={idx} cycloneData={entry} />
                )
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ComponentDetailsDialog;