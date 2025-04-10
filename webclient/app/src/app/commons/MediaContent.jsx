import {Box, CardMedia} from "@mui/material";
import ReactPlayer from "react-player";

function MediaContent(props) {
    const {src} = props;
    const {sx} = props;

    return (
        src.endsWith('mp4') ?
            <Box sx={sx}>
                <ReactPlayer
                    sx={{bottom: 0}}
                    url={src}
                    controls={true}
                    width="100%"
                    height="100%"
                    muted={true}
                    playing={true}
                    playbackRate={2}

                />
            </Box>
            :
            <CardMedia sx={sx}
                component="img" src={src} />

    );
}

export default MediaContent;