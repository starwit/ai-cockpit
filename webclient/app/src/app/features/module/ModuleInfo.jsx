import ArchiveIcon from '@mui/icons-material/Archive';
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InboxIcon from '@mui/icons-material/Inbox';
import InfoIcon from '@mui/icons-material/Info';
import {Badge, Button, Card, CardContent, Divider, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from '@mui/material';
import React from "react";
import {Link as RouterLink} from 'react-router-dom';
import {useTranslation} from "react-i18next";

function ModuleInfo(props) {
    const {module} = props;
    const {t} = useTranslation();

    return <Card>
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
                            <TableCell align="left">{t("module.decisiontypes")}</TableCell>
                            <TableCell align="left">
                                <Button variant="contained"
                                    color="secondary"
                                    startIcon={<InfoIcon />}
                                    component={RouterLink}
                                    to={"/decision-type/" + module.id}>
                                    <Typography>{module.decisionType.length}</Typography>
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
                                    to={"/action-type/" + module.id}>
                                    <Typography>{module.actionType.length}</Typography>
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="left">{t("module.decisions")}</TableCell>
                            <TableCell align="left">
                                <Button variant="contained" color="secondary" component={RouterLink} to={"/decision/" + module.id}>
                                    <Stack direction="module" spacing={4}>
                                        <Badge badgeContent={module.openDecisions} color="error" showZero>
                                            <InboxIcon color="action" />
                                        </Badge>
                                        <Badge badgeContent={module.madeDecisions} color="primary" showZero>
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
    </Card>;
}

export default ModuleInfo;