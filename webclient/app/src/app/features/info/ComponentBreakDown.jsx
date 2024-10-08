import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {Card, CardContent, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import TransparencyFunctions from "../../services/TransparencyFunctions";
import ComponentDetailsDialog from "./ComponentDetailsDialog";

function ComponentBreakDown() {
    const {t} = useTranslation();
    const transparencyFunctions = useMemo(() => new TransparencyFunctions(), []);
    const [moduleList, setModuleList] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [moduleData, setModuleData] = React.useState({});

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

    function showPDF() {
    }

    return <>
        <Typography variant="h1" component="div" sx={{flexGrow: 1}} gutterBottom>
            {t("transparency.components.title")}
        </Typography>
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
                                                <IconButton onClick={e => {
                                                    handleOpen(row);
                                                }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <IconButton onClick={showPDF}><PictureAsPdfIcon /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
        {renderModuleList()}
    </>;
}

export default ComponentBreakDown;
