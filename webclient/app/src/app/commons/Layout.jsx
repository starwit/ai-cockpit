import {Container, Typography} from "@mui/material";
import CockpitAppBar from "./CockpitAppBar";
import CockpitFooter from "./CockpitFooter";

function Layout({disabled = false, children}) {
    return (
        <>
            <CockpitAppBar disabled={disabled} />
            <Container sx={{paddingTop: "4em", paddingBottom: "4em"}}>
                {children}
            </Container>
            <CockpitFooter />
        </>
    );
};

export default Layout;