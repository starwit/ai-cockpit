import {Box, Button, Container, IconButton, Tab, Tabs} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import TrafficIncidentRest from "../../services/TrafficIncidentRest";
import MitigationActionRest from "../../services/MitigationActionRest";
import {renderActions} from "./TrafficIncidentActions";
import TrafficIncidentDetail from "./TrafficIncidentDetail";
import {interpretationData, trafficIncidents2} from "./mock/ExampleData";
import ErrorIcon from "@mui/icons-material/Error";
import CheckIcon from "@mui/icons-material/Check";

function TrafficIncidentOverview() {
    const {t} = useTranslation();
    const [tab, setTab] = React.useState(0);
    const [bgcolor, setBgcolor] = React.useState("");
    const trafficIncidentRest = useMemo(() => new TrafficIncidentRest(), []);
    const mitigationActionRest =  useMemo(() => new MitigationActionRest(), []);
    const [trafficIncidents, setTrafficIncidents] = useState([]);
    const [interpretData, setInterpretData] = useState(interpretationData);
    const [open, setOpen] = React.useState(false);
    const [rowData, setRowData] = React.useState({});

    useEffect(() => {
        reloadTrafficIncidents();
    }, [open]);

    function reloadTrafficIncidents() {
        trafficIncidentRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setTrafficIncidents(response.data);
            console.log(new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(Date.now()));        });
    }

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        if (newValue === 1) {
            setBgcolor("grey");
        } else {
            setBgcolor("");
        }
    };

    function handleClose() {
        setOpen(false);
    };

    function handleSave(mitigationActions, trafficIncidentType) {
        setOpen(false);
        rowData.trafficIncidentType= trafficIncidentType;
        mitigationActions.forEach(mActiontype => {
            var entity={
                name:"",
                description:"",
                trafficIncident: rowData,
                mitigationActionType: mActiontype
            }
            mitigationActionRest.create(entity);
        });        
    };

    function handleOpen(row) {
        setOpen(true);
        setRowData(row);
    }

    function handleRowUpdate() {
        return rowData.mitigationAction;
    }

    const formatDate = (isoString) => {
        const date = new Date(isoString);

        const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
        };

        return date.toLocaleDateString('de-DE', options);
    };

    const headers = [
        {
            field: "acquisitionTime",
            type: "datetime",
            headerName: t("trafficIncident.acquisitionTime"),
            width: 230,
            editable: true,
            valueGetter: (value) => formatDate(value),
        },
        {
            field: "trafficIncidentType",
            headerName: t("trafficIncident.trafficIncidentType"),
            width: 200,
            editable: true,
            valueGetter: (value) => value.name,
        },
        {
            field: "mitigationAction",
            headerName: t("trafficIncident.mitigationAction"),
            description: "",
            renderCell: renderActions,
            disableClickEventBubbling: true,
            width: 600
        },
        {
            field: "description",
            headerName: t("trafficIncident.description"),
            width: 600,
            editable: true
        },
        {
            field: "actionButton",
            headerName: "",
            width: 100,
            align: "right",
            disableClickEventBubbling: true,
            renderCell: cellValues => {
                if (tab === 1 && cellValues.row.trafficIncidentType == "Stau") {
                    return (
                        <IconButton color="success"><CheckIcon /></IconButton>
                    );
                } else if (tab === 1) {
                    return (
                        <IconButton color="error"><ErrorIcon /></IconButton>
                    );
                }
                return (
                    <strong>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{marginLeft: 16}}
                            onClick={event => {
                                handleOpen(cellValues.row);
                            }}
                        >
                            {t("trafficIncident.button.details")}
                        </Button>
                    </strong >
                );
            }
        }
    ];

    function renderDialog(){
        if (!open) {
            return null;
        }
        return<TrafficIncidentDetail
                open={open}
                handleClose={handleClose}
                handleSave={handleSave}
                rowData={rowData}
                interpretData={interpretData}
                handleRowUpdate={handleRowUpdate}
            />
    }

    return (
        <Container sx={{margin: "1em"}} >
            <Tabs onChange={handleTabChange} value={tab}>
                <Tab label={t("home.incidentTab.title.open")} key="tab0" />
                <Tab label={t("home.incidentTab.title.done")} key="tab1" />
            </Tabs>
            <Box sx={{width: "100%", WebkitTextFillColor: bgcolor}}>
                <DataGrid
                    rows={trafficIncidents}
                    columns={headers}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10
                            }
                        }
                    }}
                    pageSizeOptions={[10]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>  
            {renderDialog()}
        </Container>
    );
}

export default TrafficIncidentOverview;
