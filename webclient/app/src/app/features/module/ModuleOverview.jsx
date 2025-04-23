import React, {useEffect, useMemo, useState} from "react";
import ModuleRest from "../../services/ModuleRest"
import {Card, CardContent, Divider, IconButton, Link, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip, Typography} from '@mui/material';
import Grid from "@mui/material/Grid";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import {useTranslation} from "react-i18next";
import {styled} from '@mui/material/styles';

function ModuleOverview() {
    const {t} = useTranslation();
    const moduleFunctions = useMemo(() => new ModuleRest(), []);
    const [moduleData, setModuleData] = useState([]);

    useEffect(() => {
        moduleFunctions.getWithDecisions().then((response) => {
            console.log(response.data);
            if (response.data == null) {
                return;
            } else {
                setModuleData(response.data);
            }
        });
    }, []);

    return (
        <>
            <Grid container spacing={2}>
                {moduleData.map(row => (
                    <Grid size={{sm: 3, xs: 8}} key={row.id}>
                        <Card>
                            <CardContent>
                                {row.name}
                                <Divider />
                                <TableContainer >
                                    <Table size="small" aria-label="a dense table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{width: '150px'}} align="left">
                                                    {t("module.description")}
                                                </TableCell>
                                                <TableCell align="left">
                                                    <Typography noWrap sx={{
                                                        maxWidth: 300,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {row.description}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">{t("module.lastdeployment")}</TableCell>
                                                <TableCell align="left">{row.lastDeployment}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">{t("module.version")}</TableCell>
                                                <TableCell align="left">{row.version}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">{t("module.isai")}</TableCell>
                                                <TableCell align="left">{row.useAI ? <CheckCircleIcon /> : <CancelIcon />}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">{t("module.decisiontypes")}</TableCell>
                                                <TableCell align="left">
                                                    <Stack direction="row" spacing={4}>
                                                        <Typography>{row.decisionType.length}</Typography>
                                                        <ZoomInIcon />
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">{t("module.actiontypes")}</TableCell>
                                                <TableCell align="left">
                                                    <Stack direction="row" spacing={4}>
                                                        <Typography>{row.actionType.length}</Typography>
                                                        <ZoomInIcon />
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">{t("module.decisions.open")}</TableCell>
                                                <TableCell align="left">
                                                    <Stack direction="row" spacing={4}>
                                                        <Typography>{row.openDecisions}</Typography>
                                                        <ZoomInIcon />
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">{t("module.decisions.done")}</TableCell>
                                                <TableCell align="left">
                                                    <Stack direction="row" spacing={4} >
                                                        <Typography>{row.madeDecisions}</Typography>
                                                        <ZoomInIcon />
                                                    </Stack>
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
        </>
    )
}

export default ModuleOverview;