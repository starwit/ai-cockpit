import {DataGrid, GridActionsCellItem} from "@mui/x-data-grid";
import React, {useEffect, useState, useMemo} from "react";
import {useTranslation} from "react-i18next";
import TrafficIncidentTypeRest from "../../services/TrafficIncidentTypeRest";
import MitigationActionTypeRest from "../../services/MitigationActionTypeRest";
import {Button, Stack, Typography} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TrafficIncidentTypeDetail from "./TrafficIncidentTypeDetail";
import ConfirmationDialog from "./ConfirmationDialog";


function TrafficIncidentTypeOverview(props) {
    const {t} = useTranslation();
    const trafficIncidentTypeRest = useMemo(() => new TrafficIncidentTypeRest, []);
    const mitigationActionTypeRest = useMemo(() => new MitigationActionTypeRest(), []);
    const [trafficIncidentTypes, setTrafficIncidentTypes] = useState([]);
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
            headerName: t("trafficincidenttype.name"),
            width: 150,
            editable: true
        },
        {
            field: "description",
            headerName: t("trafficincidenttype.description"),
            width: 350,
            editable: true
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
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
        reloadTrafficIncidentTypes();
    }, []);

    function reloadTrafficIncidentTypes() {
        trafficIncidentTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setTrafficIncidentTypes(response.data);
        });
    }

    function updateRow(id, newValue) {
        const updatedRows = trafficIncidentTypes.map(row =>
            row.id === id ? {...row, executionPolicy: newValue} : row
        );
        setTrafficIncidentTypes(updatedRows);
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
                description: "NONE"
            };
            setTrafficIncidentTypes([...trafficIncidentTypes, newRow]);
            setIsSaved(false);
        }
    };

    function handleProcessRowUpdate(newRow) {
        trafficIncidentTypes.forEach(row => {
            if (row.id === newRow.id) {
                row.name = newRow.name;
                row.description = newRow.description;
            }
        });
        setTrafficIncidentTypes(trafficIncidentTypes);
        setIsSaved(false);
        return newRow;
    }

    function handleProcessRowUpdateError() {
    }

    function saveAll() {
        trafficIncidentTypeRest.updateList(trafficIncidentTypes).then(function () {
            reloadTrafficIncidentTypes();
        });
        setIsSaved(true);
    };

    function handleDeleteClick(row) {
        setOpenDelete(true);
        setDeleteRow(row);
    };

    // dialog functions

    function handleEditClick(row) {
        if (!isSaved) {
            setOpenNotSaved(true);
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
        return <TrafficIncidentTypeDetail
            open={open}
            handleClose={handleClose}
            rowData={rowData}
        />;
    }

    function submitDelete() {
        trafficIncidentTypeRest.delete(deleteRow.id).then(function () {
            reloadTrafficIncidentTypes();
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
            onClose={() => {setOpenDelete(false)}}
            onSubmit={submitDelete}
            message={t("trafficincidenttype.delete.message")}
            submitMessage={t("button.delete")}
        />;
    }

    function renderSaveDialog() {
        if (!openNotSaved) {
            return null;
        }
        return <ConfirmationDialog
            open={openNotSaved}
            onClose={() => {setOpenNotSaved(false)}}
            onSubmit={submitSave}
            message={t("trafficincidenttype.save.message")}
            submitMessage={t("button.save")}
        />;
    }

    return <>
        <Typography variant="h2" gutterBottom>
            {t("mitigationactiontype.heading")}
        </Typography>
        <Stack direction="row" spacing={1} sx={{marginBottom: 1}}>
            <Button variant="contained" color="primary" onClick={addRow} startIcon={<AddCircleOutlineIcon />}>
                {t("mitigationactiontype.addItem")}
            </Button>
            <Button variant="contained" color="primary" onClick={saveAll} startIcon={<SaveIcon />}>
                {t("mitigationactiontype.saveItem")}
                {isSaved ? "" : "*"}
            </Button>
        </Stack>
        <DataGrid
            autoHeight
            rows={trafficIncidentTypes}
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
    </>;
}
export default TrafficIncidentTypeOverview;
