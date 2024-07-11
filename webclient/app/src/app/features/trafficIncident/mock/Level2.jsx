import {Box, Button, Container, Tab, Tabs} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import TrafficIncidentRest from "../../../services/TrafficIncidentRest";
import {renderButton} from "../TrafficIncidentActions";
import {renderActions, trafficIncidents2} from "../mock/ExampleData";

function Level2() {
    const {t} = useTranslation();
    const [bgcolor, setBgcolor] = React.useState("");
    const [tab, setTab] = React.useState(0);
    const trafficIncidentRest = useMemo(() => new TrafficIncidentRest(), []);
    const [trafficIncidents, setTrafficIncidents] = useState(trafficIncidents2);

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

    function handleOpen(row) {
        setOpen(true);
        setRowData(row);
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
            renderCell: renderButton("Ausführen"),
            disableClickEventBubbling: true
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
                    checkboxSelection={tab === 0}
                    disableRowSelectionOnClick

                />
            </Box>
        </Container>
    );
}

export default Level2;
