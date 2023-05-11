import { Box, Typography, useMediaQuery } from "@mui/material";
import Container from "components/Container";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tokens } from "theme";
import Logo from "../../assets/Logo-02.svg";
import Form from "./form";

const ForgotPassword = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return isNonMobileScreens ? (
        <Box
            display="grid"
            gridTemplateColumns="100px 100px 100px 100px 100px 100px 100px 100px 100px 100px 100px 100px"
            gridTemplateRows="minmax(90vh, min-content) 10vh"
        >
            <Box
                sx={{
                    margin: "30px 0 0 0",
                    width: "100%",
                    gridColumnStart: 4,
                    gridColumnEnd: 10,
                    justifySelf: "center",
                    alignSelf: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <Container
                    fullWidth
                    button={false}
                    style={{
                        padding: "30px",
                        backgroundColor: colors.neutralLight[100],
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h1" margin="5px 0 10px 0">
                        <b>Forgot Password?</b>
                    </Typography>
                    <Typography
                        variant="body1"
                        fontSize={24}
                        color={colors.neutralDark[300]}
                        margin="0 0 40px 0"
                    >
                        To reset your password, enter your email below and
                        submit. An email will be sent to you with instructions
                        about how to complete the process.
                    </Typography>
                    <Form />
                </Container>
                <img
                    src={Logo}
                    alt="Logo"
                    style={{
                        cursor: "pointer",
                        height: "50px",
                        margin: "30px 0",
                    }}
                    onClick={() => {
                        navigate("/");
                    }}
                />
            </Box>
        </Box>
    ) : (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                flexWrap: "nowrap",
                width: "100%",
                height: "max(100%, 100vh)",
                minHeight: "max-content",
                padding: "50px",
                backgroundColor: colors.neutralLight[100],
                textAlign: "center",
            }}
        >
            <img
                src={Logo}
                alt="Logo"
                style={{
                    cursor: "pointer",
                    height: "50px",
                    margin: "30px 0",
                }}
                onClick={() => {
                    navigate("/");
                }}
            />
            <Typography variant="h1" margin="5px 0 10px 0">
                <b>Forgot Password?</b>
            </Typography>
            <Typography
                variant="body1"
                fontSize={24}
                color={colors.neutralDark[300]}
                margin="0 0 40px 0"
            >
                To reset your password, enter your email below and submit. An
                email will be sent to you with instructions about how to
                complete the process.
            </Typography>
            <Form />
        </Box>
    );
};

export default ForgotPassword;
