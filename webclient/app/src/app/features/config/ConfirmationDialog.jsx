import React, {useState} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import {useTranslation} from "react-i18next";
import {DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import PropTypes from "prop-types";

function ConfirmationDialog(props) {
    const {open, onClose, onSubmit, title, message, confirmTitle, submitMessage} = props;
    const {t} = useTranslation();

    return (
        <Dialog sx={{zIndex: 10000}}
            open={open}
            onClose={onClose}
            aria-labelledby={t("confirm.dialog.title")}
            aria-describedby={t("confirm.dialog.description")}
        >
            <DialogTitle id={t("confirm.dialog.title")}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id={t("confirm.dialog.description")}>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t("button.cancel")}</Button>
                <Button onClick={onSubmit} autoFocus>{submitMessage}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ConfirmationDialog.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    open: PropTypes.bool,
    confirmTitle: PropTypes.string
};

export default ConfirmationDialog;