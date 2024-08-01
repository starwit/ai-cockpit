import {Button, MenuItem, Select, Typography} from '@mui/material';
import {DataGrid} from '@mui/x-data-grid';
import {useTranslation} from "react-i18next";
import React, {useEffect, useState, useMemo} from "react";
import MitigationActionTypeRest from "../../services/MitigationActionTypeRest";

const DropdownMenu = ({row, updateRow}) => {
    const {t} = useTranslation();

    const handleChange = (event) => {
        const newValue = event.target.value;
        updateRow(row.id, newValue);
    };

    return (
        <Select value={row.executionPolicy} onChange={handleChange}>
            <MenuItem value={"MANUAL"}>{t("mitigationactiontype.policy.manual")}</MenuItem>
            <MenuItem value={"WITHCHECK"}>{t("mitigationactiontype.policy.withcheck")}</MenuItem>
            <MenuItem value={"AUTOMATIC"}>{t("mitigationactiontype.policy.automated")}</MenuItem>
        </Select>
    );
};

function MitigationActionTypeOverview(props) {
    const {t} = useTranslation();
    const mitigationActionTypeRest = useMemo(() => new MitigationActionTypeRest, []);
    const [mitigationActionTypes, setMitigationActionTypes] = useState([]);

    useEffect(() => {
        reloadMitigationActionTypes();
    }, []);

    function reloadMitigationActionTypes() {
        mitigationActionTypeRest.findAll().then(response => {
            if (response.data == null) {
                return;
            }
            setMitigationActionTypes(response.data);
        });
    }

    const columns = [
        {field: 'id', headerName: 'ID', width: 90},
        {
            field: 'name',
            headerName: t("mitigationactiontype.name"),
            width: 150,
            editable: true,
        },
        {
            field: 'description',
            headerName: t("mitigationactiontype.description"),
            width: 350,
            editable: true,
        },
        {
            field: 'executionPolicy',
            headerName: t("mitigationactiontype.policy"),
            width: 180,
            editable: true,
            renderCell: (params) => <DropdownMenu row={params.row} updateRow={params.updateRow} />
        }
    ];

    const updateRow = (id, newValue) => {
        console.log(newValue);
        const updatedRows = mitigationActionTypes.map((row) =>
            row.id === id ? {...row, executionPolicy: newValue} : row
        );
        console.log(updatedRows)
        setMitigationActionTypes(updatedRows);
    };

    const columnsWithUpdateRow = columns.map((column) => ({
        ...column,
        renderCell: column.renderCell ? (params) => column.renderCell({...params, updateRow}) : undefined,
    }));

    const addRow = () => {
        const newRow = {
            id: "",
            name: "NONE",
            description: "NONE",
            executionPolicy: 'MANUAL',
        };
        setMitigationActionTypes([...mitigationActionTypes, newRow]);
    };

    const saveAll = () => {
        mitigationActionTypeRest.updateList(mitigationActionTypes);
    };

    return (
        <>
            <Typography variant="h1" gutterBottom>
                {t("mitigationactiontype.heading")}
            </Typography>
            <Button variant="contained" color="primary" onClick={addRow} style={{marginBottom: '10px'}}>
                {t("mitigationactiontype.addItem")}
            </Button>
            <Button variant="contained" color="primary" onClick={saveAll} style={{marginBottom: '10px'}}>
                {t("mitigationactiontype.saveItem")}
            </Button>
            <DataGrid
                autoHeight
                rows={mitigationActionTypes}
                columns={columnsWithUpdateRow}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </>
    );
}

export default MitigationActionTypeOverview;
