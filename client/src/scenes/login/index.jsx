import { Box, Typography, useMediaQuery } from "@mui/material";
import Container from "components/Container";
import Logo from "../../assets/Logo-02.svg";
import Form from "./form";

const Login = () => {
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
                        backgroundColor: "#fff",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h1" margin="5px 0 10px 0">
                        <b>Log In</b>
                    </Typography>
                    <Typography
                        variant="body1"
                        fontSize={24}
                        color="grey"
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
                        height: "50px",
                        margin: "30px 0",
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
                backgroundColor: "#fff",
                textAlign: "center",
            }}
        >
            <img
                src={Logo}
                alt="Logo"
                style={{ height: "50px", margin: "30px 0" }}
            />
            <Typography variant="h1" margin="5px 0 10px 0">
                <b>Log In</b>
            </Typography>
            <Typography
                variant="body1"
                fontSize={24}
                color="grey"
                margin="0 0 40px 0"
            >
                Welcome back!
            </Typography>
            <Form />
        </Box>
    );
};

export default Login;
