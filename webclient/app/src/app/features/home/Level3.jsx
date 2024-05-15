import {Box, Button, Chip, Container, Tab, Tabs, Typography} from "@mui/material";
import React, {useState, useMemo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import TrafficIncidentRest from "../../services/TrafficIncidentRest";
import {DataGrid} from "@mui/x-data-grid";
import HorizontalNonLinearStepper from "../../commons/Stepper/Stepper";
import {trafficIncidents3} from "./ExampleData";
import {renderActions} from "./DataGridInteractionComponents";

function Level3() {
    const {t} = useTranslation();
    const [activeStep, setActiveStep] = React.useState(2);
    const [bgcolor, setBgcolor] = React.useState("");
    const [tab, setTab] = React.useState(0);
    const trafficIncidentRest = useMemo(() => new TrafficIncidentRest(), []);
    const [trafficIncidents, setTrafficIncidents] = useState(trafficIncidents3);

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
                    console.log("button pressed");
                }}
            >
                {params.row.desc}
            </Button>
        );
    };

    const headers = [
        {
            field: "incidentTime",
            type: "datetime",
            headerName: t("incidentData.columns.captureTime"),
            width: 200,
            editable: true
        },
        {
            field: "incidentType",
            headerName: t("incidentData.columns.type"),
            width: 300,
            editable: true
        },
        {
            field: "incidentDetails",
            headerName: t("incidentData.columns.details"),
            width: 300,
            editable: true
        },
        {
            field: "actions",
            headerName: t("incidentData.columns.action"),
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

    return (
        <Container sx={{margin: "1em"}} >
            <Typography variant={"h2"} gutterBottom>
                {t("home.title")}
            </Typography>
            {t("home.welcome")}
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
                    checkboxSelection={tab === 0}
                    disableRowSelectionOnClick
                />
            </Box>
        </Container>
    );
}

export default Level3;
