import { Box, Button, Chip, Container, Tab, Tabs, Typography } from "@mui/material";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TrafficIncidentRest from "../../services/TrafficIncidentRest"
import { DataGrid } from "@mui/x-data-grid";
import HorizontalNonLinearStepper from "../../commons/Stepper/Stepper";
import { trafficIncidents1 } from "./ExampleData";

  
const renderActions = (params) => {
    if (params.row.state === 0) {
        return;
    } else {
        return (
            <>
                {params.row.actions.map(action => (
                    <Typography key={action} variant="outlined" sx={{color: 'green' }}>
                        {action + ", "}
                    </Typography>
                ))}
            </>
        )
    }
}

const renderButton = (params) => {
    if (params.row.state === 1) {
        return;
    }
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

function Level1() {
    const {t} = useTranslation();
    const [bgcolor, setBgcolor] = React.useState('');
    const [activeStep, setActiveStep] = React.useState(0);
    const [tab, setTab] = React.useState(0);
    const trafficIncidentRest = useMemo(() => new TrafficIncidentRest(), [])
    const [trafficIncidents, setTrafficIncidents] = useState(trafficIncidents1);

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
        if (newValue === 1) {
            setBgcolor("grey")
        } else {
            setBgcolor("")
        }
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
                <Box sx={{ width: '100%', WebkitTextFillColor: bgcolor }}>
                    <DataGrid
                        rows={trafficIncidents.filter((row) => row.state === tab)}
                        columns={headers}
                        initialState={{
                        pagination: {
                            paginationModel: {
                            pageSize: 10,
                            },
                        },
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
