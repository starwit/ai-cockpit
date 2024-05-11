import {Container, Typography, Button, Stack} from "@mui/material";
import React, {useState, useMemo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {OverviewTable} from "@starwit/react-starwit";
import TrafficIncidentTypeRest from "../../services/TrafficIncidentTypeRest";
import {useHistory} from "react-router";
import {trafficIncidentTypeOverviewFields} from "../../modifiers/TrafficIncidentTypeModifier";

function TrafficIncidentTypeOverview() {
    const [selected, setSelected] = useState(undefined);
    const {t} = useTranslation();
    const trafficincidenttypeRest = useMemo(() => new TrafficIncidentTypeRest(), []);
    const history = useHistory();
    const [trafficIncidentTypeAll, setTrafficIncidentTypeAll] = useState();

    useEffect(() => {
        reload();
    }, []);

    function reload() {
        trafficincidenttypeRest.findAll().then(response => {
            setTrafficIncidentTypeAll(response.data);
        });
    }

    function goToCreate() {
        history.push("/trafficincidenttype/create");
    }

    function goToUpdate() {
        if (!!selected) {
            history.push("/trafficincidenttype/update/" + selected.id);
            setSelected(undefined);
        }
    }

    function handleDelete() {
        if (!!selected) {
            trafficincidenttypeRest.delete(selected.id).then(reload);
            setSelected(undefined);
        }
    }

    return (
        <Container>
            <Typography variant={"h2"} gutterBottom>{t("trafficIncidentType.title")}</Typography>
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
                entities={trafficIncidentTypeAll}
                prefix={"trafficIncidentType"}
                selected={selected}
                onSelect={setSelected}
                fields={trafficIncidentTypeOverviewFields}/>
        </Container>
    );
}

export default TrafficIncidentTypeOverview;
