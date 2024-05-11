const entityDefault = {
    acquisitionTime: null,
    id: undefined
};

const entityFields = [
    {
        name: "acquisitionTime",
        type: "timestamp",
        regex: null,
        notNull: false
    },
    {
        name: "trafficIncidentType",
        type: "ManyToOne",
        regex: null,
        selectList: [],
        display: [
            "name"
        ],
        selectedIds: []
    },
    {
        name: "mitigationAction",
        type: "OneToMany",
        regex: null,
        selectList: [],
        display: [
            "creationTime",
            "name",
            "description"
        ],
        selectedIds: []
    }
];

const trafficIncidentOverviewFields = [
    {name: "acquisitionTime", type: "timestamp", regex: null}
];

export {
    entityDefault,
    entityFields,
    trafficIncidentOverviewFields
};
