import React, {useMemo, useEffect} from "react";
import {useParams} from "react-router";
import {useImmer} from "use-immer";
import MitigationActionRest from "../../services/MitigationActionRest";
import MitigationActionTypeRest from "../../services/MitigationActionTypeRest";
import {
    entityDefault,
    entityFields
} from "../../modifiers/MitigationActionModifier";
import {EntityDetail, addSelectLists} from "@starwit/react-starwit";

function MitigationActionDetail() {
    const [entity, setEntity] = useImmer(entityDefault);
    const [fields, setFields] = useImmer(entityFields);
    const entityRest = useMemo(() => new MitigationActionRest(), []);
    const mitigationactiontypeRest = useMemo(() => new MitigationActionTypeRest(), []);
    const {id} = useParams();

    useEffect(() => {
        reloadSelectLists();
    }, [id]);

    function reloadSelectLists() {
        const selectLists = [];
        const functions = [
            mitigationactiontypeRest.findAllWithoutMitigationAction(id)
        ];
        Promise.all(functions).then(values => {
            selectLists.push({name: "mitigationActionType", data: values[0].data});
            if (id) {
                entityRest.findById(id).then(response => {
                    setEntity(response.data);
                    addSelectLists(response.data, fields, setFields, selectLists);
                });
            } else {
                addSelectLists(entity, fields, setFields, selectLists);
            }
        });
    }

    return (
        <>
            <EntityDetail
                id={id}
                entity={entity}
                setEntity={setEntity}
                fields={fields}
                setFields={setFields}
                entityRest={entityRest}
                prefix="mitigationAction"
            />
        </>

    );
}

export default MitigationActionDetail;
