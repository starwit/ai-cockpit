import NotificationsPausedOutlinedIcon from '@mui/icons-material/NotificationsPausedOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import NotificationsActiveOutlined from "@mui/icons-material/NotificationsActiveOutlined";
import {ToggleButton, ToggleButtonGroup} from '@mui/material';
import {useTranslation} from 'react-i18next';
import AutomationRest from '../services/AutomationRest';
import {useEffect, useMemo, useState} from 'react';
import {useTheme} from "@mui/material/styles";



function AutomationSwitch() {
    const {t} = useTranslation();
    const theme = useTheme();
    const automationRest = useMemo(() => new AutomationRest(), []);
    const [automation, setAutomation] = useState("AUTOMATIC");

    useEffect(() => {
        loadAutomation();
    }, []);

    function loadAutomation() {
        automationRest.find().then(response => {
            if (response.data == null) {
                return;
            }
            setAutomation(response.data);
        });
    }

    function handleAutomation(event, newAutomation) {
        automationRest.update(newAutomation).then(response => {
            if (response.data == null) {
                return;
            }
            setAutomation(response.data);
        });
    }

    return (
        <ToggleButtonGroup
            value={automation}
            exclusive
            onChange={handleAutomation}
            aria-label="Platform"
            size="small"
        >
            <ToggleButton
                value="AUTOMATIC"
                sx={{
                    borderBottom: automation === "AUTOMATIC" ? 8 : 0,
                    borderBottomColor: automation === "AUTOMATIC" ? theme.palette.success.main : ""
                }}>
                <NotificationsActiveOutlined />{t('automation.on')}
            </ToggleButton>
            <ToggleButton
                value="WITHCHECK"
                sx={{
                    borderBottom: automation === "WITHCHECK" ? 8 : 0,
                    borderBottomColor: automation === "WITHCHECK" ? theme.palette.warning.main : ""
                }}>
                <NotificationsPausedOutlinedIcon />{t('automation.pause')}</ToggleButton>
            <ToggleButton
                value="MANUAL"
                sx={{
                    borderBottom: automation === "MANUAL" ? 8 : 0,
                    borderBottomColor: automation === "MANUAL" ? theme.palette.error.main : ""
                }}>
                <NotificationsOffOutlinedIcon />{t('automation.stop')}
            </ToggleButton>
        </ToggleButtonGroup>
    );
}

export default AutomationSwitch;