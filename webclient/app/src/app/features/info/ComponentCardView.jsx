import React, {useEffect, useMemo, useState} from "react";
import {Card, CardContent, Divider, IconButton, Link, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip} from '@mui/material';
import Grid from "@mui/material/Grid";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {useTranslation} from "react-i18next";
import ComponentDetailsDialog from "./ComponentDetailsDialog";

export default function ComponentCardView(props) {
    const {moduleList, reportGenerationEnabled} = props;
    const [moduleData, setModuleData] = useState({});
    const [open, setOpen] = useState(false);
    const {t} = useTranslation();

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
        return window.location.pathname + "api/transparency/reports/" + id + "/pdf";
    }

    function getApiSpreadSheetPath(id) {
        return window.location.pathname + "api/transparency/reports/" + id + "/spreadsheet";
    }

    return (
        <>
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

            </Grid >
            {renderModuleList()}
        </>
    );

}