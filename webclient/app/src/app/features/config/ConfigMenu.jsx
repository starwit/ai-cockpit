import {Button, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper, Tooltip, Typography} from "@mui/material";

import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import {useEffect, useRef, useState} from "react";


function ConfigMenu() {
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);

    useEffect(function () {
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

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === 'Escape') {
            setOpen(false);
        }
    }

    return <>
        <Tooltip title={t("menu.config")}>
            <IconButton
                size="large"
                onClick={handleToggle}
                ref={anchorRef}
                variant="outlined">
                <SettingsIcon />
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
                                <MenuItem component={Link} to={"/mitigation-action-type"}>
                                    {t("menu.config.mitigationactiontype")}
                                </MenuItem>
                                <MenuItem component={Link} to={"/traffic-incident-type"}>
                                    {t("menu.config.trafficincidenttype")}
                                </MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    </>;

}

export default ConfigMenu;