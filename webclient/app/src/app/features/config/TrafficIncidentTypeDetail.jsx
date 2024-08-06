import {
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from "@mui/material";
import React, {useEffect, useState, useMemo} from "react";
import MitigationActionTypeRest from "../../services/MitigationActionTypeRest";
import TrafficIncidentTypeRest from "../../services/TrafficIncidentTypeRest";
import {DataGrid, GridCloseIcon} from "@mui/x-data-grid";
import {useTranslation} from "react-i18next";


function TrafficIncidentTypeDetail(props) {
    const {t} = useTranslation();
    const {open, rowData, handleClose} = props;
    const trafficIncidentTypeRest = useMemo(() => new TrafficIncidentTypeRest(), []);
    const mitigationActionTypeRest = useMemo(() => new MitigationActionTypeRest(), []);
    const [allMitigationActionType, setAllMitigationActionType] = useState([]);

    // Mitigation Action Type List
    const columns = [
        {field: "id", headerName: "ID", width: 90},
        {
            field: "name",
            headerName: t("mitigationactiontype.name"),
            width: 150,
            editable: false
        },
        {
            field: "description",
            headerName: t("mitigationactiontype.description"),
            width: 350,
            editable: false
        },
        {
            field: "executionPolicy",
            headerName: t("mitigationactiontype.policy"),
            width: 220,
            editable: false
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            sortable: false,
            width: 100,
            renderCell: params => {
                let checked = false;
                params.row.trafficIncidentType.forEach(type => {
                    if (type.id === rowData.id) {
                        checked = true;
                    }
                });
                return <Checkbox checked={checked} />
            }
        }
    ];

    useEffect(() => {
        reload();
    }, [open]);

    if (!open) {
        return null;
    }

    function reload() {
        mitigationActionTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setAllMitigationActionType(response.data);
        });
    }

    return <>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="traffic-incident-type-detail-dialog-title"
            aria-describedby="traffic-incident-type-detail-dialog-description"
            maxWidth="xl"
        >
            <DialogTitle id="traffic-incident-type-detail-dialog-title" >
                <Typography component="span" variant="h4">
                    {t("trafficincidenttype.selectaction")}
                    {rowData.name}
                </Typography>
            </DialogTitle>
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <GridCloseIcon />
            </IconButton>
            <DialogContent id="traffic-incident-type-detail-dialog-description">
                <DataGrid
                    autoHeight
                    rows={allMitigationActionType}
                    columns={columns}
                />
            </DialogContent>
        </Dialog>
    </>;
}

export default TrafficIncidentTypeDetail;