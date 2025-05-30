import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {Card, CardContent, Divider, IconButton, Link, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography} from '@mui/material';
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import ComponentDetailsDialog from "./ComponentDetailsDialog";

function ModuleInfo(props) {
    const {module, reportGenerationEnabled} = props;
    const {t} = useTranslation();
    const [open, setOpen] = useState(false);
    const [moduleData, setModuleData] = useState({});

    function handleOpen(module) {
        setOpen(true);
        setModuleData(module);
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

    function getApiPDFPath(id) {
        return window.location.pathname + "api/module/sbom/" + id + "/pdf";
    }

    function getApiSpreadSheetPath(id) {
        return window.location.pathname + "api/module/sbom/" + id + "/spreadsheet";
    }

    return <>
        <Card>
            <CardContent>
                {module.name}
                <Divider />
                <TableContainer>
                    <Table size="small" aria-label="a dense table">
                        <TableBody>
                            <TableRow>
                                <TableCell style={{width: '180px'}} align="left">
                                    {t("module.description")}
                                </TableCell>
                                <TableCell align="left">
                                    <Typography noWrap sx={{
                                        maxWidth: 300,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {module.description}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">{t("module.applicationId")}</TableCell>
                                <TableCell align="left">{module.applicationIdentifier}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">{t("module.lastdeployment")}</TableCell>
                                <TableCell align="left">{module.lastDeployment}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">{t("module.version")}</TableCell>
                                <TableCell align="left">{module.version}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">{t("module.isai")}</TableCell>
                                <TableCell align="left">{module.useAI ? <CheckCircleIcon /> : <CancelIcon />}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align="left">Details</TableCell>
                                <TableCell align="left">
                                    <Tooltip title={t("transparency.components.details.show")}>
                                        <IconButton onClick={e => {
                                            handleOpen(module);
                                        }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t("transparency.components.details.download.pdf")}>
                                        {reportGenerationEnabled ?
                                            <Link href={getApiPDFPath(module.id)} target="_blank" download>
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
                                            <Link href={getApiSpreadSheetPath(module.id)} target="_blank" download>
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
        {renderModuleList()}
    </>;
}

export default ModuleInfo;