import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {Box, Card, CardContent, Divider, IconButton, Link, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, Tooltip, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import TransparencyFunctions from "../../services/TransparencyFunctions";
import ComponentDetailsDialog from "./ComponentDetailsDialog";
import DescriptionIcon from '@mui/icons-material/Description';
import ComponentListView from "./ComponentListView";
import ComponentTreeView from "./ComponentTreeView";
import ComponentGraphView from "./ComponentGraphView";

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

    function getApiPDFPath(id) {
        return window.location.pathname + "api/transparency/reports/" + id + "/pdf";
    }

    function getApiSpreadSheetPath(id) {
        return window.location.pathname + "api/transparency/reports/" + id + "/spreadsheet";
    }

    return <>
        <Typography variant="h1" component="div" sx={{flexGrow: 1}} gutterBottom>
            {t("transparency.components.title")}
        </Typography>
        <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label={t("transparency.views.cards")} />
            <Tab label={t("transparency.views.list")} />
            <Tab label={t("transparency.views.tree")} />
            {/* <Tab label={t("transparency.views.graph")} /> */}
        </Tabs>

        <Box>
            {tabIndex === 0 &&
                <Grid container spacing={4}>
                    {moduleList.map(row => (
                        <Grid key={row.id}>
                            <Card >
                                <CardContent>
                                    {row.name}
                                    <Divider />
                                    <TableContainer >
                                        <Table size="small" aria-label="a dense table">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="left">{t("transparency.components.details.description")}</TableCell>
                                                    <TableCell align="left">{row.description}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="left">{t("transparency.components.details.isAI")}</TableCell>
                                                    <TableCell align="left">{row.useAI ? <CheckCircleIcon /> : <CancelIcon />}</TableCell>
                                                </TableRow>
                                                {
                                                    <>
                                                        <TableRow>
                                                            <TableCell align="left">{t("transparency.components.details.typeAI")}</TableCell>
                                                            <TableCell align="left">{row.aiType ? row.aiType : ""}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell align="left">{t("transparency.components.details.modelVersion")}</TableCell>
                                                            <TableCell align="left">{row.modelVersion ? row.modelVersion : ""}</TableCell>
                                                        </TableRow>
                                                    </>
                                                }
                                                <TableRow>
                                                    <TableCell align="left">Details</TableCell>
                                                    <TableCell align="left">
                                                        <Tooltip title={t("transparency.components.details.show")}>
                                                            <IconButton onClick={e => {
                                                                handleOpen(row);
                                                            }}
                                                            >
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={t("transparency.components.details.download.pdf")}>
                                                            {reportGenerationEnabled ?
                                                                <Link href={getApiPDFPath(row.id)} target="_blank" download>
                                                                    <IconButton >
                                                                        <PictureAsPdfIcon />
                                                                    </IconButton>
                                                                </Link>
                                                                :
                                                                <IconButton disabled>
                                                                    <PictureAsPdfIcon />
                                                                </IconButton>
                                                            }
                                                        </Tooltip>
                                                        <Tooltip title={t("transparency.components.details.download.spreadsheet")}>
                                                            {reportGenerationEnabled ?
                                                                <Link href={getApiSpreadSheetPath(row.id)} target="_blank" download>
                                                                    <IconButton >
                                                                        <DescriptionIcon />
                                                                    </IconButton>
                                                                </Link>
                                                                :
                                                                <IconButton disabled>
                                                                    <DescriptionIcon />
                                                                </IconButton>
                                                            }

                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid >}
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
    </>;
}

export default ComponentBreakDown;
