import React, {useState, useEffect, useMemo} from 'react';
import {IconButton} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DecisionRest from '../../services/DecisionRest';
import DecisionResultPanel from './DecisionResultPanel';
import DecisionDetail from './DecisionDetail';
import DecisionTypeFilter from './DecisionTypeFilter';
import DecisionHeatmap from './DecisionHeatmap';

function DecisionHeatmapView() {
    const [selectedType, setSelectedType] = useState(['all']);
    // Add state and time filters
    const [selectedStates, setSelectedStates] = useState([]);
    const [timeFilter, setTimeFilter] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [decisions, setDecisions] = useState([]);
    const [hoveredDecisions, setHoveredDecisions] = useState(null);
    const decisionRest = new DecisionRest();
    const [showPanel, setShowPanel] = useState(true);
    const [selectedDecisions, setSelectedDecisions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowData, setRowData] = useState({});
    const [automaticNext, setAutomaticNext] = useState(false);

    // Get all decision types for the filter
    const decisionTypes = Array.from(
        new Set(
            decisions
                .filter(decision => decision.decisionType?.name)
                .map(decision => decision.decisionType.name)
        )
    );

    // Pre-filtered decisions for counting
    const filteredDecisions = useMemo(() => {
        if (!Array.isArray(decisions) || decisions.length === 0) return [];

        return decisions.filter(decision => {
            // Validate required location data
            if (!decision?.cameraLatitude || !decision?.cameraLongitude) {
                return false;
            }

            // Apply type filter
            const typeMatch = selectedType.includes('all') ||
                (decision.decisionType && selectedType.includes(decision.decisionType.name));
            if (!typeMatch) return false;

            // Apply state filter
            if (selectedStates.length > 0) {
                // Default to 'NEW' state if not set
                const decisionState = decision.state || 'NEW';
                if (!selectedStates.includes(decisionState)) {
                    return false;
                }
            }

            // Apply time range filter
            if (timeFilter === -1 && startDate && endDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                const decisionTime = new Date(decision.acquisitionTime);
                if (!(decisionTime >= start && decisionTime <= end)) return false;
            } else if (timeFilter > 0) {
                const cutoffTime = new Date();
                cutoffTime.setHours(cutoffTime.getHours() - timeFilter);
                const decisionTime = new Date(decision.acquisitionTime);
                if (!(decisionTime >= cutoffTime)) return false;
            }

            return true;
        });
    }, [decisions, selectedType, selectedStates, timeFilter, startDate, endDate]);

    useEffect(() => {
        reloadDecisions();
        const interval = setInterval(reloadDecisions, 5000);
        return () => clearInterval(interval);
    }, []);

    function reloadDecisions() {
        decisionRest.findAll().then(response => {
            if (response.data) {
                setDecisions(response.data);
            }
        });
    }

    function handleOpenDecision(pickingInfo) {
        if (pickingInfo.object) {
            setSelectedDecisions(pickingInfo.object);
            setDialogOpen(true);
            setRowData(pickingInfo.object[0]);
        }
    }

    function handleNext(data, index) {
        const nextIndex = index + 1;
        if (nextIndex < data.length) {
            setRowData(data[nextIndex]);
        } else {
            setRowData(data[0]);
        }
    }

    function handleBefore(data, index) {
        const nextIndex = index - 1;
        if (nextIndex >= 0) {
            setRowData(data[nextIndex]);
        } else {
            setRowData(data[data.length - 1]);
        }
    }

    function handleClose() {
        setDialogOpen(false);
    }

    function toggleAutomaticNext() {
        setAutomaticNext(!automaticNext);
    }

    function handleSave(actionTypes, decisionType, description, state) {
        const foundDecision = selectedDecisions.find(value => value.id === rowData.id);
        if (foundDecision) {
            foundDecision.decisionType = decisionType;
            foundDecision.description = description;
            foundDecision.state = state;

            decisionRest.update(foundDecision).then(() => {
                if (automaticNext) {
                    handleNext(selectedDecisions, selectedDecisions.findIndex(value => value.id === rowData.id));
                } else {
                    setDialogOpen(false);
                }
            });
        } else {
            setDialogOpen(false);
        }
    }

    function renderDialog() {
        if (!dialogOpen) {
            return null;
        }
        return (
            <DecisionDetail
                open={dialogOpen}
                handleClose={handleClose}
                handleSave={handleSave}
                handleNext={handleNext}
                handleBefore={handleBefore}
                rowData={rowData}
                automaticNext={automaticNext}
                toggleAutomaticNext={toggleAutomaticNext}
                data={selectedDecisions}
                showMap={false}
            />
        );
    }

    return (
        <>
            <DecisionTypeFilter
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                decisionTypes={decisionTypes}
                // Pass the state and time filters to the filter
                selectedStates={selectedStates}
                onStateChange={setSelectedStates}
                timeFilter={timeFilter}
                onTimeFilterChange={setTimeFilter}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
                filteredCount={filteredDecisions.length}
            />
            <DecisionHeatmap
                decisions={decisions}
                onHover={info => {
                    if (info.object) {
                        setHoveredDecisions(info.object);
                    }
                }}
                onClick={handleOpenDecision}
                selectedTypes={selectedType}
                // Pass the state and time filters to the heatmap
                selectedStates={selectedStates}
                timeFilter={timeFilter}
                startDate={startDate}
                endDate={endDate}
            />
            <IconButton
                onClick={() => setShowPanel(!showPanel)}
                sx={{
                    bgcolor: 'white',
                    position: 'fixed',
                    right: showPanel ? 330 : 10,
                }}
                size="small"
            >
                {showPanel ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>

            <DecisionResultPanel
                show={showPanel}
                decisions={hoveredDecisions}
            />
            {renderDialog()}
        </>
    );
}

export default DecisionHeatmapView;