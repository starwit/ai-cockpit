import React, {useEffect, useMemo, useState} from "react";
import {SimpleTreeView} from '@mui/x-tree-view/SimpleTreeView';
import {TreeItem} from '@mui/x-tree-view/TreeItem';
import {useTranslation} from "react-i18next";
import {Box} from "@mui/material";

export default function ComponentTreeView(props) {
    const {moduleList, reportGenerationEnabled} = props;
    const {t} = useTranslation();
    var uniqueIdSuffix = 0;

    function getModuleDetails(id) {
        for (const module of moduleList) {
            if (module.id === id) {
                return module.name;
            }
        }
    }

    function getUniqueTreeViewItemId(id) {
        var m;
        for (const module of moduleList) {
            if (module.id === id) {
                m = module;
                break;
            }
        }
        return m.id + '_' + m.name + '_' + getUniqueTreeViewItemIdSuffix();
    }

    function getUniqueTreeViewItemIdSuffix() {
        uniqueIdSuffix++;
        return uniqueIdSuffix;
    }

    return (
        <Box sx={{minHeight: 352, minWidth: 550}}>
            <SimpleTreeView>
                {moduleList.map((module, index) => (
                    <TreeItem key={module.id} itemId={module.id} label={module.name} >
                        {module.successors.length > 0 ?
                            <TreeItem key={getUniqueTreeViewItemId(module.id)} itemId={getUniqueTreeViewItemId(module.id)} label={t("transparency.components.details.succesors")} >
                                {module.successors.map((successor, index) => (
                                    <TreeItem key={getUniqueTreeViewItemId(successor.id)} itemId={getUniqueTreeViewItemId(successor.id)} label={getModuleDetails(successor.id)} />
                                ))}
                            </TreeItem>
                            :
                            ""
                        }
                    </TreeItem>
                ))}
            </SimpleTreeView >
        </Box>
    );
}