import React, {useState} from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from '@mui/material';
import {useTranslation} from 'react-i18next';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function DecisionTypeFilter({selectedType, onTypeChange, decisionTypes}) {
    const {t} = useTranslation();
    const [showFilter, setShowFilter] = useState(true);

    const handleTypeChange = (values) => {
        const newValues = values || [];
        if (newValues.includes('all')) {
            if (!selectedType.includes('all')) {    // If 'all' is selected, ensure only 'all' is in the selection
                return ['all'];
            } else {
                const filteredValues = newValues.filter(value => value !== 'all');  // If 'all' was already selected, remove it and keep other selections
                return filteredValues.length ? filteredValues : ['all'];
            }
        }
        return newValues.length ? newValues : ['all'];
    };

    return (
        <>
            {/* Button to toggle filter visibility */}
            <IconButton
                onClick={() => setShowFilter(!showFilter)}
                sx={{
                    position: 'fixed',
                    top: 60,
                    left: showFilter ? 280 : 10, // Position the button based on the filter visibility
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
                    padding: 1,
                    borderRadius: 1,
                    width: '250px'
                }}>
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
                </Box>
            )}
        </>
    );
}

export default DecisionTypeFilter;