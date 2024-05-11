import {Container, Typography, Button, Stack} from "@mui/material";
import React, {useState, useMemo, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {OverviewTable} from "@starwit/react-starwit";
import MitigationActionTypeRest from "../../services/MitigationActionTypeRest";
import {useHistory} from "react-router";
import {mitigationActionTypeOverviewFields} from "../../modifiers/MitigationActionTypeModifier";

function MitigationActionTypeOverview() {
    const [selected, setSelected] = useState(undefined);
    const {t} = useTranslation();
    const mitigationactiontypeRest = useMemo(() => new MitigationActionTypeRest(), []);
    const history = useHistory();
    const [mitigationActionTypeAll, setMitigationActionTypeAll] = useState();

    useEffect(() => {
        reload();
    }, []);

    function reload() {
        mitigationactiontypeRest.findAll().then(response => {
            setMitigationActionTypeAll(response.data);
        });
    }

    function goToCreate() {
        history.push("/mitigationactiontype/create");
    }

    function goToUpdate() {
        if (!!selected) {
            history.push("/mitigationactiontype/update/" + selected.id);
            setSelected(undefined);
        }
    }

    function handleDelete() {
        if (!!selected) {
            mitigationactiontypeRest.delete(selected.id).then(reload);
            setSelected(undefined);
        }
    }

    return (
        <Container>
            <Typography variant={"h2"} gutterBottom>{t("mitigationActionType.title")}</Typography>
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
                entities={mitigationActionTypeAll}
                prefix={"mitigationActionType"}
                selected={selected}
                onSelect={setSelected}
                fields={mitigationActionTypeOverviewFields}/>
        </Container>
    );
}

export default MitigationActionTypeOverview;
