import { Box, Typography, useMediaQuery } from "@mui/material";
import Container from "components/Container";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { tokens } from "theme";
import LogoLight from "../../assets/Logo-02.svg";
import LogoDark from "../../assets/Logo-04.svg";
import __html from "./tos.html";

const form = { __html: __html };

const Tos = () => {
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
                    gridColumnStart: 3,
                    gridColumnEnd: 11,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Container
                    fullWidth
                    button={false}
                    outerStyle={{ height: "87.5%" }}
                    style={{
                        padding: "30px",
                        backgroundColor: colors.neutralLight[100],
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h1" margin="5px 0 10px 0">
                        <b>Terms & Conditions</b>
                    </Typography>
                    <div dangerouslySetInnerHTML={form} />
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
                <b>Terms & Conditions</b>
            </Typography>
            <div dangerouslySetInnerHTML={form} />
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

export default Tos;
