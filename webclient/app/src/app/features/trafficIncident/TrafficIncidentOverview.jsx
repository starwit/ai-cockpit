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
import FiberNewIcon from '@mui/icons-material/FiberNew';

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
    const [visibleRows, setVisibleRows] = React.useState({});

    useEffect(() => {
        reloadTrafficIncidents();
    }, [open, tab]);

    function reloadTrafficIncidents() {
        trafficIncidentRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setTrafficIncidents(response.data);
            if (tab === 0) {
                setTrafficIncidents(response.data.filter(incident => incident.state == null || incident.state == "NEW"))
            }
            if (tab === 1) {
                setTrafficIncidents(response.data.filter(incident => incident.state == "ACCEPTED" || incident.state == "REJECTED"))
            }
        });
    }

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        if (newValue === 1) {
            setBgcolor("grey");
            setVisibleRows({
                state: false
            });
        } else {
            setBgcolor("");
            setVisibleRows({});
        }
    };

    function handleClose() {
        setOpen(false);
    };

    function handleSave(mitigationActionTypes, trafficIncidentType, description, state) {
        const foundIncident = trafficIncidents.find(value => value.id == rowData.id);
        foundIncident.trafficIncidentType = trafficIncidentType;
        foundIncident.description = description;
        foundIncident.state = state;
        const remoteFunctions = [];

        const newActions = mitigationActionTypes;

        let newActionTypes = mitigationActionTypes;
        rowData.mitigationAction.forEach(action => {
            const found = mitigationActionTypes.find(value => value.id == action.mitigationActionType.id);
            if (found === undefined) {
                remoteFunctions.push(mitigationActionRest.delete(action.id));
            } else {
                newActionTypes = newActionTypes.filter(value => value.id !== action.mitigationActionType.id);
                newActions.push(action);
            }
        });

        newActionTypes.forEach(mActiontype => {
            const entity = {
                name: "",
                description: "",
                trafficIncident: {id: rowData.id},
                mitigationActionType: mActiontype
            };
            remoteFunctions.push(mitigationActionRest.create(entity));
        });

        trafficIncidentRest.update(foundIncident).then(response => {
            Promise.all(remoteFunctions).then(() => {
                setOpen(false);
            });
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
            field: "state",
            headerName: t("trafficIncident.state"),
            width: 70,
            editable: false,
            renderCell: cellValues => {
                if (tab === 1 && cellValues.row.state == "ACCEPTED") {
                    return (
                        <IconButton color="success"><CheckIcon /></IconButton>
                    );
                } else if (tab === 1 && cellValues.row.state == "REJECTED") {
                    return (
                        <IconButton color="error"><ErrorIcon /></IconButton>
                    );
                } else if (tab === 0 && (cellValues.row.state == "NEW" || cellValues.row.state == null)) {
                    return (
                        <FiberNewIcon color="grey"></FiberNewIcon>
                    );
                }

            }
        },
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
        <>
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
                        },
                        columns: {
                            columnVisibilityModel: {visibleRows}
                        },
                    }}
                    pageSizeOptions={[10]}
                    disableRowSelectionOnClick
                    isCellEditable={(params) => tab == 0 ? true : false}
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
        </>
    );
}

export default TrafficIncidentOverview;
