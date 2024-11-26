import {
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid2,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import React, {useEffect, useState, useMemo} from "react";
import ActionTypeRest from "../../services/ActionTypeRest";
import DecisionTypeRest from "../../services/DecisionTypeRest";
import {DataGrid, GridCloseIcon} from "@mui/x-data-grid";
import {useTranslation} from "react-i18next";

function DecisionTypeDetail(props) {
    const {t} = useTranslation();
    const {open, rowData, handleClose} = props;
    const decisionTypeRest = useMemo(() => new DecisionTypeRest(), []);
    const actionTypeRest = useMemo(() => new ActionTypeRest(), []);
    const [isSaved, setIsSaved] = useState([true]);
    const [actionTypes, setActionTypes] = useState([]);

    // action Action Type List
    const columns = [
        {field: "id", headerName: "ID", width: 90},
        {
            field: "name",
            headerName: t("actiontype.name"),
            width: 150,
            editable: false
        },
        {
            field: "description",
            headerName: t("actiontype.description"),
            width: 350,
            editable: false
        },
        {
            field: "executionPolicy",
            headerName: t("actiontype.policy"),
            width: 220,
            editable: false
        },
        {
            field: "actions2",
            type: "actions",
            headerName: t("decisiontype.makeselect"),
            sortable: false,
            width: 160,
            renderCell: params => <MyRenderCheckBox isSelected={params.row.isSelected} actionId={params.row.id} />
        }
    ];

    function MyRenderCheckBox(props) {
        const [checked, setChecked] = useState(props.isSelected);

        function handleChange(e) {
            setChecked(e.target.checked);

            const tmpActions = actionTypes;
            tmpActions.forEach(action => {
                if (action.id === props.actionId) {
                    action.isSelected = e.target.checked;
                    setIsSaved(false);
                }
            });
            setActionTypes(tmpActions);
        }

        return <Checkbox
            checked={checked}
            onChange={handleChange}
        />;
    }

    useEffect(() => {
        reload();
    }, [open]);

    function reload() {
        actionTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            } else {
                response.data.forEach(actionType => {
                    actionType["isSelected"] = false;
                    actionType.decisionType.forEach(decisionType => {
                        if (decisionType.id === rowData.id) {
                            actionType["isSelected"] = true;
                        }
                    });
                });
            }
            setActionTypes(response.data);
        });
    }

    function saveSelection() {
        const dataToSave = rowData;
        const actionTypeIds = [];
        actionTypes.filter(actionType => {
            if (actionType.isSelected) {
                actionTypeIds.push({id: actionType.id});
                return actionType;
            }
        });
        dataToSave.actionType = actionTypeIds;
        decisionTypeRest.update(dataToSave).then(response => {
            // TODO error handling
            setIsSaved(true);
        });
        handleClose();
    }

    return <>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="decision-type-detail-dialog-title"
            aria-describedby="decision-type-detail-dialog-description"
            maxWidth="xl"
        >
            <DialogTitle id="decision-type-detail-dialog-title" >
                <Typography component="p" variant="h2">
                    {t("decisiontype.selectaction")}{rowData.name}
                </Typography>
            </DialogTitle>
            <IconButton
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: theme => theme.palette.grey[500]
                }}
            >
                <GridCloseIcon />
            </IconButton>
            <DialogContent id="decision-type-detail-dialog-description">
                <Grid2>
                    <DataGrid
                        autoHeight
                        rows={actionTypes}
                        columns={columns}
                    />
                    <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{marginTop: 1}}>
                        <Button variant="contained" color="primary" onClick={saveSelection} startIcon={<SaveIcon />}>
                            {t("decisiontype.saveselect")}
                            {isSaved ? "" : "*"}
                        </Button>
                    </Stack>
                </Grid2>
            </DialogContent>
        </Dialog>
    </>;
}

export default DecisionTypeDetail;
