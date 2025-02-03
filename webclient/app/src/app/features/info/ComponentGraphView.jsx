import React, {useEffect, useMemo, useState} from "react";
import {Box, Typography} from "@mui/material";

export default function ComponentGraphView(props) {
    const {moduleList} = props;
    const startX = 10;
    const startY = 50;
    const boxWidth = 200;
    const boxHeight = 80;
    var numberOfBoxes = 0;
    var moduleCoordinates = [];

    function nextBoxCoordinate(module) {
        var startXForModule;
        if (numberOfBoxes == 0) {
            startXForModule = startX - 10
        } else {
            startXForModule = (startX + boxWidth) * numberOfBoxes
        }
        numberOfBoxes += 1;

        moduleCoordinates.push({id: module.id, x: startXForModule, y: startY});
        return startXForModule;
    }

    function getStartXForLine(connection) {
        var startX = 0;
        if (connection.from === 0) {
            startX = startX + boxWidth;
        } else {
            startX = (startX + boxWidth) * connection.from;
        }
        console.log(connection);
        console.log(startX);
        return startX;
    }

    function getEndXForLine(connection) {
        var endX = 0;
        if (connection.to === 0) {
            endX = startX - 10 + boxWidth;
        } else {
            endX = (startX + boxWidth) * connection.to;
        }
        console.log(connection);
        console.log(endX);
        return endX;
    }

    function drawConnections() {
        var connections = [];
        for (const module of moduleList) {
            for (const successor of module.successors) {
                connections.push({from: module.id, to: successor.id});
            }
        }
        console.log(connections);
        return (
            <svg width="1000" height="200" style={{position: "absolute", top: 0, left: 0}}>

                {connections.map((connection, index) => (
                    <line key={index}
                        x1={getStartXForLine(connection)}
                        y1={startY + 40 + index}
                        x2={getEndXForLine(connection)}
                        y2={startY + 40 + index}
                        stroke="black" strokeWidth="2" />
                ))}
            </svg>
        );
    }

    function getModuleName(id) {
        for (const module of moduleList) {
            if (module.id === id) {
                return module.name;
            }
        }
    }

    return (
        <Box sx={{position: "relative", width: "1000px", height: "200px", margin: "auto"}}>
            {moduleList.map((module, index) => (
                <Box
                    sx={{
                        position: "absolute",
                        top: startY,
                        left: nextBoxCoordinate(module),
                        width: boxWidth,
                        height: boxHeight,
                        border: "2px solid black",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "white"
                    }}
                >
                    <Typography>{getModuleName(module.id)}</Typography>
                </Box>
            ))}

            {drawConnections()}
        </Box>
    );
}