import {Button, Chip} from "@mui/material";

export const renderActions = params => {
    return (
        <strong>
            {params.row.mitigationAction.map(action => (
                <Chip key={action.mitigationActionType.id} label={action.mitigationActionType.name} variant="outlined" sx={{color: "green"}} />
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
