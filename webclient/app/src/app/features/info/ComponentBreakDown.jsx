
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {useNavigate} from "react-router";
import LoupeIcon from '@mui/icons-material/Loupe';
import {useTranslation} from "react-i18next";
import React, {useEffect, useState, useMemo} from "react";
import TransparencyFunctions from "../../services/TransparencyFunctions";

function ComponentBreakDown() {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const transparencyFunctions = useMemo(() => new TransparencyFunctions(), []);
    const [moduleList, setModuleList] = useState([]);

    useEffect(() => {
        reload();
    }, []);

    function reload() {
        transparencyFunctions.getComponentList().then(response => {
            if (response.data == null) {
                return;
            } else {
                setModuleList(response.data);
            }

        });
    }

    function openDetails(e, row) {
        navigate("/info/sbom/" + row.id);
    }

    return <>
        <Typography variant="h1" component="div" sx={{flexGrow: 1}}>
            {t("transparency.components.title")}
        </Typography>
        <TableContainer>
            <Table sx={{minWidth: 650}} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell align="right">Name</TableCell>
                        <TableCell align="right">description</TableCell>
                        <TableCell align="right">Contains AI?</TableCell>
                        <TableCell align="right">AI Type</TableCell>
                        <TableCell align="right">AI Model Version</TableCell>
                        <TableCell align="right">Details</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {moduleList.map((row) => (
                        <TableRow key={row.id} >
                            <TableCell >{row.id}</TableCell>
                            <TableCell align="right">{row.name}</TableCell>
                            <TableCell align="right">{row.description}</TableCell>
                            <TableCell align="right">{row.useAI ? "Yes" : "No"}</TableCell>
                            <TableCell align="right">{row.aiType}</TableCell>
                            <TableCell align="right">{row.modelVersion}</TableCell>
                            <TableCell align="right"><Button onClick={e => openDetails(e, row)} >Details</Button></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer >
    </>;
}

export default ComponentBreakDown;