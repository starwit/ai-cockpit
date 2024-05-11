import {Container, Typography, Button, Stack} from "@mui/material";
import React, {useState, useMemo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {OverviewTable} from "@starwit/react-starwit";
import AutonomyLevelRest from "../../services/AutonomyLevelRest";
import {useHistory} from "react-router";
import {autonomyLevelOverviewFields} from "../../modifiers/AutonomyLevelModifier";

function AutonomyLevelOverview() {
    const [selected, setSelected] = useState(undefined);
    const {t} = useTranslation();
    const autonomylevelRest = useMemo(() => new AutonomyLevelRest(), []);
    const history = useHistory();
    const [autonomyLevelAll, setAutonomyLevelAll] = useState();

    useEffect(() => {
        reload();
    }, []);

    function reload() {
        autonomylevelRest.findAll().then(response => {
            setAutonomyLevelAll(response.data);
        });
    }

    function goToCreate() {
        history.push("/autonomylevel/create");
    }

    function goToUpdate() {
        if (!!selected) {
            history.push("/autonomylevel/update/" + selected.id);
            setSelected(undefined);
        }
    }

    function handleDelete() {
        if (!!selected) {
            autonomylevelRest.delete(selected.id).then(reload);
            setSelected(undefined);
        }
    }

    return (
        <Container>
            <Typography variant={"h2"} gutterBottom>{t("autonomyLevel.title")}</Typography>
            <Stack spacing={2} direction={"row"}>
                <Button onClick={goToCreate} variant="contained" color="secondary">{t("button.create")}</Button>
                <Button onClick={goToUpdate} variant="contained" color="secondary" disabled={!selected?.id} >
                    {t("button.update")}
                </Button>
                <Button onClick={handleDelete} variant="contained" color="secondary" disabled={!selected?.id}>
                    {t("button.delete")}
                </Button>
            </Stack>
            <OverviewTable
                entities={autonomyLevelAll}
                prefix={"autonomyLevel"}
                selected={selected}
                onSelect={setSelected}
                fields={autonomyLevelOverviewFields}/>
        </Container>
    );
}

export default AutonomyLevelOverview;
