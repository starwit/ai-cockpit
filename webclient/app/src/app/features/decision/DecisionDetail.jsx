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
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import DecisionDetailStyles from "../../assets/themes/DecisionDetailStyles";
import {formatDateFull} from "../../commons/formatter/DateFormatter";
import ActionTypeRest from "../../services/ActionTypeRest";
import DecisionTypeRest from "../../services/DecisionTypeRest";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import {useMediaQuery, useTheme} from "@mui/material"; //for responsive design
import MediaContent from "../../commons/MediaContent";
import IconLayerMap from "../../commons/geographicalMaps/IconLayerMap";

function DecisionDetail(props) {
    const {open, rowData, handleClose, handleSave, data, handleNext, handleBefore, automaticNext, toggleAutomaticNext} = props;
    const actionTypeRest = useMemo(() => new ActionTypeRest(), []);
    const decisionTypeRest = useMemo(() => new DecisionTypeRest(), []);
    const [actionTypes, setActionTypes] = useState(rowData.action);
    const [decisionType, setDecisionType] = useState([""]);
    const [allActionTypes, setAllActionTypes] = useState([""]);
    const [allDecisionType, setAllDecisionType] = useState([""]);
    const [description, setDescription] = useState(rowData.description == null ? "" : rowData.description);
    const {t, i18n} = useTranslation();
    const [rowIndex, setRowIndex] = useState([""]);

    const theme = useTheme();

    useEffect(() => {
        reload();
        setRowIndex(data.indexOf(rowData));
    }, [open, rowData]);

    useEffect(() => {
        reloadActionTypes();
    }, [decisionType]);

    function reload() {
        decisionTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setAllDecisionType(response.data);
            setDecisionType(response.data.find(value => value.id == rowData.decisionType.id));
        });
    }

    function findExistingActions(defaultActionTypes) {
        const actions = [];
        rowData.action.forEach(action => {
            const found = defaultActionTypes.find(value => value.id == action.actionType.id);
            if (found != undefined) {
                actions.push(found);
            }
        });
        return actions;
    }

    function reloadActionTypes() {
        if (decisionType == undefined || decisionType.id == undefined) {
            return null;
        }

        actionTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setAllActionTypes(response.data);
            if (rowData.decisionType.id === decisionType.id && rowData.action.length != 0) {
                setActionTypes(findExistingActions(response.data));
            } else {
                actionTypeRest.findByDecisionType(decisionType.id).then(response => {
                    setActionTypes(response.data);
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

    function renderDecisionMap() {
        if (rowData.cameraLatitude == undefined || rowData.cameraLongitude == undefined) {
            return (
                <Typography align="center">
                    {t("error.coordinates")}
                </Typography>
            );
        }
        return (
            <Box sx={{aspectRatio: "16/9", objectFit: "contain"}}>
                <IconLayerMap
                    sx={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                    latitude={rowData.cameraLatitude}
                    longitude={rowData.cameraLongitude}
                />
            </Box>
        );
    }

    if (!open) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="decision-detail-dialog-title"
            aria-describedby="decision-detail-dialog-description"
            maxWidth={false}
            fullWidth
            sx={{aspectRatio: "16/9", alignSelf: "center"}}
        >
            <DialogTitle
                id="decision-detail-dialog-title"
                component="div"
                sx={{paddingBottom: 0, marginBottom: 0}}
            >
                <Box>
                    <Typography variant="h2" noWrap>    {/* HEADER FOR ACCIDENT | TRAFFIC JAM | DANGEROUS DRIVING BEHAVIOUR */}
                        {rowData.decisionType.name}
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
                        right: 60,
                        top: 8,
                    }}
                >{automaticNext ? <PauseIcon /> : <PlayArrowIcon />}

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

            <DialogContent
                id="decision-detail-dialog-description"
                sx={{
                    ...DecisionDetailStyles.dialogContent,
                    height: 'auto',
                    overflow: 'hidden',
                    px: 3, //horizontal padding
                    py: 2, //vertical padding
                    ml: 0  //margin left for "Details" field, Video element, Map and "Actions" filter
                }}
            >
                <Stack direction="column">
                    <Box>

                        <TextField
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
                            onChange={e => setDescription(e.target.value)}
                        />
                    </Box>

                    <Stack direction="row">
                        <Stack sx={{width: 1 / 2}}>
                            <FormControl
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
                                            <ListItemText>{decisionType.name}</ListItemText>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <MediaContent
                                sx={{aspectRatio: "16/9", objectFit: "contain"}}
                                src={window.location.pathname + "api/decision/download/" + rowData.mediaUrl} />

                        </Stack>
                        <Stack sx={{width: 1 / 2}}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="decision.action.label">
                                    {t("decision.action")}
                                </InputLabel>
                                <Select
                                    labelId="decision.action.label"
                                    id="decision.action.select"
                                    multiple
                                    value={actionTypes}
                                    onChange={handleChangeAction}
                                    input={<OutlinedInput label={t("decision.action")} />}
                                    renderValue={selected => (
                                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                                            {selected.map((value, index) => (
                                                <Chip key={index} label={value.name} variant="outlined" sx={{color: "green"}} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {allActionTypes.map((value, index) => (
                                        <MenuItem key={index} value={value}>
                                            {value.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box sx={{aspectRatio: "inherit", position: 'relative'}}>
                                {renderDecisionMap()}
                            </Box>
                        </Stack>
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions sx={{
                ...DecisionDetailStyles.dialogAction,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Box sx={{
                    paddingBottom: 2,
                    px: 2,
                    ml: 0,
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-start'
                }}>
                    <Button
                        onClick={() => handleSave(actionTypes, decisionType, description, "NEW")}
                        variant="contained"
                        startIcon={<SaveIcon />}>
                        {t("button.save")}
                    </Button>
                </Box>
                <Box sx={{
                    paddingBottom: 2,
                    px: 2,
                    ml: 0,
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <IconButton
                        onClick={() => handleBefore(data, rowIndex)}
                        variant="contained">
                        <ArrowBackIosIcon />
                    </IconButton>
                    {rowIndex + 1}/{data.length}
                    <IconButton
                        onClick={() => handleNext(data, rowIndex)}
                        variant="contained">
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
                <Box sx={{
                    paddingBottom: 2,
                    px: 2,
                    ml: 0,
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <Button
                        sx={[DecisionDetailStyles.button, {mr: 5}]}
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
                        startIcon={<CheckIcon />}
                        autoFocus>
                        {t("decision.button.acknowledged")}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog >
    );
}

export default DecisionDetail;