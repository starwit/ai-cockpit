import React, {useEffect, useMemo, useState} from "react";
import ModuleRest from "../../services/ModuleRest"
import {Badge, Button, Card, CardContent, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import Grid from "@mui/material/Grid";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArchiveIcon from '@mui/icons-material/Archive';
import InboxIcon from '@mui/icons-material/Inbox';
import InfoIcon from '@mui/icons-material/Info';
import {useTranslation} from "react-i18next";

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
                                                        {row.description}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">{t("module.applicationId")}</TableCell>
                                                <TableCell align="left">{row.applicationIdentifier}</TableCell>
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
                                                    <Button variant="contained"
                                                        color="secondary"
                                                        startIcon={<InfoIcon />}
                                                        component={RouterLink}
                                                        to="/decision-type">
                                                        <Typography>{row.decisionType.length}</Typography>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">{t("module.actiontypes")}</TableCell>
                                                <TableCell align="left">
                                                    <Button variant="contained"
                                                        color="secondary"
                                                        startIcon={<InfoIcon />}
                                                        component={RouterLink}
                                                        to="/action-type">
                                                        <Typography>{row.actionType.length}</Typography>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell align="left">{t("module.decisions")}</TableCell>
                                                <TableCell align="left">
                                                    <Button variant="contained" color="secondary" component={RouterLink} to="/">
                                                        <Stack direction="row" spacing={4}>
                                                            <Badge badgeContent={row.openDecisions} color="error">
                                                                <InboxIcon color="action" />
                                                            </Badge>
                                                            <Badge badgeContent={row.madeDecisions} color="primary">
                                                                <ArchiveIcon color="action" />
                                                            </Badge>
                                                        </Stack>
                                                    </Button>
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