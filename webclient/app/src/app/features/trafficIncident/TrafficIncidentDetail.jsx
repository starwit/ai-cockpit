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
    Grid2,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import ReactPlayer from "react-player";
import TrafficIncidentDetailStyles from "../../assets/themes/TrafficIncidentDetailStyles";
import {formatDateFull} from "../../commons/formatter/DateFormatter";
import MitigationActionTypeRest from "../../services/MitigationActionTypeRest";
import TrafficIncidentTypeRest from "../../services/TrafficIncidentTypeRest";
import TrafficIncidentMap from "./TrafficIncidentMap";

import {useMediaQuery, useTheme} from "@mui/material"; //for responsive design

function TrafficIncidentDetail(props) {
    const {open, rowData, handleClose, handleSave} = props;
    const mitigationActionTypeRest = useMemo(() => new MitigationActionTypeRest(), []);
    const trafficIncidentTypeRest = useMemo(() => new TrafficIncidentTypeRest(), []);
    const [mitigationActionTypes, setMitigationActionTypes] = useState([""]);
    const [trafficIncidentType, setTrafficIncidentType] = useState([""]);
    const [allMitigationActionTypes, setAllMitigationActionTypes] = useState([""]);
    const [allTrafficIncidentType, setAllTrafficIncidentType] = useState([""]);
    const [description, setDescription] = useState(rowData.description == null ? "" : rowData.description);
    const {t} = useTranslation();

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));

    useEffect(() => {
        reload();
    }, [open]);

    useEffect(() => {
        reloadMitigationActionTypes();
    }, [trafficIncidentType]);

    function reload() {
        trafficIncidentTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setAllTrafficIncidentType(response.data);
            setTrafficIncidentType(response.data.find(value => value.id == rowData.trafficIncidentType.id));
        });
    }

    function findExistingMitigationActions(defaultMitigationActionTypes) {
        const actions = [];
        rowData.mitigationAction.forEach(action => {
            const found = defaultMitigationActionTypes.find(value => value.id == action.mitigationActionType.id);
            if (found != undefined) {
                actions.push(found);
            }
        });
        return actions;
    }

    function reloadMitigationActionTypes() {
        if (trafficIncidentType == undefined || trafficIncidentType.id == undefined) {
            return null;
        }

        mitigationActionTypeRest.findByTrafficIncidentType(trafficIncidentType.id).then(response => {
            if (response.data == null) {
                return;
            }
            setAllMitigationActionTypes(response.data);
            if (rowData.trafficIncidentType.id === trafficIncidentType.id) {
                setMitigationActionTypes(findExistingMitigationActions(response.data));
            } else {
                setMitigationActionTypes(response.data);
            }
        });
    }

    function handleChangeAction(event) {
        const {
            target: {value}
        } = event;
        setMitigationActionTypes(value);
    }

    function handleChangeTrafficIncidentType(event) {
        setTrafficIncidentType(event.target.value);
    }

    function renderTrafficIncidentMap() {
        if (rowData.cameraLatitude == undefined || rowData.cameraLongitude == undefined) {
            return (
                <Typography align="center">
                    {t("error.coordinates")}
                </Typography>
            );
        }
        return (
            <Box sx={{width: "100%", height: "100%", position: "relative"}}>
                <TrafficIncidentMap
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
            aria-labelledby="traffic-incident-detail-dialog-title"
            aria-describedby="traffic-incident-detail-dialog-description"
            maxWidth={false}
            fullWidth
        >
            <DialogTitle
                id="traffic-incident-detail-dialog-title"
                component="div"
                sx={{paddingBottom: 0, marginBottom: 0}}
            >
                <Box>
                    <Typography variant="h2" noWrap>    {/* HEADER FOR ACCIDENT | TRAFFIC JAM | DANGEROUS DRIVING BEHAVIOUR */}
                        {rowData.trafficIncidentType.name}
                    </Typography>

                    <Typography variant="subtitle2" noWrap>     {/* HEADER FOR DATE XX. MONTH YYYY um HH:MM:SS */}
                        {formatDateFull(rowData.acquisitionTime)}
                    </Typography>
                </Box>
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
                <CloseIcon />
            </IconButton>

            <DialogContent
                id="traffic-incident-detail-dialog-description"
                sx={{
                    ...TrafficIncidentDetailStyles.dialogContent,
                    height: 'auto',
                    overflow: 'hidden',
                    px: 3, //horizontal padding
                    py: 2, //vertical padding
                    ml: 0  //margin left for "Details" field, Video element, Map and "MitigationActions" filter
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
                            label={t("trafficIncident.description")}
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

                                <InputLabel id="trafficIncident.trafficIncidentType.label">
                                    {t("trafficIncident.trafficIncidentType")}
                                </InputLabel>

                                <Select
                                    labelId="trafficIncident.trafficIncidentType.label"
                                    id="trafficIncident.trafficIncidentType"
                                    value={trafficIncidentType}
                                    onChange={handleChangeTrafficIncidentType}
                                    label={t("trafficIncident.trafficIncidentType")}
                                    renderValue={selected => (<ListItemText>{selected.name}</ListItemText>)}
                                >
                                    {allTrafficIncidentType.map((incidentType, index) => (
                                        <MenuItem key={index} value={incidentType}>
                                            <ListItemText>{incidentType.name}</ListItemText>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box sx={{aspectRatio: "16/9"}}>
                                {
                                    rowData.mediaUrl.endsWith('mp4') ?
                                        <ReactPlayer
                                            url={window.location.pathname + "api/trafficincident/download/" + rowData.mediaUrl}
                                            light={rowData.mediaUrl.endsWith('jpg') ? window.location.pathname + "api/trafficincident/download/" + rowData.mediaUrl : null}
                                            width='100%'
                                            height='100%'
                                            controls={true}
                                            muted={true}
                                            playing={true}
                                            playbackRate={2}
                                        />
                                        :
                                        <img
                                            src={window.location.pathname + "api/trafficincident/download/" + rowData.mediaUrl}
                                        />
                                }

                            </Box>
                        </Stack>
                        <Stack sx={{width: 1 / 2}}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel id="trafficIncident.mitigationAction.label">
                                    {t("trafficIncident.mitigationAction")}
                                </InputLabel>

                                <Select
                                    labelId="trafficIncident.mitigationAction.label"
                                    id="trafficIncident.mitigationAction.select"
                                    multiple
                                    value={mitigationActionTypes}
                                    onChange={handleChangeAction}
                                    input={<OutlinedInput label={t("trafficIncident.mitigationAction")} />}
                                    renderValue={selected => (
                                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                                            {selected.map((value, index) => (
                                                <Chip key={index} label={value.name} variant="outlined" sx={{color: "green"}} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {allMitigationActionTypes.map((value, index) => (
                                        <MenuItem key={index} value={value}>
                                            {value.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Box sx={{aspectRatio: "inherit", position: 'relative'}}>
                                {renderTrafficIncidentMap()}
                            </Box>
                        </Stack>
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions sx={{
                ...TrafficIncidentDetailStyles.dialogAction,
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Box sx={{
                    paddingBottom: 2,
                    px: 2, //horizontal padding
                    ml: 0  //margin left for "Details" field, Video element, Map and "MitigationActions" filter
                }}> {/* MOVE SAVE BUTTON */}
                    <Button
                        onClick={() => handleSave(mitigationActionTypes, trafficIncidentType, description, "NEW")}
                        variant="contained"
                        startIcon={<SaveIcon />}>
                        {t("button.save")}
                    </Button>
                </Box>
                <Box sx={{
                    paddingBottom: 2,
                    px: 2, //horizontal padding
                    ml: 0  //margin left for "Details" field, Video element, Map and "MitigationActions" filter
                }}> {/* MOVE REPORT & AKNOWLEDGED BUTTON */}
                    <Button
                        sx={[TrafficIncidentDetailStyles.button, {mr: 5}]}
                        onClick={() => handleSave(mitigationActionTypes, trafficIncidentType, description, "REJECTED")}
                        variant="contained"
                        color="error"
                        startIcon={<ErrorIcon />}>
                        {t("trafficIncident.button.reportmistake")}
                    </Button>

                    <Button
                        onClick={() => handleSave(mitigationActionTypes, trafficIncidentType, description, "ACCEPTED")}
                        variant="contained"
                        color="success"
                        startIcon={<CheckIcon />}
                        autoFocus>
                        {t("trafficIncident.button.acknowledged")}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog >
    );
}

export default TrafficIncidentDetail;