import { Box, Typography, useMediaQuery } from "@mui/material";
import Container from "components/Container";
import { useSelector } from "react-redux";
import { tokens } from "theme";
import Logo from "../../assets/Logo-02.svg";
import Form from "./form";

const Register = () => {
    const mode = useSelector((state) => state.mode);
    const colors = tokens(mode);

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
                        height: "50px",
                        margin: "30px 0",
                    }}
                />
            </Box>
            <Box
                display="flex"
                flexWrap="nowrap"
                justifyContent="center"
                alignItems="center"
                padding="0 0 30px 0"
                sx={{
                    gridColumnStart: "-1",
                    gridColumnEnd: "-5",
                    gridRowStart: "2",
                }}
            >
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "0 10px" }}
                >
                    Contact
                </Container>
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "0 10px" }}
                >
                    Privacy Policy
                </Container>
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "0 10px" }}
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
                src={Logo}
                alt="Logo"
                style={{ height: "50px", margin: "30px 0" }}
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
                flexWrap="nowrap"
                justifyContent="center"
                alignItems="center"
                padding="30px 0 0 0"
            >
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "0 10px" }}
                >
                    Contact
                </Container>
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "0 10px" }}
                >
                    Privacy Policy
                </Container>
                <Container
                    variant="outlined"
                    outerStyle={{ padding: "0 10px" }}
                >
                    Terms & Conditions
                </Container>
            </Box>
        </Box>
    );
};

export default Register;
