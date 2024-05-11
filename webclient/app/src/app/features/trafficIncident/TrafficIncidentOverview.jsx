import {Container, Typography, Button, Stack} from "@mui/material";
import React, {useState, useMemo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {OverviewTable} from "@starwit/react-starwit";
import TrafficIncidentRest from "../../services/TrafficIncidentRest";
import {useHistory} from "react-router";
import {trafficIncidentOverviewFields} from "../../modifiers/TrafficIncidentModifier";

function TrafficIncidentOverview() {
    const [selected, setSelected] = useState(undefined);
    const {t} = useTranslation();
    const trafficincidentRest = useMemo(() => new TrafficIncidentRest(), []);
    const history = useHistory();
    const [trafficIncidentAll, setTrafficIncidentAll] = useState();

    useEffect(() => {
        reload();
    }, []);

    function reload() {
        trafficincidentRest.findAll().then(response => {
            setTrafficIncidentAll(response.data);
        });
    }

    function goToCreate() {
        history.push("/trafficincident/create");
    }

    function goToUpdate() {
        if (!!selected) {
            history.push("/trafficincident/update/" + selected.id);
            setSelected(undefined);
        }
    }

    function handleDelete() {
        if (!!selected) {
            trafficincidentRest.delete(selected.id).then(reload);
            setSelected(undefined);
        }
    }

    return (
        <Container>
            <Typography variant={"h2"} gutterBottom>{t("trafficIncident.title")}</Typography>
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
                entities={trafficIncidentAll}
                prefix={"trafficIncident"}
                selected={selected}
                onSelect={setSelected}
                fields={trafficIncidentOverviewFields}/>
        </Container>
    );
}

export default TrafficIncidentOverview;
