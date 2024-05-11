import React from "react";
import SidebarNavigation from "./sidebarNavigation/SidebarNavigation";
import NavigationStyles from "./NavigationStyles";
import {styled} from "@mui/material/styles";

function Navigation(props) {
    const {menuItems, title, logo, removeContentSpacer} = props;

    const MainDiv = styled('div')(({theme}) => removeContentSpacer ? {} : NavigationStyles.contentSpacer(theme))

    function renderCorrectNavigation() {
        return (
            <SidebarNavigation menuItems={menuItems} title={title} logo={logo} focusMode={removeContentSpacer}>
                {props.children}
            </SidebarNavigation>
        );
    }

    return (
        <MainDiv style={{height: "100%"}}>
            {renderCorrectNavigation()}
        </MainDiv>
    );
}

export default Navigation;
