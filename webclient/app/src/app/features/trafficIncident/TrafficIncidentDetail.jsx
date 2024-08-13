import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorIcon from "@mui/icons-material/Error";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    ListItemIcon,
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
import {formatDateFull} from "../../commons/formatter/DateFormatter";
import MitigationActionTypeRest from "../../services/MitigationActionTypeRest";
import TrafficIncidentTypeRest from "../../services/TrafficIncidentTypeRest";
import TrafficIncidentMap from "./TrafficIncidentMap";

function TrafficIncidentDetail(props) {
    const {open, rowData, handleClose, handleSave} = props;
    const mitigationActionTypeRest = useMemo(() => new MitigationActionTypeRest(), []);
    const trafficIncidentTypeRest = useMemo(() => new TrafficIncidentTypeRest(), []);
    const [mitigationActionTypes, setMitigationActionTypes] = useState([""]);
    const [trafficIncidentType, setTrafficIncidentType] = useState([""]);
    const [allMitigationActionTypes, setAllMitigationActionTypes] = useState([""]);
    const [allTrafficIncidentType, setAllTrafficIncidentType] = useState([""]);
    const [description, setDescription] = useState(rowData.description);
    const {t} = useTranslation();

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
    };

    function handleChangeTrafficIncidentType(event) {
        setTrafficIncidentType(event.target.value);
    };

    if (!open) {
        return null;
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
            <Box sx={{width: "100%", position: "relative"}}>
                <TrafficIncidentMap sx={{zIndex: "-1"}} latitude={rowData.cameraLatitude} longitude={rowData.cameraLongitude} />
            </Box>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="traffic-incident-detail-dialog-title"
            aria-describedby="traffic-incident-detail-dialog-description"
            maxWidth="xl"
        >
            <DialogTitle id="traffic-incident-detail-dialog-title" >
                <Typography component="span" variant="h4">{rowData.trafficIncidentType.name}</Typography>
                <br></br>
                <Typography component="span" variant="subtitle1">{formatDateFull(rowData.acquisitionTime)}</Typography>
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
            <DialogContent id="traffic-incident-detail-dialog-description" sx={{overflow: "hidden"}}>
                <Grid container spacing={2} sx={{width: "70vw"}}>
                    <Grid item xs={6}>
                        <Stack>
                            <Box>
                                <ReactPlayer
                                    url='images/incidents/SampleScene01.mp4'
                                    width='100%'
                                    height='100%'
                                    controls={true}
                                    muted={true}
                                    playing={true}
                                />
                            </Box>
                            <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="trafficIncident.trafficIncidentType.label">{t("trafficIncident.trafficIncidentType")}</InputLabel>
                                <Select
                                    labelId="trafficIncident.trafficIncidentType.label"
                                    id="trafficIncident.trafficIncidentType"
                                    value={trafficIncidentType}
                                    onChange={handleChangeTrafficIncidentType}
                                    label="incidentTypetrafficIncident.trafficIncidentType.select"
                                    renderValue={selected => (<ListItemText>{selected.name}</ListItemText>)}

                                >
                                    {allTrafficIncidentType.map(incidentType => (
                                        <MenuItem
                                            key={incidentType.id}
                                            value={incidentType}
                                        >
                                            <ListItemText>{incidentType.name}</ListItemText>
                                            <ListItemIcon><DeleteIcon /></ListItemIcon>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack direction="column">
                            {renderTrafficIncidentMap()}
                            <FormControl>
                                <InputLabel id="trafficIncident.mitigationAction.label">{t("trafficIncident.mitigationAction")}</InputLabel>
                                <Select
                                    labelId="trafficIncident.mitigationAction.label"
                                    id="trafficIncident.mitigationAction.select"
                                    multiple
                                    value={mitigationActionTypes}
                                    onChange={handleChangeAction}
                                    input={<OutlinedInput
                                        id="trafficIncident.mitigationAction.mitigationActionType.select.chip"
                                        label="trafficIncident.mitigationAction.mitigationActionType.select.chip.label"
                                    />}
                                    renderValue={selected => (
                                        <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                                            {selected.map(value => (
                                                <Chip key={value.id} label={value.name} variant="outlined" sx={{color: "green"}} />

                                            ))}
                                        </Box>
                                    )}
                                >
                                    {allMitigationActionTypes.map(value => (
                                        <MenuItem
                                            key={value.id}
                                            value={value}
                                        >
                                            {value.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
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
                            onChange={e => {
                                setDescription(e.target.value);
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
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
            </DialogActions>
        </Dialog >
    );
}

export default TrafficIncidentDetail;

