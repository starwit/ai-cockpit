import MapIcon from '@mui/icons-material/Map';
import {Box, IconButton, Menu, MenuItem, Tooltip} from '@mui/material';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';


function MapMenu(props) {
    const {disabled, moduleId} = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const {t} = useTranslation();
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (path) => {
        navigate(path);
        handleClose();
    };

    return (
        <>
            <Tooltip title={t('map.tooltip')}>
                <Box>
                    <IconButton
                        onClick={handleClick}
                        size="large"
                        variant="outlined"
                        disabled={disabled}
                    >
                        <MapIcon />
                    </IconButton>
                </Box>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('/decision-map-view/' + moduleId)}>
                    {t('map.normal')}
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('/decision-heatmap-view/' + moduleId)}>
                    {t('map.heatmap')}
                </MenuItem>
            </Menu>
        </>
    );
}

export default MapMenu;