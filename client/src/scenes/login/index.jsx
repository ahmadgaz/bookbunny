import { Box, Typography, useMediaQuery } from "@mui/material";
import Container from "components/Container";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tokens } from "theme";
import Logo from "../../assets/Logo-02.svg";
import Form from "./form";
import "transition.css";

const Login = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);
    document
        .querySelector("meta[name='theme-color']")
        .setAttribute("content", colors.neutralLight[100]);

    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return isNonMobileScreens ? (
        <Box
            className="fadeIn"
            display="grid"
            gridTemplateColumns="100px 100px 100px 100px 100px 100px 100px 100px 100px 100px 100px 100px"
            gridTemplateRows="900px 100px"
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
                        <b>Log In</b>
                    </Typography>
                    <Typography
                        variant="body1"
                        fontSize={24}
                        color={colors.neutralDark[300]}
                        margin="0 0 40px 0"
                    >
                        Welcome back!
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
            className="fadeIn"
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
                <b>Log In</b>
            </Typography>
            <Typography
                variant="body1"
                fontSize={24}
                color={colors.neutralDark[300]}
                margin="0 0 40px 0"
            >
                Welcome back!
            </Typography>
            <Form />
        </Box>
    );
};

export default Login;
