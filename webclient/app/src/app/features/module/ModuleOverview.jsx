import Lan from "@mui/icons-material/Lan";
import {Container, Stack, Typography} from '@mui/material';
import Grid from "@mui/material/Grid";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import ModuleRest from "../../services/ModuleRest";
import ModuleInfo from './ModuleInfo';

function ModuleOverview() {
    const {t} = useTranslation();
    const moduleFunctions = useMemo(() => new ModuleRest(), []);
    const [moduleData, setModuleData] = useState([]);

    useEffect(() => {
        moduleFunctions.getWithDecisions().then((response) => {
            if (response.data == null) {
                return;
            } else {
                setModuleData(response.data);
            }
        });
    }, []);

    return (
        <Container sx={{paddingTop: 2}}>
            <Typography variant="h2" sx={{paddingBottom: 0, marginBottom: 0}}>
                <Lan fontSize="small" /> {t("module.heading")}
            </Typography>
            <Stack direction="row" sx={{marginTop: 1}}>
                <Grid container spacing={2}>
                    {moduleData.map(row => (
                        <Grid size={{xs: 12, sm: 4}} key={row.id}>
                            <ModuleInfo module={row} />
                        </Grid>
                    ))}
                </Grid >
            </Stack>
        </Container>
    )
}

export default ModuleOverview;

