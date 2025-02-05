import {Button, Chip, Tooltip} from "@mui/material";
import {useTranslation} from "react-i18next";

export function renderActions(params) {
    const {t} = useTranslation();
    params.row.action.sort((a, b) => a.actionType.name.localeCompare(b.actionType.name));

    return (
        <>
            {params.row.action.map(action => (
                <Tooltip key={"t-" + action.id} title={createActionTooltip(action.state, t)}>
                    <Chip key={action.actionType.id} color={determineActionColor(action.state)} label={action.actionType.name} variant="outlined" />
                </Tooltip>
            ))}
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
