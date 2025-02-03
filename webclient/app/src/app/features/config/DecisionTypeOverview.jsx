import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Category from "@mui/icons-material/Category";
import SaveIcon from "@mui/icons-material/Save";
import {Button, Container, Stack, Typography} from "@mui/material";
import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import ConfirmationDialog from "../../commons/dialog/ConfirmationDialog";
import DecisionTypeRest from "../../services/DecisionTypeRest";
import DecisionTypeDetail from "./DecisionTypeDetail";

function DecisionTypeOverview() {
    const {t} = useTranslation();
    const decisionTypeRest = useMemo(() => new DecisionTypeRest, []);
    const [decisionTypes, setDecisionTypes] = useState([]);
    const [isSaved, setIsSaved] = useState([true]);
    const [open, setOpen] = React.useState(false);
    const [openDelete, setOpenDelete] = React.useState(false);
    const [openNotSaved, setOpenNotSaved] = React.useState(false);
    const [rowData, setRowData] = useState({});
    const [deleteRow, setDeleteRow] = useState({});

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
                        label="Delete"
                        onClick={e => handleDeleteClick(params.row)}
                        color="inherit"
                    />
                    <GridActionsCellItem
                        icon={<EditIcon />}
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
        decisionTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setDecisionTypes(response.data);
        });
    }

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
        if (isSaved) {
            const newRow = {
                id: "",
                name: t("entry.new"),
                description: t("entry.new")
            };
            setDecisionTypes([...decisionTypes, newRow]);
            setIsSaved(false);
        }
    };

    function handleProcessRowUpdate(newRow) {
        decisionTypes.forEach(row => {
            if (row.id === newRow.id) {
                row.name = newRow.name;
                row.description = newRow.description;
            }
        });
        setDecisionTypes(decisionTypes);
        setIsSaved(false);
        return newRow;
    }

    function handleProcessRowUpdateError() {
    }

    function saveAll() {
        decisionTypeRest.updateList(decisionTypes).then(function () {
            reloadDecisionTypes();
        });
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
            open={open}
            handleClose={handleClose}
            rowData={rowData}
        />;
    }

    function submitDelete() {
        decisionTypeRest.delete(deleteRow.id).then(function () {
            reloadDecisionTypes();
        });
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

    return <Container sx={{paddingTop: 2}}>
        <Stack direction="row" sx={{marginBottom: 1}}>
            <Typography variant="h2" gutterBottom sx={{flex: 1}}>
                <Category fontSize="small" /> {t("decisiontype.heading")}
            </Typography>
            <Button variant="text" color="primary" onClick={addRow} startIcon={<AddCircleIcon />}>
                {t("decisiontype.addItem")}
            </Button>
            <Button variant="text" color="primary" onClick={saveAll} startIcon={<SaveIcon />}>
                {t("decisiontype.saveItem")}
                {isSaved ? "" : "*"}
            </Button>
        </Stack>
        <DataGrid
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
    </Container>;
}
export default DecisionTypeOverview;
