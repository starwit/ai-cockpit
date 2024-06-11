import {Box, Button, Container, Tab, Tabs} from "@mui/material";
import React, {useState, useMemo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import TrafficIncidentRest from "../../services/TrafficIncidentRest";
import {DataGrid} from "@mui/x-data-grid";
import HorizontalNonLinearStepper from "../../commons/Stepper/Stepper";
import {trafficIncidents2, interpretationData} from "./mock/ExampleData";
import {renderActions, renderButton} from "./TrafficIncidentActions";
import TrafficIncidentDetail from "./TrafficIncidentDetail";

function TrafficIncidentOverview() {
    const {t} = useTranslation();
    const [activeStep, setActiveStep] = React.useState(0);
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
            renderCell: renderButton(t("button.action.execute")),
            disableClickEventBubbling: true
        }
    ];

    return (
        <Container sx={{margin: "1em"}} >
            <HorizontalNonLinearStepper activeStep={activeStep} setActiveStep={setActiveStep} />
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
