import {Button, Chip, Tooltip} from "@mui/material";
import {useTranslation} from "react-i18next";
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import NotificationsPausedOutlinedIcon from '@mui/icons-material/NotificationsPausedOutlined';
import NotificationsOffOutlinedIcon from '@mui/icons-material/NotificationsOffOutlined';
import DoneIcon from '@mui/icons-material/Done';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export function renderActions(params) {
    const {t} = useTranslation();
    params.row.action.sort((a, b) => a.actionType.name.localeCompare(b.actionType.name));

    function renderIcon(executionPolicy) {
        if (executionPolicy == undefined || executionPolicy == null) {
            return (<></>);
        }
        switch (executionPolicy) {
            case "MANUAL":
                return (<NotificationsOffOutlinedIcon fontSize="small" sx={{opacity: 0.4}}></NotificationsOffOutlinedIcon>);
            case "WITHCHECK":
                return (<NotificationsPausedOutlinedIcon fontSize="small" sx={{opacity: 0.4}}></NotificationsPausedOutlinedIcon>);
            case "AUTOMATIC":
                return (<NotificationsActiveOutlinedIcon fontSize="small" sx={{opacity: 0.4}}></NotificationsActiveOutlinedIcon>);
            default:
                return (<></>);
        }
    }

    function renderExecutionIcon(actionState) {
        if (actionState == undefined || actionState == null) {
            return (<></>);
        }
        switch (actionState) {
            case "DONE":
                return (<DoneIcon></DoneIcon>);
            case "CANCELED":
                return (<ErrorOutlineIcon></ErrorOutlineIcon>);
            default:
                return (<></>);
        }

    }

    return (
        <>
            {params.row.action.map(action => (
                <Tooltip key={"t-" + action.id} title={createActionTooltip(action.state, t)}>
                    <Chip
                        key={action.actionType.id}
                        color={determineActionColor(action.state)}
                        label={action.actionType.name}
                        variant="outlined"
                        icon={renderIcon(action.actionType.executionPolicy)}
                        deleteIcon={renderExecutionIcon(action.state)}
                        onDelete="{() => ()}"
                    />
                </Tooltip>
            ))
            }
        </>
    );
};

export function createActionTooltip(actionState, t) {
    if (actionState == undefined || actionState == null) {
        return t("decision.action.new")
    }
    switch (actionState) {
        case "DONE":
            return t("decision.action.done")
        case "CANCELED":
            return t("decision.action.canceled")
        default:
            return t("decision.action.new")
    }
}

export function determineActionColor(actionState) {
    if (actionState == undefined || actionState == null) {
        return "primary"
    }
    switch (actionState) {
        case "DONE":
            return "success"
        case "CANCELED":
            return "error"
        default:
            return "primary"
    }
}

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
            >
                {title}
            </Button>
        </strong>
    );
}
