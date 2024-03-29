import { Box, Typography, useMediaQuery } from "@mui/material";
import Container from "components/Container";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tokens } from "theme";
import Logo from "../../assets/Logo-02.svg";
import Form from "./form";
import "transition.css";

const Register = () => {
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
                        <b>Sign Up</b>
                    </Typography>
                    <Typography
                        variant="body1"
                        fontSize={24}
                        color={colors.neutralDark[300]}
                        margin="0 0 40px 0"
                    >
                        Create a Bookbunny account
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
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                padding="30px 0 0 0"
                sx={{
                    gridColumnStart: "-1",
                    gridColumnEnd: "-5",
                    gridRowStart: "2",
                }}
            >
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "5px 10px" }}
                    onClick={() => {
                        navigate("/contact");
                    }}
                >
                    Contact
                </Container>
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "5px 10px" }}
                    onClick={() => {
                        navigate("/privacy");
                    }}
                >
                    Privacy Policy
                </Container>
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "5px 10px" }}
                    onClick={() => {
                        navigate("/tos");
                    }}
                >
                    Terms & Conditions
                </Container>
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
                <b>Sign Up</b>
            </Typography>
            <Typography
                variant="body1"
                fontSize={24}
                color={colors.neutralDark[300]}
                margin="0 0 40px 0"
            >
                Create a Bookbunny account
            </Typography>
            <Form />
            <Box
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
                padding="30px 0 0 0"
            >
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "5px 10px" }}
                    onClick={() => {
                        navigate("/contact");
                    }}
                >
                    Contact
                </Container>
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "5px 10px" }}
                    onClick={() => {
                        navigate("/privacy");
                    }}
                >
                    Privacy Policy
                </Container>
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "5px 10px" }}
                    onClick={() => {
                        navigate("/tos");
                    }}
                >
                    Terms & Conditions
                </Container>
            </Box>
        </Box>
    );
};

export default Register;
