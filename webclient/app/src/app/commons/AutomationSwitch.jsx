import NotificationsPausedOutlinedIcon from '@mui/icons-material/NotificationsPausedOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import NotificationsActiveOutlined from "@mui/icons-material/NotificationsActiveOutlined";
import {ToggleButton, ToggleButtonGroup} from '@mui/material';
import {useTranslation} from 'react-i18next';

function AutomationSwitch() {
    const {t} = useTranslation();

    return (
        <ToggleButtonGroup
            exclusive
            aria-label="Platform"
            size="small"
            sx={{justifyContent: "center", flex: 1}}
        >
            <ToggleButton value="web"><NotificationsActiveOutlined />{t('automation.on')}</ToggleButton>
            <ToggleButton value="android" sx={{borderBottom: 10, borderBottomColor: "#ff3300"}}><NotificationsPausedOutlinedIcon />{t('automation.pause')}</ToggleButton>
            <ToggleButton value="ios"><NotificationsOffOutlinedIcon />{t('automation.stop')}</ToggleButton>
        </ToggleButtonGroup>
    );
}

export default AutomationSwitch;