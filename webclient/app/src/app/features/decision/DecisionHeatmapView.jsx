import React, {useState, useEffect} from 'react';
import {IconButton} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DecisionRest from '../../services/DecisionRest';
import DecisionResultPanel from './DecisionResultPanel';
import DecisionDetail from './DecisionDetail';
import DecisionTypeFilter from './DecisionTypeFilter';
import DecisionHeatmap from './DecisionHeatmap';

function DecisionHeatmapView({filters}) {
    const [selectedType, setSelectedType] = useState(['all']);
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
        const actionTypeIds = actionTypes.map(actionType => actionType['id']);

        if (foundDecision) {
            foundDecision.decisionType = decisionType;
            foundDecision.description = description;
            foundDecision.state = state;

            decisionRest.updateWithActions(foundDecision, actionTypeIds).then(() => {
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

    return (
        <>
            <DecisionTypeFilter
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                decisionTypes={decisionTypes}
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
                filters={filters}
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
            {dialogOpen && (
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
            )}
        </>
    );
}

export default DecisionHeatmapView;