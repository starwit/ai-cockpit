import {Button, Chip} from "@mui/material";

export const renderActions = params => {
    params.row.action.sort((a, b) => a.actionType.name.localeCompare(b.actionType.name));
    return (
        <strong>
            {params.row.action.map(action => (
                <Chip key={action.actionType.id} label={action.actionType.name} variant="outlined" sx={{color: "green"}} />
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
