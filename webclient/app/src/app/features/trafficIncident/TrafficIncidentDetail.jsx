import {
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Stack,
    TextField,
    Box,
    AccordionDetails,
    AccordionSummary,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import ReactPlayer from "react-player";
import {useTranslation} from "react-i18next";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from "@mui/icons-material/Check";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TrafficIncidentMap from "./TrafficIncidentMap";
import MitigationActionTypeRest from "../../services/MitigationActionTypeRest";
import TrafficIncidentTypeRest from "../../services/TrafficIncidentTypeRest";
import {formatDateFull} from "../../commons/formatter/DateFormatter"

function TrafficIncidentDetail(props) {
    const {open, rowData, interpretData, handleClose, handleSave} = props;
    const [expanded, setExpanded] = React.useState("panel1");
    const mitigationActionTypeRest = useMemo(() => new MitigationActionTypeRest(), []);
    const trafficIncidentTypeRest = useMemo(() => new TrafficIncidentTypeRest(), []);
    const [mitigationAction, setMitigationAction] = React.useState([]);
    const [trafficIncidentType, setTrafficIncidentType] = React.useState('');
    const [allMitigationAction, setAllMitigationAction] = React.useState([]);
    const [allTrafficIncidentType, setAllTrafficIncidentType] = React.useState([]);
    const {t} = useTranslation();

    useEffect(() => {
        reload();
    }, [open]);

    function reload() {
        mitigationActionTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setAllMitigationAction(response.data);
        });
        trafficIncidentTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setAllTrafficIncidentType(response.data);
            setTrafficIncidentType(response.data.find(value => value.id == rowData.trafficIncidentType.id));
        });
    }

    const handleChangeAction = event => {
        const {
            target: {value}
        } = event;
        setMitigationAction(value);

    };

    const handleChangeTrafficIncidentType = event => {
        setTrafficIncidentType(event.target.value);
    };

    const handleChange = panel => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    if (!open) {
        return null;
    }

    function renderTrafficIncidentMap() {
        if (rowData.cameraLatitude == undefined || rowData.cameraLongitude == undefined) {
            return (
                <AccordionDetails >
                    <Typography align="center">
                        {t("error.coordinates")}
                    </Typography>
                </AccordionDetails>
            );
        }
        return (
            <AccordionDetails sx={{height: "394px"}}>
                <TrafficIncidentMap sx={{zIndex: "-1"}} latitude={rowData.cameraLatitude} longitude={rowData.cameraLongitude} />
            </AccordionDetails>);
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
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent id="traffic-incident-detail-dialog-description">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Stack>
                            <ReactPlayer
                                url='images/incidents/SampleScene01.mp4'
                                width='100%'
                                height='100%'
                                controls={true}
                                muted={true}
                                playing={true}
                            />
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
                                    <MenuItem value="">
                                        <ListItemText>{t("trafficIncident.trafficIncidentType.new")}</ListItemText><ListItemIcon><AddIcon /></ListItemIcon>
                                    </MenuItem>
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
                        <Accordion
                            disableGutters
                            expanded={expanded === "panel1"}
                            onChange={handleChange("panel1")}>
                            <AccordionSummary
                                sx={{
                                    backgroundColor: "#eeeeee", zIndex: 1000, borderBottom: "1px #aaa solid"
                                }}
                                expandIcon={< ExpandMoreIcon />}
                                aria-controls="panel1d-content"
                                id="panel1d-header">
                                <Box>{t("trafficIncident.location")}</Box>
                            </AccordionSummary>
                            {renderTrafficIncidentMap()}
                        </Accordion>
                        <Accordion
                            disableGutters expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
                            <AccordionSummary
                                sx={{backgroundColor: "#eeeeee"}}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2d-content"
                                id="panel2d-header">
                                {t("trafficIncident.mitigationAction.header4standardvalues")}
                            </AccordionSummary>
                            <AccordionDetails sx={{height: "394px"}}>
                                <Stack>
                                    <FormControl>
                                        <InputLabel id="trafficIncident.mitigationAction.label">{t("trafficIncident.mitigationAction")}</InputLabel>
                                        <Select
                                            labelId="trafficIncident.mitigationAction.label"
                                            id="trafficIncident.mitigationAction.select"
                                            multiple
                                            value={mitigationAction}
                                            onChange={handleChangeAction}
                                            input={<OutlinedInput id="trafficIncident.mitigationAction.select.chip" label="trafficIncident.mitigationAction.select.chip.label" />}
                                            renderValue={selected => (
                                                <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                                                    {selected.map(value => (
                                                        <Chip key={value.id} label={value.name} variant="outlined" sx={{color: "green"}} />

                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {allMitigationAction.map(value => (
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
                            </AccordionDetails>
                        </Accordion>
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
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="error" startIcon={<ErrorIcon />}>{t("trafficIncident.button.reportmistake")}</Button>
                <Button onClick={() => handleSave(mitigationAction, trafficIncidentType)} variant="contained" color="success" startIcon={<CheckIcon />} autoFocus>
                    {t("trafficIncident.button.acknowledged")}
                </Button>
            </DialogActions>
        </Dialog >
    );
}

export default TrafficIncidentDetail;

