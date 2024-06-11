import {Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Grid, List, ListItem} from "@mui/material";
import React from "react";
import ReactPlayer from "react-player";

export const renderActions = params => {
    return (
        <strong>
            {params.row.mitigationAction.map(action => (
                <Chip key={action} label={action} variant="outlined" sx={{color: "green"}} />
            ))}
        </strong>
    );
};

export function renderButton(title) {
    return function getButton(params) {
        return displayButton(params, title);
    };
}

function displayButton(params, title) {
    if (params.row.state === 1) {
        return;
    }
    return (
        <strong>
            <Button
                variant="contained"
                color="primary"
                size="small"
                style={{marginLeft: 16}}
                onClick={() => {
                    console.log("button pressed");
                }}
            >
                {title}
            </Button>
        </strong>
    );
}

export function DetailsDialog(props) {
    const {open, rowData, interpretData, handleClose} = props;

    if (!open) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="1200"
        >
            <DialogTitle id="alert-dialog-title">
                {rowData.incidentType}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <ReactPlayer
                            className='react-player fixed-bottom'
                            url='images/incidents/SampleScene01.mp4'
                            width='70%'
                            height='70%'
                            controls={true}
                            muted={true}
                            playing={true}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container spacing={1} direction="column">
                            <Grid>
                                <List>
                                    {
                                        rowData.mitigationAction.map(action => {
                                            return (
                                                <ListItem key={action}>
                                                    <Chip key={action} label={action} variant="outlined" sx={{color: "green"}} />
                                                </ListItem>
                                            );
                                        })
                                    }
                                </List>
                            </Grid>
                            <Grid>
                                TODO show on map: {interpretData[0].position[0]},{interpretData[0].position[1]}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} >Report Mistake</Button>
                <Button onClick={handleClose} autoFocus>
                    Acknowledged
                </Button>
            </DialogActions>
        </Dialog>
    );
}
