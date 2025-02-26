const entityDefault = {
    creationTime: null,
    name: "",
    description: "",
    id: undefined
};

const entityFields = [
    {
        name: "creationTime",
        type: "timestamp",
        regex: null,
        notNull: false
    },
    {
        name: "name",
        type: "string",
        regex: null,
        notNull: false
    },
    {
        name: "description",
        type: "string",
        regex: null,
        notNull: false
    },
    {
        name: "actionType",
        type: "ManyToOne",
        regex: null,
        selectList: [],
        display: [
            "name",
            "description"
        ],
        selectedIds: []
    }
];

const actionOverviewFields = [
    {name: "creationTime", type: "timestamp", regex: null},
    {name: "name", type: "string", regex: null},
    {name: "description", type: "string", regex: null}
];

export {
    entityDefault,
    entityFields,
    actionOverviewFields
};
