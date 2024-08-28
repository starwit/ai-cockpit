
import {Box, Button, Card, CardContent, Divider, List, ListItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import LoupeIcon from '@mui/icons-material/Loupe';
import {useTranslation} from "react-i18next";
import React, {useEffect, useState, useMemo} from "react";
import TransparencyFunctions from "../../services/TransparencyFunctions";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

function ComponentBreakDown() {
    const {t} = useTranslation();
    const transparencyFunctions = useMemo(() => new TransparencyFunctions(), []);
    const [moduleList, setModuleList] = useState([]);

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

    return <>
        <Typography variant="h1" component="div" sx={{flexGrow: 1}} gutterBottom>
            {t("transparency.components.title")}
        </Typography>
        <Grid container spacing={4}>
            {moduleList.map((row) => (
                <Grid key={row.id}>
                    <Card >
                        <CardContent>
                            {row.name}
                            <Divider />
                            <TableContainer  >
                                <Table size="small" aria-label="a dense table">
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="left">description</TableCell>
                                            <TableCell align="left">{row.description}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left">Contains AI?</TableCell>
                                            <TableCell align="left">{row.useAI ? "Yes" : "No"}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left">AI Type</TableCell>
                                            <TableCell align="left">{row.aiType}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left">AI Model Version</TableCell>
                                            <TableCell align="left">{row.modelVersion}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="left">Details</TableCell>
                                            <TableCell align="left">TODO</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </>;
}

export default ComponentBreakDown;