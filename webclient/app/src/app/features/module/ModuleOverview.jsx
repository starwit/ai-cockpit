import Lan from "@mui/icons-material/Lan";
import {Box, Container, Stack, Tab, Tabs, Typography} from '@mui/material';
import Grid from "@mui/material/Grid";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import ModuleRest from "../../services/ModuleRest";
import ModuleInfo from './ModuleInfo';

function ModuleOverview() {
    const {t} = useTranslation();
    const moduleFunctions = useMemo(() => new ModuleRest(), []);
    const [groupedModules, setGroupedModules] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedName, setSelectedName] = useState();

    useEffect(() => {
        moduleFunctions.getWithDecisions().then((response) => {
            if (response.data == null) {
                return;
            } else {
                reload(response.data);

            }
        });
    }, []);

    useEffect(() => {
        if (applications) {
            setSelectedName(applications[selectedIndex]);
        }
    }, [selectedIndex, applications])

    function reload(data) {
        let grouped = groupByApplication(data);
        setGroupedModules(grouped);
        setApplications(Object.keys(grouped));
    }

    function handleChange(event, newValue) {
        setSelectedIndex(newValue);
        setSelectedName(applications[newValue]);
    };

    // Group users by name
    function groupByApplication(moduleData) {
        const map = {};
        moduleData.forEach(module => {
            if (!map[module.applicationIdentifier]) {
                map[module.applicationIdentifier] = [];
            }
            map[module.applicationIdentifier].push(module);
        });
        return map;
    };

    function renderApplicationsName() {
        if (applications) {
            return (
                applications.map((name, index) => (
                    <Tab label={name} key={index} />
                ))
            );
        }
    }

    function renderGroupedModules() {
        if (groupedModules[selectedName]) {
            return (
                groupedModules[selectedName].map(row => (
                    <Grid key={row.id} size={{xs: 4, md: 4}} sx={{minWidth: 550}}>
                        <ModuleInfo module={row} />
                    </Grid>
                ))

            );
        }
    }

    return (
        <Container sx={{paddingTop: 2}}>
            <Stack direction="row">
                <Tabs
                    value={selectedIndex}
                    onChange={handleChange}
                    orientation="vertical"
                    variant="scrollable"
                >
                    {renderApplicationsName()}
                </Tabs>
                <Container>
                    <Typography variant="h2">
                        <Lan fontSize="small" /> {t("module.heading")}
                    </Typography>
                    <Grid container spacing={2} sx={{paddingTop: 2}}>
                        {renderGroupedModules()}
                    </Grid >
                </Container>
            </Stack>
        </Container>
    )
}

export default ModuleOverview;

