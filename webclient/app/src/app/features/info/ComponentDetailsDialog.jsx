import CloseIcon from "@mui/icons-material/Close";
import {Dialog, DialogContent, DialogTitle, IconButton, Stack} from "@mui/material";
import React, {useEffect, useMemo} from "react";
import TransparencyFunctions from "../../services/TransparencyFunctions";
import CycloneDXViewer from "./CycloneDXViewer";

function ComponentDetailsDialog(props) {
    const transparencyFunctions = useMemo(() => new TransparencyFunctions(), []);
    const {open, moduleData, handleClose} = props;
    const [sbomList, setSbomList] = React.useState([]);
    const [isLoaded, setIsLoaded] = React.useState(false);

    useEffect(() => {
        reload();
    }, [open]);

    function reload() {
        console.log("reload");
        const sboms = {}
        let size = Object.values(moduleData.sBOMLocation).length;
        Object.entries(moduleData.sBOMLocation).map((entry) => {
            transparencyFunctions.loadSBOM(moduleData.id, entry[0]).then(response => {
                if (!(response.headers['content-type'].includes("application/json"))) {
                    return;
                }
                if (response.data == null) {
                    return;
                }
                const sbomName = entry[0];
                sboms[sbomName] = response.data;
                setSbomList(sboms);
                size--;
                if (size == 0) {
                    setIsLoaded(true);
                }
            });
        });
    }

    return (
        <Dialog
            open={open && isLoaded}
            onClose={handleClose}>
            <DialogTitle>{moduleData.name}</DialogTitle>
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500]
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <Stack>
                    {Object.values(sbomList).map((entry, idx) =>
                    (
                        <CycloneDXViewer key={idx} cycloneData={entry} />
                    )
                    )}
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

export default ComponentDetailsDialog;
