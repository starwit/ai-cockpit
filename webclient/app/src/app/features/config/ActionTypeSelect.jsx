import {MenuItem, Select} from "@mui/material";
import {useTranslation} from "react-i18next";

function ActionTypeSelect(props) {
    const {row, updateRow, editable = true} = props;
    const {t} = useTranslation();

    function handleChange(event) {
        const newValue = event.target.value;
        updateRow(row.id, newValue);
    };

    return (
        <Select value={row.executionPolicy} onChange={handleChange} sx={{width: "100%", height: 40}}
            disabled={!editable}
        >
            <MenuItem value={"MANUAL"}>{t("actiontype.policy.manual")}</MenuItem>
            <MenuItem value={"WITHCHECK"}>{t("actiontype.policy.withcheck")}</MenuItem>
            <MenuItem value={"AUTOMATIC"}>{t("actiontype.policy.automated")}</MenuItem>
        </Select>
    );

}

export default ActionTypeSelect;
