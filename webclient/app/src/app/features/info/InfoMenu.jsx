import HdrAuto from "@mui/icons-material/HdrAuto";
import Info from "@mui/icons-material/Info";
import Lan from "@mui/icons-material/Lan";
import {ClickAwayListener, Grow, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper, Tooltip} from "@mui/material";
import React from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import AutonomyLevelDialog from "./AutonomyLevelDialog";


function ConfigMenu() {
    const {t} = useTranslation();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [openDialog, setOpenDialog] = React.useState(false);

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

    function handleOpenDialog() {
        setOpen(false);
        setOpenDialog(true);
    }

    function handleClose(event) {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    return <>
        <Tooltip title={t("menu.info")}>
            <IconButton
                size="large"
                onClick={handleToggle}
                ref={anchorRef}
                variant="outlined">
                <Info />
            </IconButton>
        </Tooltip>
        <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            disablePortal
        >
            {({TransitionProps, placement}) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin:
                            placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList
                                autoFocusItem={open}
                                id="composition-menu"
                                aria-labelledby="composition-button"
                                onKeyDown={handleListKeyDown}
                            >
                                <MenuItem component={Link} to={"/info/component-breakdown"} onClick={handleClose}>
                                    <ListItemIcon><Lan fontSize="small" /></ListItemIcon>
                                    <ListItemText>{t("menu.info.componentbreakdown")}</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={handleOpenDialog}>
                                    <ListItemIcon><HdrAuto fontSize="small" /></ListItemIcon>
                                    <ListItemText>{t("menu.autonomy")}</ListItemText>
                                </MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
        <AutonomyLevelDialog open={openDialog} setOpen={setOpenDialog} />
    </>;

}

export default ConfigMenu;
