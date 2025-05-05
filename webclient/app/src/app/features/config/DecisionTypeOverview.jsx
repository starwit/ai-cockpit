import AddCircleIcon from "@mui/icons-material/AddCircle";
import Category from "@mui/icons-material/Category";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {Button, Paper, Stack, Typography} from "@mui/material";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router";
import ConfirmationDialog from "../../commons/dialog/ConfirmationDialog";
import DecisionTypeRest from "../../services/DecisionTypeRest";
import DecisionTypeDetail from "./DecisionTypeDetail";

function DecisionTypeOverview() {
    const {moduleId} = useParams();
    const {t, i18n} = useTranslation();
    const decisionTypeRest = useMemo(() => new DecisionTypeRest, []);
    const [decisionTypes, setDecisionTypes] = useState([]);
    const [isSaved, setIsSaved] = useState([true]);
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [openNotSaved, setOpenNotSaved] = React.useState(false);
    const [rowData, setRowData] = useState({});
    const [deleteRow, setDeleteRow] = useState({});
    const locale = i18n.language == "de" ? deDE : enUS

    const columns = [
        {field: "id", headerName: "ID", width: 90},
        {
            field: "name",
            headerName: t("decisiontype.name"),
            flex: 0.5,
            editable: true
        },
        {
            field: "description",
            headerName: t("decisiontype.description"),
            flex: 1,
            editable: true
        },
        {
            field: "actions",
            type: "actions",
            headerName: t("button.actions"),
            sortable: false,
            width: 100,
            renderCell: params =>
                <>
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        disabled={isNaN(moduleId)}
                        label="Delete"
                        onClick={e => handleDeleteClick(params.row)}
                        color="inherit"
                    />
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        disabled={isNaN(moduleId)}
                        label="Edit"
                        onClick={e => handleEditClick(params.row)}
                        color="inherit"
                    />
                </>
        }
    ];

    useEffect(function () {
        reloadDecisionTypes();
    }, []);

    function reloadDecisionTypes() {
        if (moduleId) {
            decisionTypeRest.findByModuleId(moduleId).then(response =>
                resetDecisionTypes(response));
        } else {
            decisionTypeRest.findAll().then(response =>
                resetDecisionTypes(response));
        }
    }

    function resetDecisionTypes(response) {
        if (response.data == null) {
            return;
        }
        setDecisionTypes(response.data);
    };


    function updateRow(id, newValue) {
        const updatedRows = decisionTypes.map(row =>
            row.id === id ? {...row, executionPolicy: newValue} : row
        );
        setDecisionTypes(updatedRows);
        setIsSaved(false);
    };

    const columnsWithUpdateRow = columns.map(column => ({
        ...column,
        renderCell: column.renderCell ? params => column.renderCell({...params, updateRow}) : undefined
    }));

    function addRow() {
        if (isSaved && moduleId) {
            const module = {
                id: Number(moduleId)
            }
            const newRow = {
                id: "",
                name: t("entry.new"),
                module: module,
                description: t("entry.new")
            };
            setDecisionTypes([...decisionTypes, newRow]);
            setIsSaved(false);
        }
    };

    function handleProcessRowUpdate(newRow) {
        if (moduleId) {
            const module = {
                id: Number(moduleId)
            }

            decisionTypes.forEach(row => {
                if (row.id === newRow.id) {
                    row.module = module;
                    row.name = newRow.name;
                    row.description = newRow.description;
                }
            });
            setDecisionTypes(decisionTypes);
            setIsSaved(false);
            return newRow;
        }

    }

    function handleProcessRowUpdateError() {
    }

    function saveAll() {
        decisionTypeRest.updateList(decisionTypes).then(reloadDecisionTypes);
        setIsSaved(true);
    };

    function handleDeleteClick(row) {
        if (row.id === "") {
            reloadDecisionTypes();
        } else {
            setOpenDelete(true);
            setDeleteRow(row);
        }
    };

    // dialog functions

    function handleEditClick(row) {
        if (!isSaved) {
            setOpenNotSaved(true);
        } else {
            setOpen(true);
        }
        setRowData(row);
    }

    function handleClose() {
        setOpen(false);
    };

    function renderDialog() {
        if (!open) {
            return null;
        }
        return <DecisionTypeDetail
            moduleId={moduleId}
            open={open}
            handleClose={handleClose}
            rowData={rowData}
        />;
    }

    function submitDelete() {
        decisionTypeRest.delete(deleteRow.id).then(
            reloadDecisionTypes);
        setDeleteRow({});
        setOpenDelete(false);
    }

    function submitSave() {
        setOpenNotSaved(false);
        saveAll();
        setOpen(true);
    }

    function renderDeleteDialog() {
        if (!openDelete) {
            return null;
        }
        return <ConfirmationDialog
            open={openDelete}
            onClose={() => {setOpenDelete(false);}}
            onSubmit={submitDelete}
            message={t("decisiontype.delete.message")}
            submitMessage={t("button.delete")}
        />;
    }

    function renderSaveDialog() {
        if (!openNotSaved) {
            return null;
        }
        return <ConfirmationDialog
            open={openNotSaved}
            onClose={() => {setOpenNotSaved(false);}}
            onSubmit={submitSave}
            message={t("decisiontype.save.message")}
            submitMessage={t("button.save")}
        />;
    }

    return <>
        <Stack direction="row" sx={{marginBottom: 1}}>
            <Typography variant="h2" gutterBottom sx={{flex: 1}}>
                <Category fontSize="small" /> {t("decisiontype.heading")}
            </Typography>
            <Button disabled={isNaN(moduleId)} variant="text" color="primary" onClick={addRow} startIcon={<AddCircleIcon />}>
                {t("decisiontype.addItem")}
            </Button>
            <Button disabled={isNaN(moduleId)} variant="text" color="primary" onClick={saveAll} startIcon={<SaveIcon />}>
                {t("decisiontype.saveItem")}
                {isSaved ? "" : "*"}
            </Button>
        </Stack>
        <Paper sx={{padding: 2}}>
            <DataGrid
                localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                rows={decisionTypes}
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
            {renderDialog()}
            {renderDeleteDialog()}
            {renderSaveDialog()}
        </Paper>
    </>;
}
export default DecisionTypeOverview;
