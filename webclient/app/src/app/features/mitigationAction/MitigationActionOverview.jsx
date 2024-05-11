import {Container, Typography, Button, Stack} from "@mui/material";
import React, {useState, useMemo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {OverviewTable} from "@starwit/react-starwit";
import MitigationActionRest from "../../services/MitigationActionRest";
import {useHistory} from "react-router";
import {mitigationActionOverviewFields} from "../../modifiers/MitigationActionModifier";

function MitigationActionOverview() {
    const [selected, setSelected] = useState(undefined);
    const {t} = useTranslation();
    const mitigationactionRest = useMemo(() => new MitigationActionRest(), []);
    const history = useHistory();
    const [mitigationActionAll, setMitigationActionAll] = useState();

    useEffect(() => {
        reload();
    }, []);

    function reload() {
        mitigationactionRest.findAll().then(response => {
            setMitigationActionAll(response.data);
        });
    }

    function goToCreate() {
        history.push("/mitigationaction/create");
    }

    function goToUpdate() {
        if (!!selected) {
            history.push("/mitigationaction/update/" + selected.id);
            setSelected(undefined);
        }
    }

    function handleDelete() {
        if (!!selected) {
            mitigationactionRest.delete(selected.id).then(reload);
            setSelected(undefined);
        }
    }

    return (
        <Container>
            <Typography variant={"h2"} gutterBottom>{t("mitigationAction.title")}</Typography>
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
                entities={mitigationActionAll}
                prefix={"mitigationAction"}
                selected={selected}
                onSelect={setSelected}
                fields={mitigationActionOverviewFields}/>
        </Container>
    );
}

export default MitigationActionOverview;
