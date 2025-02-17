import React, {createContext, useState, useContext} from 'react';

// Create a context for filters
const DecisionFilterContext = createContext();

// The provider component that will wrap app
export function DecisionFilterProvider({children}) {
    // Keep the naming consistent throughout the application
    const [filters, setFilters] = useState({
        selectedStates: [],
        timeFilter: 0,
        startDate: '',
        endDate: ''
    });

    // This is the function that all components will use to update filters
    function updateFilters(newFilters) {
        setFilters(newFilters);
    }

    // Provide both the filters state and the update function
    const value = {
        filters,
        updateFilters
    };

    return (
        <DecisionFilterContext.Provider value={value}>
            {children}
        </DecisionFilterContext.Provider>
    );
}

// Custom hook to use the filter context
export function useDecisionFilters() {
    const context = useContext(DecisionFilterContext);
    if (!context) {
        throw new Error('useDecisionFilters must be used within a DecisionFilterProvider');
    }
    return context;
}