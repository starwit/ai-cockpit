import React, {useMemo, useEffect} from "react";
import {useParams} from "react-router";
import {useImmer} from "use-immer";
import TrafficIncidentRest from "../../services/TrafficIncidentRest";
import TrafficIncidentTypeRest from "../../services/TrafficIncidentTypeRest";
import MitigationActionRest from "../../services/MitigationActionRest";
import {
    entityDefault,
    entityFields
} from "../../modifiers/TrafficIncidentModifier";
import {EntityDetail, addSelectLists} from "@starwit/react-starwit";

function TrafficIncidentDetail() {
    const [entity, setEntity] = useImmer(entityDefault);
    const [fields, setFields] = useImmer(entityFields);
    const entityRest = useMemo(() => new TrafficIncidentRest(), []);
    const trafficincidenttypeRest = useMemo(() => new TrafficIncidentTypeRest(), []);
    const mitigationactionRest = useMemo(() => new MitigationActionRest(), []);
    const {id} = useParams();

    useEffect(() => {
        reloadSelectLists();
    }, [id]);

    function reloadSelectLists() {
        const selectLists = [];
        const functions = [
            trafficincidenttypeRest.findAllWithoutTrafficIncident(id),
            mitigationactionRest.findAllWithoutTrafficIncident(id)
        ];
        Promise.all(functions).then(values => {
            selectLists.push({name: "trafficIncidentType", data: values[0].data});
            selectLists.push({name: "mitigationAction", data: values[1].data});
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
                prefix="trafficIncident"
            />
        </>

    );
}

export default TrafficIncidentDetail;
