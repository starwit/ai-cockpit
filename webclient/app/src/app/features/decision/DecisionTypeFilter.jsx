import React, {useState} from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Divider,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    TextField,
    Paper
} from '@mui/material';
import {useTranslation} from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Constants from DecisionHeatmap.jsx
const STATES = [
    {id: 'NEW', name: 'NEW'},
    {id: 'ACCEPTED', name: 'ACCEPTED'},
    {id: 'REJECTED', name: 'REJECTED'}
];

const TIME_FILTERS = [
    {value: -1, label: 'time.range.custom'},
    {value: 0, label: 'time.range.allTime'},
    {value: 1, label: 'time.range.lastHour'},
    {value: 3, label: 'time.range.last3Hours'},
    {value: 6, label: 'time.range.last6Hours'},
    {value: 12, label: 'time.range.last12Hours'},
    {value: 24, label: 'time.range.last24Hours'}
];

function DecisionTypeFilter({
    selectedType,
    onTypeChange,
    decisionTypes,
    // New props for state and time filters
    selectedStates = [],
    onStateChange = () => { },
    timeFilter = 0,
    onTimeFilterChange = () => { },
    startDate = '',
    onStartDateChange = () => { },
    endDate = '',
    onEndDateChange = () => { },
    filteredCount = 0
}) {
    const {t} = useTranslation();
    const [showFilter, setShowFilter] = useState(true);

    const handleTypeChange = (values) => {
        const newValues = values || [];
        if (newValues.includes('all')) {
            if (!selectedType.includes('all')) {
                return ['all'];
            } else {
                const filteredValues = newValues.filter(value => value !== 'all');
                return filteredValues.length ? filteredValues : ['all'];
            }
        }
        return newValues.length ? newValues : ['all'];
    };

    return (
        <>
            <IconButton
                onClick={() => setShowFilter(!showFilter)}
                sx={{
                    position: 'fixed',
                    top: 60,
                    left: showFilter ? 280 : 10,
                    zIndex: 1,
                    bgcolor: 'white'
                }}
                size="small"
            >
                {showFilter ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            {showFilter && (
                <Box sx={{
                    position: 'fixed',
                    top: 60,
                    left: 10,
                    zIndex: 1,
                    backgroundColor: 'white',
                    padding: 0,
                    borderRadius: 1,
                    width: '250px',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}>
                    <Paper elevation={3} sx={{p: 2}}>
                        {/* Decision Type Filter */}
                        <FormControl fullWidth>
                            <InputLabel>{t('decision.type.filter')}</InputLabel>
                            <Select
                                multiple
                                value={selectedType || ['all']}
                                onChange={(e) => onTypeChange(handleTypeChange(e.target.value))}
                                label={t('decision.type.filter')}
                                renderValue={(selected) => {
                                    return selected.map(value =>
                                        value === 'all' ? t('decision.type.all') : value
                                    ).join(', ');
                                }}
                                size="small"
                            >
                                <MenuItem
                                    value="all"
                                    sx={{fontWeight: selectedType.includes('all') ? 'bold' : 'normal'}}
                                >
                                    {t('decision.type.all')}
                                </MenuItem>
                                {decisionTypes.map(type => (
                                    <MenuItem
                                        key={type}
                                        value={type}
                                        sx={{fontWeight: selectedType.includes(type) ? 'bold' : 'normal'}}
                                    >
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* State filter section */}
                        <Divider sx={{marginY: 2}} />
                        <Typography variant="subtitle2" gutterBottom>
                            {t('decision.state')}
                        </Typography>
                        <FormGroup row>
                            {STATES.map(({id, name}) => (
                                <FormControlLabel
                                    key={`state-label-${id}`}
                                    control={
                                        <Checkbox
                                            key={`state-checkbox-${id}`}
                                            checked={selectedStates.includes(name)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    onStateChange([...selectedStates, name]);
                                                } else {
                                                    onStateChange(selectedStates.filter(s => s !== name));
                                                }
                                            }}
                                            size="small"
                                        />
                                    }
                                    label={t(`decision.state.${name.toLowerCase()}`)}
                                />
                            ))}
                        </FormGroup>

                        {/* Time filter section */}
                        <Divider sx={{marginY: 2}} />
                        <Box sx={{marginTop: 2}}>
                            <FormControl fullWidth size="small">
                                <InputLabel>{t('time.range')}</InputLabel>
                                <Select
                                    value={timeFilter}
                                    onChange={(e) => {
                                        onTimeFilterChange(e.target.value);
                                        // Clear date range if not custom filter
                                        if (e.target.value !== -1) {
                                            onStartDateChange('');
                                            onEndDateChange('');
                                        }
                                    }}
                                    label={t('time.range')}
                                >
                                    {TIME_FILTERS.map((filter) => (
                                        <MenuItem key={filter.value} value={filter.value}>
                                            {t(filter.label)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Custom date range inputs */}
                        {timeFilter === -1 && (
                            <Box sx={{mt: 2}}>
                                <TextField
                                    type="date"
                                    label={t('time.range.start')}
                                    value={startDate}
                                    onChange={(e) => onStartDateChange(e.target.value)}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{shrink: true}}
                                    sx={{mb: 1}}
                                />
                                <TextField
                                    type="date"
                                    label={t('time.range.end')}
                                    value={endDate}
                                    onChange={(e) => onEndDateChange(e.target.value)}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{shrink: true}}
                                    inputProps={{min: startDate}}
                                />
                            </Box>
                        )}

                        <Typography variant="caption" sx={{marginTop: 2, display: 'block'}}>
                            {t('decision.found', {count: filteredCount})}
                        </Typography>
                    </Paper>
                </Box>
            )}
        </>
    );
}

export default DecisionTypeFilter;