import { Box, Button, Chip, Container, Tab, Tabs, Typography } from "@mui/material";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TrafficIncidentRest from "../../services/TrafficIncidentRest"
import { DataGrid } from "@mui/x-data-grid";
import HorizontalNonLinearStepper from "../../commons/Stepper/Stepper";

  
const renderActions = (params) => {
    return (
        <strong>
            {params.row.actions.map(action => (
                <Typography key={action} variant="outlined" sx={{color: 'green' }}>
                    {/*do nothing*/}
                </Typography>
            ))}
        </strong>
    )
}

const renderButton = (params) => {
    return (
        <strong>
            <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ marginLeft: 16 }}
                onClick={() => {
                    console.log("button pressed")
                }}
            >
                Als erledigt kennzeichnen
            </Button>
        </strong>
    )
}

const headers = [
    {
      field: 'incidentTime',
      type: 'datetime',
      headerName: 'Erfassungszeit',
      width: 200,
      editable: true,
    },
    {
      field: 'incidentType',
      headerName: 'Typ',
      width: 300,
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Maßnahmen',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      renderCell: renderActions,
      disableClickEventBubbling: true,
      width: 320,
    },
    {
        field: 'button',
        headerName: '',
        width: 280,
        align: 'right',
        renderCell: renderButton,
        disableClickEventBubbling: true,
    },
  ];

  const headersDone = [
    {
      field: 'incidentTime',
      type: 'datetime',
      headerName: 'Erfassungszeit',
      width: 200,
      editable: true,
    },
    {
      field: 'incidentType',
      headerName: 'Typ',
      width: 300,
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Maßnahmen',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      disableClickEventBubbling: true,
      width: 400
    },
  ];

function Level1() {
    const {t} = useTranslation();
    const [activeStep, setActiveStep] = React.useState(0);
    const [tab, setTab] = React.useState(0);
    const trafficIncidentRest = useMemo(() => new TrafficIncidentRest(), [])
    const [trafficIncidents, setTrafficIncidents] = useState([
        { id: 1, incidentTime: "2016-01-04 10:34:23", incidentType: 'Stau', actions: ['Polizei wurde benachrichtigt',' Straße wurde gesperrt']},
        { id: 2, incidentTime: "2016-01-04 10:34:23", incidentType: 'Parken auf Sperrfläche', actions: ['Auto wurde abgeschleppt']},
        { id: 3, incidentTime: "2016-01-04 10:34:23", incidentType: 'Stau', actions: ['Polizei benachrichtigen','Straße sperren']},
        { id: 4, incidentTime: "2016-01-04 10:34:23", incidentType: 'hohe Geschwindigkeit', actions: ['Polizei wurde benachrichtigt']},
        { id: 5, incidentTime: "2016-01-04 10:34:23", incidentType: 'Gefahrensituation', actions: []},
        { id: 6, incidentTime: "2016-01-04 10:34:23", incidentType: 'Gefahrensituation', actions: []},
        { id: 7, incidentTime: "2016-01-04 10:34:23", incidentType: 'Stau', actions: ['Polizei wurde benachrichtigt',' Straße wurde gesperrt']},
        { id: 8, incidentTime: "2016-01-04 10:34:23", incidentType: 'Stau', actions: ['Polizei wurde benachrichtigt',' Straße wurde gesperrt']},
        { id: 9, incidentTime: "2016-01-04 10:34:23", incidentType: 'Stau', actions: ['Polizei wurde benachrichtigt',' Straße wurde gesperrt']},
      ]);

    useEffect(() => {
        reloadTrafficIncidents();
    }, []);

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
      };

    return (
        <Container sx={{margin: "1em"}}>
            <Typography variant={"h2"} gutterBottom>
                {t("home.title")}
            </Typography>
            {t("home.welcome")}
            <HorizontalNonLinearStepper activeStep={activeStep} setActiveStep={setActiveStep} />
            <Tabs onChange={handleTabChange} value={tab}>
                <Tab label="Offen" />
                <Tab label="Erledigt" />
            </Tabs>
            {tab === 0 ? (
                    <Box sx={{ width: '100%' }}>
                        <DataGrid
                            rows={trafficIncidents}
                            columns={headers}
                            initialState={{
                            pagination: {
                                paginationModel: {
                                pageSize: 10,
                                },
                            },
                            }}
                            pageSizeOptions={[10]}
                            checkboxSelection
                            disableRowSelectionOnClick

                        />
                    </Box>
            ) : (

                    <Box sx={{ width: '100%', WebkitTextFillColor: 'grey'}}>
                        <DataGrid
                            rows={trafficIncidents}
                            columns={headersDone}
                            initialState={{
                            pagination: {
                                paginationModel: {
                                pageSize: 10,
                                },
                            },
                            }}
                            pageSizeOptions={[10]}
                        />
                    </Box>
            )}
        </Container>
    );
}

export default Level1;
