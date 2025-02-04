import {Button, Chip, Tooltip} from "@mui/material";
import {useTranslation} from "react-i18next";

export const renderActions = params => {
    const {t} = useTranslation();
    params.row.action.sort((a, b) => a.actionType.name.localeCompare(b.actionType.name));
    return (
        <strong>
            {params.row.action.map(action => (
                <Tooltip key={"tooltip-" + action.id} title={action.state == 'DONE' ? t("decision.action.done") : ""}>
                    <Chip key={action.actionType.id} color={action.state == 'DONE' ? "success" : "primary"} label={action.actionType.name} variant="outlined" />
                </Tooltip>
            ))}
        </strong>
    );
};

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
