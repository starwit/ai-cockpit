import {Box, Container, Tab, Tabs} from "@mui/material";
import React, {useState, useMemo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import TrafficIncidentRest from "../../services/TrafficIncidentRest";
import {DataGrid} from "@mui/x-data-grid";
import HorizontalNonLinearStepper from "../../commons/Stepper/Stepper";
import {trafficIncidents1} from "./ExampleData";
import {renderActions, renderButton} from "./DataGridInteractionComponents";

function Level1() {
    const {t} = useTranslation();
    const [bgcolor, setBgcolor] = React.useState("");
    const [activeStep, setActiveStep] = React.useState(0);
    const [tab, setTab] = React.useState(0);
    const trafficIncidentRest = useMemo(() => new TrafficIncidentRest(), []);
    const [trafficIncidents, setTrafficIncidents] = useState(trafficIncidents1);

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
            headerName: t("incidentData.columns.type"),
            width: 300,
            editable: true
        },
        {
            field: "description",
            headerName: t("trafficIncident.description"),
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
            width: 400,
            align: "right",
            renderCell: renderButton("Als erledigt kennzeichnen"),
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
                    checkboxSelection={tab === 0}
                    disableRowSelectionOnClick

                />
            </Box>
        </Container>
    );
}

export default Level1;
