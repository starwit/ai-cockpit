import {Box, Container, MenuItem, Select, Typography} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {useTranslation} from "react-i18next";
import React, {useState} from "react";

const staticRows = [
    {id: 1, name: 'Traffic Jam', description: 'Defined amount of vehicles moving slower than average', executionPolicy: 1},
    {id: 2, name: 'Accident', description: 'Traffic accident', executionPolicy: 2},
    {id: 3, name: 'Unknown', description: 'Unkown anormal situation', executionPolicy: 1},
    {id: 4, name: 'Wrong Side Driver', description: 'Vehicle driving on wrong side of the road', executionPolicy: 2},
    {id: 5, name: 'Disabled Vehicle', description: 'Vehicle not moving over a certain period of time', executionPolicy: 2},
    {id: 6, name: 'Helpless Person', description: 'Person on road segment not moving over a certain period of time', executionPolicy: 2},
    {id: 7, name: 'Dangerous Situation', description: 'AI driven situation interpretation', executionPolicy: 2}
];

const DropdownMenu = ({row, updateRow}) => {
    const {t} = useTranslation();

    const handleChange = (event) => {
        const newValue = event.target.value;
        updateRow(row.id, newValue);
    };

    return (
        <Select value={row.executionPolicy} onChange={handleChange}>
            <MenuItem value={1}>{t("mitigationactiontype.policy.manual")}</MenuItem>
            <MenuItem value={2}>{t("mitigationactiontype.policy.withcheck")}</MenuItem>
            <MenuItem value={3}>{t("mitigationactiontype.policy.automated")}</MenuItem>
        </Select>
    );
};

function MitigationActionTypeOverview(props) {
    const {t} = useTranslation();
    const [rows, setRows] = React.useState(staticRows);

    const columns = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'name',
            headerName: t("mitigationactiontype.name"),
            width: 150,
            editable: true,
        },
        {
            field: 'description',
            headerName: t("mitigationactiontype.description"),
            width: 350,
            editable: true,
        },
        {
            field: 'executionPolicy',
            headerName: t("mitigationactiontype.policy"),
            width: 180,
            editable: true,
            renderCell: (params) => <DropdownMenu row={params.row} />
        }
    ];

    const updateRow = (id, newValue) => {
        const updatedRows = rows.map((row) =>
            row.id === id ? {...row, dropdownValue: newValue} : row
        );
        setRows(updatedRows);
    };

    const columnsWithUpdateRow = columns.map((column) => ({
        ...column,
        renderCell: column.renderCell
            ? (params) => column.renderCell({...params, updateRow})
            : undefined,
    }));

    return (
        <>
            <Typography variant="h1" gutterBottom>
                {t("mitigationactiontype.heading")}
            </Typography>
            <DataGrid
                autoHeight
                rows={rows}
                columns={columnsWithUpdateRow}
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
        </>
    );
}

export default MitigationActionTypeOverview;
