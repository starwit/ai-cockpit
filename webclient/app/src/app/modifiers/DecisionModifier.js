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
        name: "decisionType",
        type: "ManyToOne",
        regex: null,
        selectList: [],
        display: [
            "name"
        ],
        selectedIds: []
    },
    {
        name: "action",
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

const decisionOverviewFields = [
    {name: "acquisitionTime", type: "timestamp", regex: null}
];

export {
    entityDefault,
    entityFields,
    decisionOverviewFields
};
