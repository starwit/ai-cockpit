import {Button, MenuItem, Select, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {DataGrid, GridActionsCellItem} from '@mui/x-data-grid';
import {useTranslation} from "react-i18next";
import React, {useEffect, useState, useMemo} from "react";
import MitigationActionTypeRest from "../../services/MitigationActionTypeRest";

const DropdownMenu = ({row, updateRow}) => {
    const {t} = useTranslation();

    const handleChange = (event) => {
        const newValue = event.target.value;
        updateRow(row.id, newValue);
    };

    return (
        <Select value={row.executionPolicy} onChange={handleChange}>
            <MenuItem value={"MANUAL"}>{t("mitigationactiontype.policy.manual")}</MenuItem>
            <MenuItem value={"WITHCHECK"}>{t("mitigationactiontype.policy.withcheck")}</MenuItem>
            <MenuItem value={"AUTOMATIC"}>{t("mitigationactiontype.policy.automated")}</MenuItem>
        </Select>
    );
};

function MitigationActionTypeOverview(props) {
    const {t} = useTranslation();
    const mitigationActionTypeRest = useMemo(() => new MitigationActionTypeRest, []);
    const [mitigationActionTypes, setMitigationActionTypes] = useState([]);
    const [isSaved, setIsSaved] = useState([true]);

    useEffect(function () {
        reloadMitigationActionTypes();
    }, []);

    function reloadMitigationActionTypes() {
        mitigationActionTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            console.log(response.data);
            setMitigationActionTypes(response.data);
        });
    }

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
            editable: false,
            renderCell: (params) => <DropdownMenu row={params.row} updateRow={params.updateRow} />
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 100,
            renderCell: (params) =>
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={(e) => handleDeleteClick(e, params.row)}
                    color="inherit"
                />
        }
    ];

    function updateRow(id, newValue) {
        console.log(newValue);
        const updatedRows = mitigationActionTypes.map((row) =>
            row.id === id ? {...row, executionPolicy: newValue} : row
        );
        console.log(updatedRows)
        setMitigationActionTypes(updatedRows);
    };

    const columnsWithUpdateRow = columns.map((column) => ({
        ...column,
        renderCell: column.renderCell ? (params) => column.renderCell({...params, updateRow}) : undefined,
    }));

    function addRow() {
        if (isSaved) {
            const newRow = {
                id: "",
                name: "NONE",
                description: "NONE",
                executionPolicy: 'MANUAL',
            };
            setMitigationActionTypes([...mitigationActionTypes, newRow]);
            setIsSaved(false);
        }
    };

    function handleProcessRowUpdate(newRow) {
        mitigationActionTypes.forEach(row => {
            if (row.id === newRow.id) {
                row.name = newRow.name;
                row.description = newRow.description;
                row.executionPolicy = newRow.executionPolicy;
            }
        });
        setMitigationActionTypes(mitigationActionTypes);
        setIsSaved(false);
        return newRow;
    }

    function handleProcessRowUpdateError() {
    }

    function saveAll() {
        mitigationActionTypeRest.updateList(mitigationActionTypes).then(function () {
            reloadMitigationActionTypes();
        });
        setIsSaved(true);
    };

    function handleDeleteClick(event, row) {
        mitigationActionTypeRest.delete(row.id).then(function () {
            reloadMitigationActionTypes();
        });
    };

    function debug() {
        console.log(mitigationActionTypes);
    };

    return (
        <>
            <Typography variant="h1" gutterBottom>
                {t("mitigationactiontype.heading")}
            </Typography>
            <Button variant="contained" color="primary" onClick={addRow} style={{marginBottom: '10px'}}>
                {t("mitigationactiontype.addItem")}
            </Button>
            <Button variant="contained" color="primary" onClick={saveAll} style={{marginBottom: '10px'}}>
                {t("mitigationactiontype.saveItem")}
                {isSaved ? '' : '*'}
            </Button>
            <Button variant="contained" color="primary" onClick={debug} style={{marginBottom: '10px'}}>
                Debug
            </Button>
            <DataGrid
                autoHeight
                rows={mitigationActionTypes}
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
                processRowUpdate={handleProcessRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
            />
        </>
    );
}

export default MitigationActionTypeOverview;
