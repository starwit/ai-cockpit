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
    IconButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import React from "react";
import ReactPlayer from "react-player";
import {useTranslation} from "react-i18next";
import Accordion from "@mui/material/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorIcon from "@mui/icons-material/Error";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function TrafficIncidentDetail(props) {
    const {open, rowData, interpretData, handleClose} = props;
    const [expanded, setExpanded] = React.useState("panel1");
    const [mitigationAction, setMitigationAction] = React.useState([]);
    const [trafficIncidentType, setTrafficIncidentType] = React.useState("");

    const {t} = useTranslation();

    const handleChangeAction = event => {
        const {
            target: {value}
        } = event;
        setMitigationAction(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    const mitigationActions = [
        "Polizei benachrichtigen",
        "an Ferkehrsfunk melden",
        "Straße Sperren",
        "Abschleppdienst benachrichtigen"
    ];

    const incidentTypes = [
        {id: 10, value: "Falschfahrer"},
        {id: 20, value: "Gefahrensituation"},
        {id: 30, value: "hohe Geschwindigkeit"},
        {id: 40, value: "Parken auf Sperrfläche"},
        {id: 50, value: "Stau"}
    ];

    const handleChangeTrafficIncidentType = event => {
        setTrafficIncidentType(event.target.value);
    };

    const handleChange = panel => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    if (!open) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xl"

        >
            <DialogTitle id="alert-dialog-title">
                {rowData.incidentType}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ReactPlayer
                            className='react-player fixed-bottom'
                            url='images/incidents/SampleScene01.mp4'
                            width='100%'
                            height='100%'
                            controls={true}
                            muted={true}
                            playing={true}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Accordion
                            disableGutters
                            expanded={expanded === "panel1"}
                            onChange={handleChange("panel1")}>
                            <AccordionSummary
                                sx={{backgroundColor: "#eeeeee"}}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1d-content"
                                id="panel1d-header">
                                Position auf Karte
                            </AccordionSummary>
                            <AccordionDetails sx={{height: "400px"}}>
                                <Box sx={{height: "100%", flexShrink: 0}}>
                                    <img width="100%" height="100%" src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/master/w_1920,c_limit/GoogleMapTA.jpg" alt="Logo" />
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion
                            disableGutters expanded={expanded === "panel2"} onChange={handleChange("panel2")}>
                            <AccordionSummary
                                sx={{backgroundColor: "#eeeeee"}}
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2d-content"
                                id="panel2d-header">
                                Standardwerte für Gefahrentypen und Maßnahmen festlegen
                            </AccordionSummary>
                            <AccordionDetails sx={{height: "400px"}}>
                                <Stack>
                                    <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                                        <InputLabel id="demo-simple-select-standard-label">{t("trafficIncident.trafficIncidentType")}</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={trafficIncidentType}
                                            onChange={handleChangeTrafficIncidentType}
                                            label="incidentType"
                                            renderValue={selected => (<ListItemText>{selected.value}</ListItemText>)}

                                        >
                                            <MenuItem value="">
                                                <ListItemText>New</ListItemText><ListItemIcon><AddIcon /></ListItemIcon>
                                            </MenuItem>
                                            {incidentTypes.map(incidentType => (
                                                <MenuItem
                                                    key={incidentType.id}
                                                    value={incidentType}
                                                >
                                                    <ListItemText>{incidentType.value}</ListItemText>
                                                    <ListItemIcon><DeleteIcon /></ListItemIcon>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <InputLabel id="demo-multiple-chip-label">Maßnahmen</InputLabel>
                                        <Select
                                            labelId="demo-multiple-chip-label"
                                            id="demo-multiple-chip"
                                            multiple
                                            value={mitigationAction}
                                            onChange={handleChangeAction}
                                            input={<OutlinedInput id="select-multiple-chip" label="Maßnahmen" />}
                                            renderValue={selected => (
                                                <Box sx={{display: "flex", flexWrap: "wrap", gap: 0.5}}>
                                                    {selected.map(value => (
                                                        <Chip key={value} label={value} variant="outlined" sx={{color: "green"}} />

                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {mitigationActions.map(value => (
                                                <MenuItem
                                                    key={value}
                                                    value={value}
                                                >
                                                    {value}
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
                <Button onClick={handleClose} variant="contained" color="error" startIcon={<ErrorIcon />}>Report Mistake</Button>
                <Button onClick={handleClose} variant="contained" color="success" startIcon={<CheckIcon />} autoFocus>
                    Acknowledged
                </Button>
            </DialogActions>
        </Dialog >
    );
}

export default TrafficIncidentDetail;

