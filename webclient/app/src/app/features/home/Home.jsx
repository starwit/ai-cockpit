import { Box, Container, Typography } from "@mui/material";
import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TrafficIncidentRest from "../../services/TrafficIncidentRest"
import HorizontalLinearStepper from "../../commons/Stepper/Stepper";
import { DataGrid } from "@mui/x-data-grid";

const headers = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 150,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
  ];
  

function Home() {
    const {t} = useTranslation();
    const trafficIncidentRest = useMemo(() => new TrafficIncidentRest(), [])
    const [trafficIncidents, setTrafficIncidents] = useState([
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
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


    return (
        <Container>
            <Typography variant={"h2"} gutterBottom>
                {t("home.title")}
            </Typography>
            {t("home.welcome")}
            <HorizontalLinearStepper />
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={trafficIncidents}
                    columns={headers}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 5,
                        },
                    },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                />
            </Box>
        </Container>
    );
}

export default Home;
