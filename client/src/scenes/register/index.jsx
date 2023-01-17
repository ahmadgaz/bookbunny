import { Box, useMediaQuery } from "@mui/material";
import Form from "./form";

const Register = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return (
        <Box>
            <Form />
        </Box>
    );
};

export default Register;
