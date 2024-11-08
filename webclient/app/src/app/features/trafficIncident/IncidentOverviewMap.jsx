import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

function IncidentOverviewMap() {
    return (
        <Container sx={{ mt: 4 }}> {/* mt: 4 adds an indent at the top */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Map View
                </Typography>
                {/* Map content */}
            </Paper>
        </Container>
    );
}

export default IncidentOverviewMap;