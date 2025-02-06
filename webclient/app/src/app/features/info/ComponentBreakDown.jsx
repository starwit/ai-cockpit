
import Lan from "@mui/icons-material/Lan";
import {Box, Container, Tab, Tabs, Typography} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import TransparencyFunctions from "../../services/TransparencyFunctions";
import ComponentDetailsDialog from "./ComponentDetailsDialog";
import ComponentListView from "./ComponentListView";
import ComponentTreeView from "./ComponentTreeView";
import ComponentCardView from "./ComponentCardView";

function ComponentBreakDown() {
    const {t} = useTranslation();
    const transparencyFunctions = useMemo(() => new TransparencyFunctions(), []);
    const [moduleList, setModuleList] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [moduleData, setModuleData] = React.useState({});
    const [reportGenerationEnabled, setReportGenerationEnabled] = React.useState({});
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        reload();
    }, []);

    function reload() {
        transparencyFunctions.getModuleList().then(response => {
            if (response.data == null) {
                return;
            } else {
                setModuleList(response.data);
            }
        });

        transparencyFunctions.isReportGenerationEnabled().then(response => {
            if (response.data == null) {
                return;
            } else {
                setReportGenerationEnabled(response.data);
            }
        });
    }

    function handleOpen(row) {
        setOpen(true);
        setModuleData(row);
    }

    function handleClose() {
        setOpen(false);
    };

    function renderModuleList() {
        if (!open) {
            return null;
        }
        return (<ComponentDetailsDialog
            open={open}
            handleClose={handleClose}
            moduleData={moduleData}
        />);
    }

    function handleTabChange(event, newIndex) {
        setTabIndex(newIndex);
    };

    return <Container sx={{paddingTop: 2}}>
        <Typography variant="h2" component="div" sx={{flexGrow: 1}} gutterBottom>
            <Lan fontSize="small" /> {t("transparency.components.title")}
        </Typography>
        <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label={t("transparency.views.cards")} />
            <Tab label={t("transparency.views.list")} />
            <Tab label={t("transparency.views.tree")} />
            {/* <Tab label={t("transparency.views.graph")} /> */}
        </Tabs>

        <Box>
            {tabIndex === 0 && <ComponentCardView
                moduleList={moduleList}
                reportGenerationEnabled={reportGenerationEnabled}
            />}
            {tabIndex === 1 && <ComponentListView
                moduleList={moduleList}
                reportGenerationEnabled={reportGenerationEnabled}
            />}
            {tabIndex === 2 && <ComponentTreeView
                moduleList={moduleList}
                reportGenerationEnabled={reportGenerationEnabled}
            />}
            {/*             {tabIndex === 3 && <ComponentGraphView
                moduleList={moduleList}
            />} */}
        </Box>
        {renderModuleList()}
    </Container>;
}

export default ComponentBreakDown;
