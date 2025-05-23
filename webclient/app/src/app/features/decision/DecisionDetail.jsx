import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import SaveIcon from '@mui/icons-material/Save';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    TextField,
    Typography,
    IconButton,
    Tooltip
} from "@mui/material";
import React, {useEffect, useMemo, useState, useCallback} from "react";
import {useTranslation} from "react-i18next";
import DecisionDetailStyles from "../../assets/themes/DecisionDetailStyles";
import {formatDateFull} from "../../commons/formatter/DateFormatter";
import ActionTypeRest from "../../services/ActionTypeRest";
import DecisionTypeRest from "../../services/DecisionTypeRest";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Info from "@mui/icons-material/Info";
import MediaContent from "../../commons/MediaContent";
import IconLayerMap from "../../commons/geographicalMaps/IconLayerMap";
import {createActionTooltip, determineActionColor} from "./DecisionActions";

function DecisionDetail(props) {
    const {
        open,
        rowData,
        handleClose,
        handleSave,
        data,
        handleNext,
        handleBefore,
        automaticNext,
        toggleAutomaticNext,
        showMap = true
    } = props;
    const actionTypeRest = useMemo(() => new ActionTypeRest(), []);
    const decisionTypeRest = useMemo(() => new DecisionTypeRest(), []);
    const [actionTypes, setActionTypes] = useState(rowData.action);
    const [decisionType, setDecisionType] = useState([""]);
    const [allActionTypes, setAllActionTypes] = useState([""]);
    const [allDecisionType, setAllDecisionType] = useState([""]);
    const [description, setDescription] = useState(rowData.description == null ? "" : rowData.description);
    const {t, i18n} = useTranslation();
    const [rowIndex, setRowIndex] = useState([""]);

    useEffect(() => {
        reload();
        setRowIndex(searchIndex(data, rowData));    //set the index of the current decision
    }, [open, rowData]);

    useEffect(() => {
        reloadActionTypes();
    }, [decisionType]);

    const handleKeyDown = (event) => {
        const activeElement = document.activeElement;
        const isTextField = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';
        if (!isTextField) {
            if (event.key === 'Escape') {
                handleClose();
            } else if (event.key === 'd') {// navigate through the decisions
                handleNext(data, rowIndex);
            } else if (event.key === 'a') {
                handleBefore(data, rowIndex);
            } else if (event.key >= '1' && event.key <= '9') {//shortkey for decision types
                const index = parseInt(event.key, 10) - 1;
                if (index < allDecisionType.length) {
                    setDecisionType(allDecisionType[index]);
                }
            } else if (event.key == 'Enter') {
                handleSave(actionTypes, decisionType, description, "ACCEPTED")
            } else if (event.key == 'Delete') {
                handleSave(actionTypes, decisionType, description, "REJECTED")
            }
        }


    };

    useEffect(() => {
        if (open) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, handleKeyDown]);


    if (!open) {
        return null;
    }

    function searchIndex(data, rowData) {   //search the index of the current decision
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === rowData.id) {
                return i;
            }
        }
        return -1;
    }

    function reload() { //reload the decision types
        decisionTypeRest.findByModuleId(rowData.module.id).then(response => {
            if (response.data == null) {
                return;
            }
            setAllDecisionType(response.data);
            if (rowData.decisionType?.id) {
                setDecisionType(response.data.find(value => value.id == rowData.decisionType.id));
            }
        });
    }

    function findExistingActions(defaultActionTypes) {  //find the existing actions
        const currentActionTypes = [];
        rowData.action.forEach(action => {
            const found = defaultActionTypes.find(value => value.id == action.actionType.id);
            if (found != undefined) {
                found.disabled = false;
                found.actionState = action.state;
                if (action.state == 'DONE') {
                    found.disabled = true;
                }
                currentActionTypes.push(found);
            }
        });
        return currentActionTypes;
    }

    function retainDoneActions(defaultActionTypes) {  //find the existing actions
        const currentActionTypes = [];
        rowData.action.forEach(action => {
            if (action.state == 'DONE') {
                const doneActionType = action.actionType;
                doneActionType.disabled = true
                doneActionType.actionState = action.state;
                currentActionTypes.push(doneActionType);
            }
        });
        defaultActionTypes.forEach(type => {
            currentActionTypes.push(type);
        });
        return currentActionTypes;
    }

    function reloadActionTypes() {  //reload the action types
        if (decisionType == undefined || decisionType.id == undefined) {
            return null;
        }

        actionTypeRest.findByModuleId(rowData.module.id).then(response => {
            if (response.data == null) {
                return;
            }
            setAllActionTypes(response.data);
            if (rowData.decisionType.id === decisionType.id && rowData.action.length != 0) {
                setActionTypes(findExistingActions(response.data));
            } else {
                actionTypeRest.findByDecisionType(decisionType.id).then(response => {
                    setActionTypes(retainDoneActions(response.data));
                })

            }
        });
    }

    function handleChangeAction(event) {
        const {
            target: {value}
        } = event;
        setActionTypes(value);
    }

    function handleChangeDecisionType(event) {
        setDecisionType(event.target.value);
    }

    function renderDescriptionTextField() {
        return <TextField
            autoFocus
            required
            margin="dense"
            id="description"
            name="description"
            label={t("decision.description")}
            type="text"
            fullWidth
            variant="standard"
            value={description}
            onChange={e => setDescription(e.target.value)} />;
    }

    function renderDecisionType() {
        return <FormControl
            fullWidth
            variant="outlined"
        >

            <InputLabel id="decision.decisionType.label">
                {t("decision.decisionType")}
            </InputLabel>

            <Select
                labelId="decision.decisionType.label"
                id="decision.decisionType"
                value={decisionType}
                onChange={handleChangeDecisionType}
                label={t("decision.decisionType")}
                renderValue={selected => (
                    <Chip label={selected.name} variant="outlined" sx={{border: "none"}} />
                )}
            >
                {allDecisionType.map((decisionType, index) => (
                    <MenuItem key={index} value={decisionType}>
                        <ListItemText>{`${index + 1} - ${decisionType.name}`}</ListItemText>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>;
    }

    function renderDecisionVisualization() {
        return <MediaContent
            sx={{aspectRatio: "16/9", objectFit: "contain"}}
            src={window.location.pathname + "api/decision/download/" + rowData.mediaUrl} />;
    }

    function renderActionSelect() {
        return <FormControl fullWidth variant="outlined">
            <InputLabel id="decision.action.label">
                {t("decision.action")}
            </InputLabel>
            <Select
                labelId="decision.action.label"
                id="decision.action.select"
                multiple
                value={actionTypes ? actionTypes : []}
                onChange={handleChangeAction}
                input={<OutlinedInput label={t("decision.action")} />}
                renderValue={selected => (
                    <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                        {selected.map((value, index) => (value && value.name ?
                            <Tooltip key={index} title={createActionTooltip(value.actionState, t)}>
                                <Chip key={index} label={value.name} variant="outlined" color={determineActionColor(value.actionState)} />
                            </Tooltip> : null
                        ))}
                    </Box>
                )}
            >
                {allActionTypes.map((value, index) => (
                    <MenuItem key={index} value={value} disabled={value.disabled}>
                        {value.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>;
    }

    function renderActionVisualzation() {  //render the map
        if (rowData.actionVisualizationUrl != undefined) {
            return (
                <Box sx={{aspectRatio: "inherit", position: 'relative'}}>
                    <MediaContent
                        sx={{aspectRatio: "16/9", objectFit: "contain"}}
                        src={window.location.pathname + "api/decision/download/" + rowData.actionVisualizationUrl} />
                </Box>
            );
        } else if (rowData.cameraLatitude != undefined && rowData.cameraLongitude != undefined) {
            return (
                <Box sx={{aspectRatio: "inherit", position: 'relative'}}>
                    <Box sx={{aspectRatio: "16/9", objectFit: "contain"}}>
                        <IconLayerMap
                            sx={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                            latitude={rowData.cameraLatitude}
                            longitude={rowData.cameraLongitude}
                        />
                    </Box>
                </Box>
            );
        }
        return (
            <Typography align="center">
                {t("error.action.visualization")}
            </Typography>
        );
    }

    function renderDialogContent() {

        const content = showMap ? (<Stack direction="column">
            {renderDescriptionTextField()}
            <Stack direction="row">
                <Stack sx={{width: 1 / 2}}>
                    {renderDecisionType()}
                    {renderDecisionVisualization()}

                </Stack>
                <Stack sx={{width: 1 / 2}}>
                    {renderActionSelect()}
                    {renderActionVisualzation()}
                </Stack>
            </Stack>
        </Stack>
        ) :
            (<Stack direction="column">
                {renderDescriptionTextField()}
                <Stack direction="row">
                    <Stack sx={{width: 1 / 2}}>
                        {renderDecisionType()}
                    </Stack>
                    <Stack sx={{width: 1 / 2}}>
                        {renderActionSelect()}
                    </Stack>
                </Stack>
                <Box sx={{
                    width: "50%",
                    transform: `translate(50%, 0%)`,
                    aspectRatio: "16/9"
                }}>
                    {renderDecisionVisualization()}
                </Box>
            </Stack>
            );

        return (
            <DialogContent
                id="decision-detail-dialog-description"
                sx={{
                    ...DecisionDetailStyles.dialogContent,
                    height: 'auto',
                    overflow: 'hidden',
                    paddingX: 3, //horizontal padding
                    paddingY: 2, //vertical padding
                    marginLeft: 0  //margin left for "Details" field, Video element, Map and "Actions" filter
                }}
            >
                {content}
            </DialogContent>
        )
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="decision-detail-dialog-title"
            aria-describedby="decision-detail-dialog-description"
            maxWidth={false}
            fullWidth
            sx={{
                height: "100%",
                width: "100%",
                aspectRatio: "16/9"
            }}
        >
            <DialogTitle
                id="decision-detail-dialog-title"
                component="div"
                sx={{paddingBottom: 0, marginBottom: 0}}
            >
                <Box>
                    <Typography variant="h2" noWrap>    {/* HEADER FOR ACCIDENT | TRAFFIC JAM | DANGEROUS DRIVING BEHAVIOUR */}
                        {rowData.decisionType ? rowData.decisionType.name : null}
                    </Typography>

                    <Typography variant="subtitle2" noWrap>     {/* HEADER FOR DATE XX. MONTH YYYY um HH:MM:SS */}
                        {formatDateFull(rowData.acquisitionTime, i18n)}
                    </Typography>
                </Box>
            </DialogTitle>
            <Tooltip title={t('automatic.next.tooltip')}>
                <IconButton
                    onClick={toggleAutomaticNext}

                    sx={{
                        position: "absolute",
                        right: 120,
                        top: 8,
                    }}
                >{automaticNext ? <PauseIcon /> : <PlayArrowIcon />}

                </IconButton>
            </Tooltip>
            <Tooltip title={t("arrow.info")}>
                <IconButton
                    sx={{
                        position: "absolute",
                        right: 60,
                        top: 8,
                    }}
                >
                    <Info />

                </IconButton>
            </Tooltip>
            <IconButton
                onClick={handleClose}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: theme => theme.palette.grey[500]
                }}
            >
                <CloseIcon />
            </IconButton>

            {renderDialogContent()}

            <DialogActions sx={{
                ...DecisionDetailStyles.dialogAction,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Box sx={{
                    paddingBottom: 2,
                    paddingX: 2,
                    marginLeft: 0,
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-start'
                }}>
                    <Button
                        onClick={() => handleSave(actionTypes, decisionType, description, rowData.state)}
                        variant="contained"
                        startIcon={<SaveIcon />}>
                        {t("button.save")}
                    </Button>
                </Box>
                <Box sx={{
                    paddingBottom: 2,
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Tooltip title={t("arrow.info")}>
                        <IconButton
                            onClick={() => handleBefore(data, rowIndex)}
                            variant="contained">
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Tooltip>
                    {rowIndex + 1}/{data.length}
                    <Tooltip title={t("arrow.info")}>
                        <IconButton
                            onClick={() => handleNext(data, rowIndex)}
                            variant="contained">
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box sx={{
                    paddingBottom: 2,
                    paddingX: 2,
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <Button
                        sx={[DecisionDetailStyles.button, {marginRight: 5}]}
                        onClick={() => handleSave(actionTypes, decisionType, description, "REJECTED")}
                        variant="contained"
                        color="error"
                        startIcon={<ErrorIcon />}>
                        {t("decision.button.reportmistake")}
                    </Button>

                    <Button
                        onClick={() => handleSave(actionTypes, decisionType, description, "ACCEPTED")}
                        variant="contained"
                        color="success"
                        startIcon={<CheckIcon />}>
                        {t("decision.button.acknowledged")}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog >
    );
}

export default DecisionDetail;