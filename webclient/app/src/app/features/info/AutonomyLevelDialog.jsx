import {Box, Container, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Tooltip, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import React from "react";
import HdrAuto from "@mui/icons-material/HdrAuto";
import CloseIcon from "@mui/icons-material/Close";

function AutonomyLevelDialog(props) {
    const {openDialog} = props;
    const [open, setOpen] = React.useState(openDialog);
    const {t} = useTranslation();
    const anchorRef = React.useRef(null);

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(function () {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    function handleToggle() {
        setOpen((prevOpen) => !prevOpen);
    };

    function handleClose(event) {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <Tooltip title={t("menu.autonomy")}>
                <IconButton
                    size="large"
                    onClick={handleToggle}
                    ref={anchorRef}
                    variant="outlined"
                    color="secondary"
                >
                    <HdrAuto />
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                onClose={handleClose}>
                <DialogTitle><Typography variant="h2">{t("menu.autonomy")}</Typography></DialogTitle>
                <IconButton
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500]
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <Stack>
                        <Typography variant="body2" textAlign="justify">
                            {t("autonomy.description")}
                        </Typography>
                        <Typography variant="body2">
                            {t("autonomy.executionPolicy.description")}
                        </Typography>
                        <Stack>
                            <Box>
                                <Typography variant="h6">{t("actiontype.policy.manual")}:</Typography>
                                <Typography variant="body2">{t("actiontype.policy.manual.description")}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6">{t("actiontype.policy.withcheck")}:</Typography>
                                <Typography variant="body2">{t("actiontype.policy.withcheck.description")}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6">{t("actiontype.policy.automated")}:</Typography>
                                <Typography variant="body2">{t("actiontype.policy.automated.description")}</Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AutonomyLevelDialog;
