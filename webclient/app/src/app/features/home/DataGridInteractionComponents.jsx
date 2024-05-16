import {Button, Chip, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from "@mui/material";
import React, {useState, useMemo, useEffect} from "react";

export const renderActions = params => {
    return (
        <strong>
            {params.row.actions.map(action => (
                <Chip key={action} label={action} variant="outlined" sx={{color: "green"}} />
            ))}
        </strong>
    );
};

export const renderButton = title => params => {
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
                    console.log("action button pressed");
                }}
            >
                {title}
            </Button>
        </strong >
    );
};

export function DetailsDialog(props) {
    const {open} = props;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Incident Details
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Incident Details
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button>Help</Button>
                <Button autoFocus>
                    Acknoledged
                </Button>
            </DialogActions>
        </Dialog>
    );
};

