import React, {useState, useEffect} from 'react';
import {
    Box,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    TextField,
    Paper,
    Stack
} from '@mui/material';
import {useTranslation} from 'react-i18next';

// Define constants at the component level for better maintainability
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

function DecisionFilters({onFiltersChange}) {
    const {t} = useTranslation();

    // Initialize state with default values
    const [selectedStates, setSelectedStates] = useState([]);
    const [timeFilter, setTimeFilter] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Ensure we have a valid callback function
    const handleFiltersChange = (newFilters) => {
        if (typeof onFiltersChange === 'function') {
            onFiltersChange(newFilters);
        }
    };

    // Handle state checkbox changes
    const handleStateChange = (stateName, checked) => {
        const newStates = checked
            ? [...selectedStates, stateName]
            : selectedStates.filter(s => s !== stateName);

        setSelectedStates(newStates);
        handleFiltersChange({
            selectedStates: newStates,
            timeFilter,
            startDate,
            endDate
        });
    };

    // Handle time filter changes
    const handleTimeFilterChange = (value) => {
        const newTimeFilter = Number(value);
        setTimeFilter(newTimeFilter);

        // Reset date fields if not using custom range
        if (newTimeFilter !== -1) {
            setStartDate('');
            setEndDate('');
            handleFiltersChange({
                selectedStates,
                timeFilter: newTimeFilter,
                startDate: '',
                endDate: ''
            });
        } else {
            handleFiltersChange({
                selectedStates,
                timeFilter: newTimeFilter,
                startDate,
                endDate
            });
        }
    };

    // Handle date changes
    const handleDateChange = (type, value) => {
        if (type === 'start') {
            setStartDate(value);
            handleFiltersChange({
                selectedStates,
                timeFilter,
                startDate: value,
                endDate
            });
        } else {
            setEndDate(value);
            handleFiltersChange({
                selectedStates,
                timeFilter,
                startDate,
                endDate: value
            });
        }
    };

    return (
        <Paper sx={{p: 2, display: 'flex', gap: 2}}>
            <Stack direction="row" spacing={2} alignItems="center">
                {/* State filters */}
                <FormGroup row>
                    {STATES.map(({id, name}) => (
                        <FormControlLabel
                            key={`state-label-${id}`}
                            control={
                                <Checkbox
                                    checked={selectedStates.includes(name)}
                                    onChange={(e) => handleStateChange(name, e.target.checked)}
                                    size="small"
                                />
                            }
                            label={t(`decision.state.${name.toLowerCase()}`)}
                        />
                    ))}
                </FormGroup>

                {/* Time range filter */}
                <Box sx={{minWidth: 200}}>
                    <FormControl fullWidth size="small">
                        <InputLabel>{t('time.range')}</InputLabel>
                        <Select
                            value={timeFilter}
                            onChange={(e) => handleTimeFilterChange(e.target.value)}
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
                    <Stack direction="row" spacing={2}>
                        <TextField
                            type="date"
                            label={t('time.range.start')}
                            value={startDate}
                            onChange={(e) => handleDateChange('start', e.target.value)}
                            size="small"
                            InputLabelProps={{shrink: true}}
                        />
                        <TextField
                            type="date"
                            label={t('time.range.end')}
                            value={endDate}
                            onChange={(e) => handleDateChange('end', e.target.value)}
                            size="small"
                            InputLabelProps={{shrink: true}}
                            inputProps={{min: startDate}}
                        />
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}

export default DecisionFilters;