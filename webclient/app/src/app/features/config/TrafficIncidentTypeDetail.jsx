import {
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
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
    const [isSaved, setIsSaved] = useState([true]);
    const [mitigationActionTypes, setMitigationActionTypes] = useState([]);

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
            field: "actions2",
            type: "actions",
            headerName: "Select",
            sortable: false,
            width: 100,
            renderCell: params => <MyRenderCheckBox isSelected={params.row.isSelected} actionId={params.row.id} />
        }
    ];

    function MyRenderCheckBox(props) {
        const [checked, setChecked] = useState(props.isSelected);

        function handleChange(e) {
            setChecked(e.target.checked);

            let tmpActions = mitigationActionTypes;
            tmpActions.forEach((action) => {
                if (action.id === props.actionId) {
                    action.isSelected = e.target.checked;
                    setIsSaved(false);
                }
            });

            console.log(tmpActions);
            setMitigationActionTypes(tmpActions);
        }

        return <Checkbox
            checked={checked}
            onChange={handleChange}
        />
    }

    useEffect(() => {
        reload();
    }, [open]);

    function reload() {
        mitigationActionTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            } else {
                response.data.forEach(mitigationType => {
                    mitigationType['isSelected'] = false;
                    mitigationType.trafficIncidentType.forEach(incidentType => {
                        if (incidentType.id === rowData.id) {
                            mitigationType['isSelected'] = true;
                        }
                    });
                });
            }
            setMitigationActionTypes(response.data);
        });
    }

    function saveSelection() {
        //setIsSaved(true);
        console.log(mitigationActionTypes);
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
                <Grid>
                    <Button variant="contained" color="primary" onClick={saveSelection} startIcon={<SaveIcon />}>
                        {t("trafficincidenttype.saveselect")}
                        {isSaved ? "" : "*"}
                    </Button>
                    <DataGrid
                        autoHeight
                        rows={mitigationActionTypes}
                        columns={columns}
                    />
                </Grid>
            </DialogContent>
        </Dialog>
    </>;
}

export default TrafficIncidentTypeDetail;