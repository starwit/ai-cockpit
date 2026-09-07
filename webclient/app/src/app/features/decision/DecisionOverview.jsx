import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import NearbyError from "@mui/icons-material/NearbyError";
import {Box, Button, CircularProgress, Container, IconButton, Paper, Stack, Tab, Tabs, Typography} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {deDE, enUS} from '@mui/x-data-grid/locales';
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {formatDateShort} from "../../commons/formatter/DateFormatter";
import DecisionRest from "../../services/DecisionRest";
import ActionRest from "../../services/ActionRest";
import ActionTypeRest from "../../services/ActionTypeRest";
import {renderActions} from "./DecisionActions";
import DecisionDetail from "./DecisionDetail";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useParams} from "react-router";


function DecisionOverview() {
    const {moduleId} = useParams();
    const {t, i18n} = useTranslation();
    const [tab, setTab] = React.useState(0);
    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
        description: false
    });
    const decisionRest = useMemo(() => new DecisionRest(), []);
    const actionRest = useMemo(() => new ActionRest(), []);
    const actionTypeRest = useMemo(() => new ActionTypeRest(), []);
    const [hasCvatAction, setHasCvatAction] = useState(false);
    const [selectedDecisions, setSelectedDecisions] = useState([]);
    const [newDecisions, setNewDecisions] = useState([]);
    const [readyForCvatDecisions, setReadyForCvatDecisions] = useState([]);
    const [doneDecisions, setDoneDecisions] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [rowData, setRowData] = React.useState({});
    const [automaticNext, setAutomaticNext] = React.useState(false);
    const [exporting, setExporting] = useState(false);
    const locale = i18n.language == "de" ? deDE : enUS
    const pageSize = 10;
    const decisionsByTab = hasCvatAction
        ? [newDecisions, readyForCvatDecisions, doneDecisions]
        : [newDecisions, doneDecisions];
    const activeTab = Math.min(tab, decisionsByTab.length - 1);


    useEffect(() => {
        setTab(0);
        setHasCvatAction(false);
        if (moduleId) {
            actionTypeRest.findByModuleId(moduleId).then(response => {
                setHasCvatAction(response.data.some(actionType =>
                    actionType.executionPolicy == "MANUAL" && actionType.endpoint == "cvat"
                ));
            });
        }
    }, [moduleId]);

    useEffect(() => {
        reloadDecisions();
        const interval = setInterval(reloadDecisions, 5000); // Update alle 5 Sekunden
        return () => clearInterval(interval);
    }, [open, tab, moduleId, hasCvatAction]);

    function reloadDecisions() {
        if (moduleId) {
            decisionRest.findByModuleId(moduleId).then(response => handleLoadDecisions(response));
        } else {
            decisionRest.findAll().then(response => handleLoadDecisions(response));
        }
    }

    function handleLoadDecisions(response) {
        if (response.data == null) {
            return;
        }
        const sortedData = response.data.sort((a, b) => new Date(b.acquisitionTime) - new Date(a.acquisitionTime));
        const reviewedDecisions = sortedData.filter(
            decision => decision.state == "ACCEPTED" || decision.state == "REJECTED"
        );
        const readyForCvat = reviewedDecisions.filter(isReadyForCvat);
        setNewDecisions(sortedData.filter(decision => decision.state == null || decision.state == "NEW"));
        setReadyForCvatDecisions(hasCvatAction ? readyForCvat : []);
        setDoneDecisions(hasCvatAction
            ? reviewedDecisions.filter(decision => !isReadyForCvat(decision))
            : reviewedDecisions);
    }

    function isReadyForCvat(decision) {
        return decision.state == "ACCEPTED" && decision.action.some(action =>
            action.state == "NEW"
            && action.actionType.executionPolicy == "MANUAL"
            && action.actionType.endpoint == "cvat"
        );
    }

    function handleActionExecution() {
        actionRest.retryActionExecution()
    }

    function handleCvatExport() {
        setExporting(true);
        actionRest.exportCvat(moduleId)
            .then(() => reloadDecisions())
            // Export errors are toasted by the global ErrorHandler.
            .catch(() => {})
            .finally(() => setExporting(false));
    }

    function handleTabChange(_event, newValue) {
        setTab(newValue);
    };

    function handleNext(data, index) {
        const nextIndex = index + 1;
        if (nextIndex < data.length) {
            setRowData(data[nextIndex]);
        } else {
            setRowData(data[0]);
        }
    }

    function handleBefore(data, index) {
        const nextIndex = index - 1;
        if (nextIndex >= 0) {
            setRowData(data[nextIndex]);
        } else {
            setRowData(data[data.length - 1]);
        }
    }

    function toggleAutomaticNext() {
        setAutomaticNext(!automaticNext);
    }

    function handleClose() {
        setOpen(false);
    };

    function handleSave(actionTypes, decisionType, description, state) {
        const foundDecision = getData().find(value => value.id == rowData.id);
        const actionTypeIds = actionTypes.map(actionType => actionType['id'])
        foundDecision.decisionType = decisionType;
        foundDecision.description = description;
        foundDecision.state = state;

        decisionRest.updateWithActions(foundDecision, actionTypeIds).then(() => {
            if (automaticNext) {
                handleNext(getData(), getData().findIndex(value => value.id == rowData.id));
            } else {
                setOpen(false);
            }
        });
    };

    function handleOpen(row) {
        setOpen(true);
        setSelectedDecisions(decisionsByTab[activeTab]);
        setRowData(row);
    }

    function getData() {
        return selectedDecisions;
    }

    const headers = [
        {
            field: "state",
            headerName: t("decision.state"),
            width: 70,
            editable: false,
            renderCell: cellValues => {
                if (cellValues.row.state == "ACCEPTED") {
                    return (
                        <IconButton color="success"><CheckIcon /></IconButton>
                    );
                } else if (cellValues.row.state == "REJECTED") {
                    return (
                        <IconButton color="error"><ErrorIcon /></IconButton>
                    );
                } else if (cellValues.row.state == "NEW" || cellValues.row.state == null) {
                    return (
                        <FiberNewIcon color="grey"></FiberNewIcon>
                    );
                }
            }
        },
        {
            field: "acquisitionTime",
            type: "datetime",
            headerName: t("decision.acquisitionTime"),
            width: 200,
            editable: false,
            valueGetter: value => value,
            valueFormatter: value => formatDateShort(value, i18n)
        },
        {
            field: "decisionType",
            headerName: t("decision.decisionType"),
            flex: 0.7,
            editable: false,
            valueGetter: value => value ? value.name : ""
        },
        {
            field: "action",
            headerName: t("decision.action"),
            description: "",
            disableExport: true,
            renderCell: params => renderActions(params),
            disableClickEventBubbling: true,
            flex: 1.5
        },
        {
            field: "description",
            headerName: t("decision.description"),
            flex: 1,
            editable: false
        },
        {
            field: "actionButton",
            headerName: "",
            width: 110,
            align: "right",
            disableExport: true,
            disableClickEventBubbling: true,
            renderCell: cellValues => {
                return (
                    <strong>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{marginLeft: 16}}
                            onClick={event => {
                                handleOpen(cellValues.row);
                            }}
                        >
                            {t("decision.button.details")}
                        </Button>
                    </strong >
                );
            }
        }
    ];

    function renderDialog() {
        if (!open) {
            return null;
        }
        return <DecisionDetail
            open={open}
            handleClose={handleClose}
            handleSave={handleSave}
            handleNext={handleNext}
            handleBefore={handleBefore}
            rowData={rowData}
            automaticNext={automaticNext}
            toggleAutomaticNext={toggleAutomaticNext}
            data={getData()}
        />;
    }

    return (
        <>
            <Stack direction="row" sx={{marginBottom: 1}}>
                <Typography variant="h2" sx={{flex: 1}}>
                    <NearbyError fontSize="small" /> {t("decisions.heading")}
                </Typography>

                {hasCvatAction && activeTab == 1 && readyForCvatDecisions.length > 0 ?
                    <Button onClick={handleCvatExport} disabled={exporting} variant="text" color="primary"
                        startIcon={exporting ? <CircularProgress size={16} /> : <CloudUploadIcon />}>
                        {t("decision.exportCvat")}
                    </Button> : null}
                <Button onClick={handleActionExecution} variant="text" color="primary" startIcon={<NotificationsActiveIcon />}>
                    {t("decision.retryActionExecution")}
                </Button>
            </Stack>
            <Paper sx={{paddingBottom: 2, paddingX: 2}}>
                <Tabs onChange={handleTabChange} value={activeTab} sx={{paddingBottom: 0, marginBottom: 0, flex: 1}}>
                    <Tab label={t("home.decisionTab.title.open")} key="tab0" />
                    {hasCvatAction ? <Tab label={t("home.decisionTab.title.readyCvat")} key="tab1" /> : null}
                    <Tab label={t("home.decisionTab.title.done")} key={hasCvatAction ? "tab2" : "tab1"} />
                </Tabs>

                <DataGrid
                    columnVisibilityModel={columnVisibilityModel}
                    onColumnVisibilityModelChange={(newModel) =>
                        setColumnVisibilityModel(newModel)
                    }
                    localeText={locale.components.MuiDataGrid.defaultProps.localeText}
                    initialState={{
                        sorting: {
                            sortModel: [{field: 'acquisitionTime', sort: 'desc'}],
                        },
                        pagination: {
                            paginationModel: {
                                pageSize: pageSize,
                            },
                        },
                    }}
                    pageSizeOptions={[pageSize, 25, 50, 100]}
                    rows={decisionsByTab[activeTab]}
                    columns={headers}
                    isCellEditable={() => {false}}
                    slots={{toolbar: GridToolbar}}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            printOptions: {disableToolbarButton: false},
                            csvOptions: {disableToolbarButton: false}
                        }
                    }}
                />
                {renderDialog()}
            </Paper>
        </>
    );
}

export default DecisionOverview;
