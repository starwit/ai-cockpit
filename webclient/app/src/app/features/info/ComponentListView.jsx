import React, {useEffect, useMemo, useState} from "react";
import {IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Link} from "@mui/material";
import {useTranslation} from "react-i18next";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from "@mui/icons-material/Visibility";
import ComponentDetailsDialog from "./ComponentDetailsDialog";

export default function ComponentListView(props) {
    const {moduleList, reportGenerationEnabled} = props;
    const [open, setOpen] = React.useState(false);
    const [moduleData, setModuleData] = React.useState({});
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
            <TableContainer >
                <Table size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("transparency.components.details.title")}</TableCell>
                            <TableCell align="right">{t("transparency.components.details.description")}</TableCell>
                            <TableCell align="right">{t("transparency.components.details.isAI")}</TableCell>
                            <TableCell align="right">{t("transparency.components.details.modelVersion")}</TableCell>
                            <TableCell align="right">{t("transparency.components.details")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {moduleList.map((module, index) => (
                            <TableRow key={index}>
                                <TableCell>{module.name}</TableCell>
                                <TableCell align="right">{module.description}</TableCell>
                                <TableCell align="right">{module.useAI ? <CheckCircleIcon /> : <CancelIcon />}</TableCell>
                                <TableCell align="right">{module.model.modelType ? module.model.modelType : ""}</TableCell>
                                <TableCell align="right">
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
                                            <Link href={getApiPDFPath(index)} target="_blank" download>
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
                                            <Link href={getApiSpreadSheetPath(index)} target="_blank" download>
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
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {renderModuleList()}
        </>
    );
}