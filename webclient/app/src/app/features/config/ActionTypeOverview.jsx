import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import Start from "@mui/icons-material/Start";
import {Button, Paper, Stack, Typography} from "@mui/material";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import ConfirmationDialog from "../../commons/dialog/ConfirmationDialog";
import ActionTypeRest from "../../services/ActionTypeRest";
import ActionTypeSelect from "./ActionTypeSelect";
import {useParams} from "react-router";

function ActionTypeOverview() {
    const {moduleId} = useParams();
    const {t, i18n} = useTranslation();
    const actionTypeRest = useMemo(() => new ActionTypeRest, []);
    const [actionTypes, setActionTypes] = useState([]);
    const [isSaved, setIsSaved] = useState([true]);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteRow, setDeleteRow] = useState({});
    const locale = i18n.language == "de" ? deDE : enUS

    const columns = [
        {field: "id", headerName: "ID", width: 90},
        {
            field: "name",
            headerName: t("actiontype.name"),
            flex: 0.5,
            editable: true
        },
        {
            field: "description",
            headerName: t("actiontype.description"),
            flex: 1,
            editable: true
        },
        {
            field: "executionPolicy",
            headerName: t("actiontype.policy"),
            width: 300,
            editable: false,
            renderCell: params =>
                <ActionTypeSelect row={params.row} updateRow={params.updateRow} />
        },
        {
            field: "endpoint",
            headerName: t("actiontype.endpoint"),
            flex: 0.4,
            editable: true
        },
        {
            field: "actions",
            type: "actions",
            headerName: t("button.actions"),
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
        if (moduleId) {
            actionTypeRest.findByModuleId(moduleId).then(response => handleReloadActionTypes(response));
        } else {
            actionTypeRest.findAll().then(response => handleReloadActionTypes(response));
        }
    }

    function handleReloadActionTypes(response) {
        if (response.data == null) {
            return;
        }
        setActionTypes(response.data);
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
                name: t("entry.new"),
                description: t("entry.new"),
                executionPolicy: "MANUAL",
                endpoint: t("entry.new")
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
                row.endpoint = newRow.endpoint;
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

    function handleDeleteClick(e, row) {
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
            <Stack direction="row" sx={{marginBottom: 1}}>
                <Typography variant="h2" gutterBottom sx={{flex: 1}}>
                    <Start fontSize="small" /> {t("actiontype.heading")}
                </Typography>
                <Button variant="text" color="primary" onClick={addRow} startIcon={<AddCircleIcon />}>
                    {t("actiontype.addItem")}
                </Button>
                <Button variant="text" color="primary" onClick={saveAll} startIcon={<SaveIcon />}>
                    {t("actiontype.saveItem")}
                    {isSaved ? "" : "*"}
                </Button>
            </Stack >
            <Paper sx={{padding: 2}}>
                <DataGrid
                    localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                    rows={actionTypes}
                    columns={columnsWithUpdateRow}
                    resizeable={true}
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
            </Paper>
        </>
    );
}

export default ActionTypeOverview;

