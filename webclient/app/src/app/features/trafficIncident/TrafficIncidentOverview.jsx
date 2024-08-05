import {Box, Button, Container, IconButton, Tab, Tabs} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import TrafficIncidentRest from "../../services/TrafficIncidentRest";
import MitigationActionRest from "../../services/MitigationActionRest";
import {renderActions} from "./TrafficIncidentActions";
import TrafficIncidentDetail from "./TrafficIncidentDetail";
import {interpretationData} from "./mock/ExampleData";
import ErrorIcon from "@mui/icons-material/Error";
import CheckIcon from "@mui/icons-material/Check";
import {formatDateShort} from "../../commons/formatter/DateFormatter";

function TrafficIncidentOverview() {
    const {t} = useTranslation();
    const [tab, setTab] = React.useState(0);
    const [bgcolor, setBgcolor] = React.useState("");
    const trafficIncidentRest = useMemo(() => new TrafficIncidentRest(), []);
    const mitigationActionRest = useMemo(() => new MitigationActionRest(), []);
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
        });
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


    function handleSave(mitigationActions, trafficIncidentType, description, state) {
        setOpen(false);
        rowData.trafficIncidentType = trafficIncidentType;
        rowData.description = description;
        rowData.state = state;
        trafficIncidentRest.update(rowData);

        mitigationActions.forEach(mActiontype => {
            const entity = {
                name: "",
                description: "",
                trafficIncident: rowData,
                mitigationActionType: mActiontype
            };
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

    const headers = [
        {
            field: "acquisitionTime",
            type: "datetime",
            headerName: t("trafficIncident.acquisitionTime"),
            width: 200,
            editable: true,
            valueGetter: value => formatDateShort(value)
        },
        {
            field: "trafficIncidentType",
            headerName: t("trafficIncident.trafficIncidentType"),
            flex: 0.7,
            editable: true,
            valueGetter: value => value.name
        },
        {
            field: "mitigationAction",
            headerName: t("trafficIncident.mitigationAction"),
            description: "",
            renderCell: renderActions,
            disableClickEventBubbling: true,
            flex: 1.5
        },
        {
            field: "description",
            headerName: t("trafficIncident.description"),
            flex: 1.5,
            editable: true
        },
        {
            field: "actionButton",
            headerName: "",
            width: 110,
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

    function renderDialog() {
        if (!open) {
            return null;
        }
        return <TrafficIncidentDetail
            open={open}
            handleClose={handleClose}
            handleSave={handleSave}
            rowData={rowData}
            interpretData={interpretData}
            handleRowUpdate={handleRowUpdate}
        />;
    }

    return (
        <Container sx={{margin: "1em"}} >
            <Tabs onChange={handleTabChange} value={tab}>
                <Tab label={t("home.incidentTab.title.open")} key="tab0" />
                <Tab label={t("home.incidentTab.title.done")} key="tab1" />
            </Tabs>
            <Box sx={{width: "100%", WebkitTextFillColor: bgcolor}}>
                <DataGrid
                    autoHeight
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
                    disableColumnSelector
                    slots={{toolbar: GridToolbar}}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            printOptions: {disableToolbarButton: true},
                            csvOptions: {disableToolbarButton: true}
                        }
                    }}
                />
            </Box>
            {renderDialog()}
        </Container>
    );
}

export default TrafficIncidentOverview;
