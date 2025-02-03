import HdrAuto from "@mui/icons-material/HdrAuto";
import CloseIcon from "@mui/icons-material/Close";
import {Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";

function AutonomyLevelDialog(props) {
    const {open, setOpen} = props;
    const {t} = useTranslation();


    function handleClose() {
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                placement="bottom-start"
                onClose={handleClose}>
                <DialogTitle><HdrAuto fontSize="small" /> <Typography variant="h2" component="span">{t("menu.autonomy")}</Typography></DialogTitle>
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
