import {Box, Button, Container, Tab, Tabs} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import TrafficIncidentRest from "../../../services/TrafficIncidentRest";
import {renderActions} from "../TrafficIncidentActions";
import TrafficIncidentDetail from "../TrafficIncidentDetail";
import {interpretationData, trafficIncidents3} from "../mock/ExampleData";

function Level3() {
    const {t} = useTranslation();
    const [activeStep, setActiveStep] = React.useState(2);
    const [bgcolor, setBgcolor] = React.useState("");
    const [tab, setTab] = React.useState(0);
    const trafficIncidentRest = useMemo(() => new TrafficIncidentRest(), []);
    const [trafficIncidents, setTrafficIncidents] = useState(trafficIncidents3);
    const [interpretData, setInterpretData] = useState(interpretationData);

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

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        if (newValue === 1) {
            setBgcolor("grey");
        } else {
            setBgcolor("");
        }
    };

    const renderButton = params => {
        if (params.row.state === 1) {
            return;
        }
        return (
            <Button
                variant="contained"
                color="primary"
                size="small"
                style={{marginLeft: 16}}
                onClick={() => {
                    handleOpen(cellValues.row);
                }}
            >
                {params.row.desc}
            </Button>
        );
    };

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
            width: 300,
            editable: true
        },
        {
            field: "description",
            headerName: t("trafficIncident.description"),
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
                            Details
                        </Button>
                    </strong>
                );
            },
            width: 300,
            editable: true
        },
        {
            field: "mitigationAction",
            headerName: t("trafficIncident.mitigationAction"),
            description: "",
            renderCell: renderActions,
            disableClickEventBubbling: true,
            width: 400
        },
        {
            field: "actionButton",
            headerName: "",
            width: 200,
            align: "right",
            renderCell: renderButton,
            disableClickEventBubbling: true
        }
    ];

    const [open, setOpen] = React.useState(false);
    const [rowData, setRowData] = React.useState({});

    function handleClose() {
        setOpen(false);
    };

    function handleOpen(row) {
        setOpen(true);
        setRowData(row);
    }

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
                    checkboxSelection={tab === 0}
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

export default Level3;
