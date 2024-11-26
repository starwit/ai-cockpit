const entityDefault = {
    name: "",
    description: "",
    id: undefined
};

const entityFields = [
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
];

const actionTypeOverviewFields = [
    {name: "name", type: "string", regex: null},
    {name: "description", type: "string", regex: null}
];

export {
    entityDefault,
    entityFields,
    actionTypeOverviewFields
};
