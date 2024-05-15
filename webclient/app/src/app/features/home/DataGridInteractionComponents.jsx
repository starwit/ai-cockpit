import {Button, Chip} from "@mui/material";

export const renderActions = params => {
    return (
        <strong>
            {params.row.actions.map(action => (
                <Chip key={action} label={action} variant="outlined" sx={{color: "green"}} />
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
                onClick={() => {
                    console.log("button pressed");
                }}
            >
                {title}
            </Button>
        </strong>
    );
}
