import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import {Box, Button, IconButton, Tab, Tabs} from "@mui/material";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {formatDateShort} from "../../commons/formatter/DateFormatter";
import ActionRest from "../../services/ActionRest";
import DecisionRest from "../../services/DecisionRest";
import {renderActions} from "./DecisionActions";
import DecisionDetail from "./DecisionDetail";

function DecisionOverview() {
    const {t, i18n} = useTranslation();
    const [tab, setTab] = React.useState(0);
    const decisionRest = useMemo(() => new DecisionRest(), []);
    const actionRest = useMemo(() => new ActionRest(), []);
    const [decisions, setDecisions] = useState([]);
    const [newDecisions, setNewDecisions] = useState([]);
    const [checkedDecisions, setCheckedDecisions] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [rowData, setRowData] = React.useState({});
    const [automaticNext, setAutomaticNext] = React.useState(false);


    useEffect(() => {
        reloadDecisions();
        const interval = setInterval(reloadDecisions, 5000); // Update alle 5 Sekunden
        return () => clearInterval(interval);
    }, [open, tab]);

    function reloadDecisions() {
        decisionRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            const sortedData = response.data.sort((a, b) => new Date(b.acquisitionTime) - new Date(a.acquisitionTime));
            setDecisions(sortedData);
            setNewDecisions(sortedData.filter(decision => decision.state == null || decision.state == "NEW"));
            setCheckedDecisions(sortedData.filter(decision => decision.state == "ACCEPTED" || decision.state == "REJECTED"));

        });
    }

    const handleTabChange = (event, newValue) => {
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

    function toggleAutomaticNext(){
        setAutomaticNext(!automaticNext);
    }

    function handleClose() {
        setOpen(false);
    };

    function handleSave(actionTypes, decisionType, description, state) {
        const foundDecision = decisions.find(value => value.id == rowData.id);
        foundDecision.decisionType = decisionType;
        foundDecision.description = description;
        foundDecision.state = state;
        const remoteFunctions = [];

        const newActions = actionTypes;

        let newActionTypes = actionTypes;
        rowData.action.forEach(action => {
            const found = actionTypes.find(value => value.id == action.actionType.id);
            if (found === undefined) {
                remoteFunctions.push(actionRest.delete(action.id));
            } else {
                newActionTypes = newActionTypes.filter(value => value.id !== action.actionType.id);
                newActions.push(action);
            }
        });

        newActionTypes.forEach(mActiontype => {
            const entity = {
                name: "",
                description: "",
                decision: {id: rowData.id},
                actionType: mActiontype
            };
            remoteFunctions.push(actionRest.create(entity));
        });

        decisionRest.update(foundDecision).then(response => {
            Promise.all(remoteFunctions).then(() => {
                if (automaticNext) {
                    handleNext(getData(), getData().findIndex(value => value.id == rowData.id));
                }else{
                setOpen(false);
                }
            });
        });
    };

    function handleOpen(row) {
        setOpen(true);
        setRowData(row);
    }

    function getData() {
        return tab == 0 ? newDecisions : checkedDecisions;
    }

    const headers = [
        {
            field: "state",
            headerName: t("decision.state"),
            width: 70,
            editable: false,
            renderCell: cellValues => {
                if (tab === 1 && cellValues.row.state == "ACCEPTED") {
                    return (
                        <IconButton color="success"><CheckIcon /></IconButton>
                    );
                } else if (tab === 1 && cellValues.row.state == "REJECTED") {
                    return (
                        <IconButton color="error"><ErrorIcon /></IconButton>
                    );
                } else if (tab === 0 && (cellValues.row.state == "NEW" || cellValues.row.state == null)) {
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
            editable: true,
            valueGetter: value => value,
            valueFormatter: value => formatDateShort(value, i18n)
        },
        {
            field: "decisionType",
            headerName: t("decision.decisionType"),
            flex: 0.7,
            editable: true,
            valueGetter: value => value.name
        },
        {
            field: "action",
            headerName: t("decision.action"),
            description: "",
            renderCell: renderActions,
            disableClickEventBubbling: true,
            flex: 1.5
        },
        {
            field: "description",
            headerName: t("decision.description"),
            flex: 1.5,
            editable: true
        },
        {
            field: "actionButton",
            headerName: "",
            width: 110,
            align: "right",
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
            <Tabs onChange={handleTabChange} value={tab}>
                <Tab label={t("home.decisionTab.title.open")} key="tab0" />
                <Tab label={t("home.decisionTab.title.done")} key="tab1" />
            </Tabs>
            <Box sx={{width: "100%"}}>
                <DataGrid
                    initialState={{
                        sorting: {
                            sortModel: [{field: 'acquisitionTime', sort: 'desc'}],
                        },
                    }}
                    rows={tab == 0 ? newDecisions : checkedDecisions}
                    columns={headers}
                    isCellEditable={() => {false}}
                    slots={{toolbar: GridToolbar}}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            printOptions: {disableToolbarButton: true},
                            csvOptions: {disableToolbarButton: true}
                        }
                    }}
                />
            </Box>
            {renderDialog()}
        </>
    );
}

export default DecisionOverview;
