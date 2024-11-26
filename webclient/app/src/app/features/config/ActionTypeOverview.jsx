import {Button, MenuItem, Select, Stack, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {useTranslation} from "react-i18next";
import React, {useEffect, useState, useMemo} from "react";
import ActionTypeRest from "../../services/ActionTypeRest";
import ConfirmationDialog from "../../commons/dialog/ConfirmationDialog";

function ActionTypeOverview() {
    const {t} = useTranslation();
    const actionTypeRest = useMemo(() => new ActionTypeRest, []);
    const [actionTypes, setActionTypes] = useState([]);
    const [isSaved, setIsSaved] = useState([true]);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteRow, setDeleteRow] = useState({});

    const columns = [
        {field: "id", headerName: "ID", width: 90},
        {
            field: "name",
            headerName: t("actiontype.name"),
            width: 150,
            editable: true
        },
        {
            field: "description",
            headerName: t("actiontype.description"),
            width: 350,
            editable: true
        },
        {
            field: "executionPolicy",
            headerName: t("actiontype.policy"),
            width: 220,
            editable: false,
            renderCell: params => <DropdownMenu row={params.row} updateRow={params.updateRow} />
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            sortable: false,
            width: 100,
            renderCell: params =>
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={e => handleDeleteClick(e, params.row)}
                    color="inherit"
                />
        }
    ];

    useEffect(function () {
        reloadActionTypes();
    }, []);

    function reloadActionTypes() {
        actionTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setActionTypes(response.data);
        });
    }

    function updateRow(id, newValue) {
        const updatedRows = actionTypes.map(row =>
            row.id === id ? {...row, executionPolicy: newValue} : row
        );
        setActionTypes(updatedRows);
        setIsSaved(false);
    };

    const columnsWithUpdateRow = columns.map(column => ({
        ...column,
        renderCell: column.renderCell ? params => column.renderCell({...params, updateRow}) : undefined
    }));

    function addRow() {
        if (isSaved) {
            const newRow = {
                id: "",
                name: "NONE",
                description: "NONE",
                executionPolicy: "MANUAL"
            };
            setActionTypes([...actionTypes, newRow]);
            setIsSaved(false);
        }
    };

    function handleProcessRowUpdate(newRow) {
        actionTypes.forEach(row => {
            if (row.id === newRow.id) {
                row.name = newRow.name;
                row.description = newRow.description;
                row.executionPolicy = newRow.executionPolicy;
            }
        });
        setActionTypes(actionTypes);
        setIsSaved(false);
        return newRow;
    }

    function handleProcessRowUpdateError() {
    }

    function saveAll() {
        actionTypeRest.updateList(actionTypes).then(function () {
            reloadActionTypes();
        });
        setIsSaved(true);
    };

    function handleDeleteClick(event, row) {
        if (row.id === "") {
            reloadActionTypes();
        } else {
            setOpenDelete(true);
            setDeleteRow(row);
        }
    };

    function submitDelete() {
        actionTypeRest.delete(deleteRow.id).then(function () {
            reloadActionTypes();
        });
        setOpenDelete(false);
        setDeleteRow({});
    };

    const DropdownMenu = ({row, updateRow}) => {
        const {t} = useTranslation();

        const handleChange = event => {
            const newValue = event.target.value;
            updateRow(row.id, newValue);
        };

        return (
            <Select value={row.executionPolicy} onChange={handleChange} sx={{width: 175, height: 40}} >
                <MenuItem value={"MANUAL"}>{t("actiontype.policy.manual")}</MenuItem>
                <MenuItem value={"WITHCHECK"}>{t("actiontype.policy.withcheck")}</MenuItem>
                <MenuItem value={"AUTOMATIC"}>{t("actiontype.policy.automated")}</MenuItem>
            </Select>
        );
    };

    function renderDeleteDialog() {
        if (!openDelete) {
            return null;
        }
        return <ConfirmationDialog
            open={openDelete}
            onClose={() => {setOpenDelete(false)}}
            onSubmit={submitDelete}
            message={t("actiontype.delete.message")}
            submitMessage={t("button.delete")}
        />;
    }

    return (
        <>
            <Typography variant="h2" gutterBottom>
                {t("actiontype.heading")}
            </Typography>
            <Stack direction="row" spacing={1} sx={{marginBottom: 1}}>
                <Button variant="contained" color="primary" onClick={addRow} startIcon={<AddCircleOutlineIcon />}>
                    {t("actiontype.addItem")}
                </Button>
                <Button variant="contained" color="primary" onClick={saveAll} startIcon={<SaveIcon />}>
                    {t("actiontype.saveItem")}
                    {isSaved ? "" : "*"}
                </Button>
            </Stack>
            <DataGrid
                autoHeight
                rows={actionTypes}
                columns={columnsWithUpdateRow}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10
                        }
                    },
                    sorting: {
                        sortModel: [{field: "id", sort: "asc"}]
                    }
                }}
                pageSizeOptions={[10]}
                disableRowSelectionOnClick
                processRowUpdate={handleProcessRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
            />
            {renderDeleteDialog()}
        </>
    );
}

export default ActionTypeOverview;
