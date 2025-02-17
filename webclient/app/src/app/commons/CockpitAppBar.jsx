import {
    AppBar,
    Container,
    Divider,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    Menu,
    Box
} from "@mui/material";
import ViewListIcon from '@mui/icons-material/ViewList';
import FilterListIcon from '@mui/icons-material/FilterList'; // FilterListIcon
import {useTranslation} from 'react-i18next';
import React, {useState} from "react";
import general from "../assets/images/general_Logo.png";
import kic from "../assets/images/kic_Logo.png";
import ConfigMenu from "../features/config/ConfigMenu";
import InfoMenu from "../features/info/InfoMenu";
import MapMenu from "./MapMenu";
import DecisionFilters from "../features/decision/DecisionFilters";
import {useLocation} from 'react-router-dom';

function CockpitAppBar({onFiltersChange}) {
    const {t} = useTranslation();
    const location = useLocation();
    const themeName = import.meta.env.VITE_THEME;
    const themeMap = {general, kic};
    const DynamicLogo = themeMap[themeName];

    // State to manage the filter menu
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);

    // Check if we're on a map view to determine if we should show filters
    const isMapView = location.pathname === '/decision-map-view' ||
        location.pathname === '/decision-heatmap-view';

    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFiltersChange = (filters) => {
        if (onFiltersChange) {
            onFiltersChange(filters);
        }
    };

    return (
        <Container>
            <AppBar color="secondary">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        href="./"
                        aria-label="menu"
                        sx={{m: 0, p: 0, mr: 2}}
                    >
                        <img src={DynamicLogo} height={40} alt="KI-Cockpit" />
                    </IconButton>
                    <Typography variant="h1" component="div" sx={{flexGrow: 1}}>
                        {import.meta.env.VITE_TITLE}
                    </Typography>

                    {/*Show filter button only on map page*/}
                    {isMapView && (
                        <Tooltip title={t('filters.tooltip')}>
                            <IconButton
                                onClick={handleFilterClick}
                                size="large"
                                variant="outlined"
                                color="primary"
                            >
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    )}

                    <Tooltip title={t('list.tooltip')}>
                        <IconButton
                            href="./"
                            size="large"
                            variant="outlined">
                            <ViewListIcon />
                        </IconButton>
                    </Tooltip>
                    <MapMenu />
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <ConfigMenu />
                    <InfoMenu />
                </Toolbar>
            </AppBar>

            {/* Filter Menu */}
            <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
                PaperProps={{
                    sx: {
                        width: '800px',
                        maxWidth: '90vw',
                        mt: 2
                    }
                }}
            >
                <Box sx={{p: 2}}>
                    <DecisionFilters
                        onFiltersChange={(filters) => {
                            handleFiltersChange(filters);
                            // Don't close the menu after applying filters
                            // to allow for multiple changes
                        }}
                    />
                </Box>
            </Menu>
        </Container>
    );
}

export default CockpitAppBar;