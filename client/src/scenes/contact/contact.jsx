import { Box, Typography, useMediaQuery } from "@mui/material";
import Container from "components/Container";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tokens } from "theme";
import LogoLight from "../../assets/Logo-02.svg";
import LogoDark from "../../assets/Logo-04.svg";
import Form from "./form";

const Contact = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);
    document
        .querySelector("meta[name='theme-color']")
        .setAttribute("content", colors.neutralLight[100]);

    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return isNonMobileScreens ? (
        <Box
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
                        <b>Contact Us</b>
                    </Typography>
                    <Typography
                        variant="body1"
                        fontSize={24}
                        margin="0 0 40px 0"
                    >
                        If you're having issues with your Bookbunny account,
                        need help navigating our app, or want to provide
                        feedback, please send us a message!
                    </Typography>
                    <Form />
                </Container>
                <img
                    src={mode === "light" ? LogoLight : LogoDark}
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
                src={mode === "light" ? LogoLight : LogoDark}
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
                <b>Contact Us</b>
            </Typography>
            <Typography variant="body1" fontSize={24} margin="0 0 40px 0">
                If you're having issues with your Bookbunny account, need help
                navigating our app, or want to provide feedback, please send us
                a message!
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

export default Contact;
