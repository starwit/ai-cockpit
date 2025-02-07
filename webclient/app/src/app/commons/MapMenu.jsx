import React, {useState} from 'react';
import {IconButton, Menu, MenuItem, Tooltip} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

function MapMenu() {
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
                <IconButton
                    onClick={handleClick}
                    size="large"
                    variant="outlined"
                >
                    <MapIcon />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('/decision-map-view')}>
                    {t('map.normal')}
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('/decision-heatmap-view')}>
                    {t('map.heatmap')}
                </MenuItem>
            </Menu>
        </>
    );
}

export default MapMenu;