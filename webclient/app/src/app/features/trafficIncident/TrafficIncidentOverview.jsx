import {Box, Button, Container, IconButton, Tab, Tabs} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import TrafficIncidentRest from "../../services/TrafficIncidentRest";
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
    const [trafficIncidents, setTrafficIncidents] = useState(trafficIncidents2);
    const [interpretData, setInterpretData] = useState(interpretationData);
    const [open, setOpen] = React.useState(false);
    const [rowData, setRowData] = React.useState({});

    useEffect(() => {
        reloadTrafficIncidents();
    }, []);

    function reloadTrafficIncidents() {
        trafficIncidentRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            // setTrafficIncidents(response.data);
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
            editable: true
        },
        {
            field: "trafficIncidentType",
            headerName: t("trafficIncident.trafficIncidentType"),
            width: 200,
            editable: true
        },
        {
            field: "mitigationAction",
            headerName: t("trafficIncident.mitigationAction"),
            description: "",
            renderCell: renderActions,
            disableClickEventBubbling: true,
            width: 300
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

    return (
        <Container sx={{margin: "1em"}} >
            <Tabs onChange={handleTabChange} value={tab}>
                <Tab label={t("home.incidentTab.title.open")} key="tab0" />
                <Tab label={t("home.incidentTab.title.done")} key="tab1" />
            </Tabs>
            <Box sx={{width: "100%", WebkitTextFillColor: bgcolor}}>
                <DataGrid
                    rows={trafficIncidents.filter(row => row.state === tab)}
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
            <TrafficIncidentDetail
                open={open}
                handleClose={handleClose}
                rowData={rowData}
                interpretData={interpretData}
                handleRowUpdate={handleRowUpdate}
            />
        </Container>
    );
}

export default TrafficIncidentOverview;
