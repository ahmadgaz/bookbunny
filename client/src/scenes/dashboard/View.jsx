import { Box, useMediaQuery } from "@mui/material";
import { useContext } from "react";
import { CRUDFunctionsContext } from ".";
import Schedule from "components/Schedule/Schedule";

const View = () => {
    const { user, getSelectedView, updateView, deleteView } =
        useContext(CRUDFunctionsContext);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return (
        <Box
            display="flex"
            flexDirection={isNonMobileScreens ? "column" : "row"}
            flexWrap="nowrap"
            height="100%"
            width="100%"
        >
            Edit View
            <br />
            Delete View
            <br />
            <Box height="260px" width="100%">
                <Schedule
                    direction="horizontal"
                    type="write"
                    pxSize="750"
                    views={[getSelectedView()]}
                    updateView={updateView}
                />
            </Box>
            <br />
            All views
            <Box height="260px" width="100%">
                <Schedule
                    direction="horizontal"
                    type="read"
                    pxSize="750"
                    views={
                        user.views.length > 0 ? user.views : getSelectedView()
                    }
                />
            </Box>
            <Box height="260px" width="100%"></Box>
        </Box>
    );
};

export default View;
