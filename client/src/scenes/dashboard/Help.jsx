import { Box, Typography } from "@mui/material";
import Container from "components/Container";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogoLight from "../../assets/Logo-02.svg";
import LogoDark from "../../assets/Logo-04.svg";

const Help = () => {
    const mode = useSelector((state) => state.mode);
    const navigate = useNavigate();

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    flexWrap: "nowrap",
                    width: "100%",
                    padding: "10px",
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
                <Typography variant="h2">Coming soon!</Typography>
            </Box>
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, minmax(1vw,100px))"
                gridTemplateRows="100px"
            >
                <Box
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        gridColumnStart: "-4",
                        gridColumnEnd: "-10",
                        gridRowStart: "1",
                    }}
                >
                    <Container
                        variant="outlined"
                        outerStyle={{
                            padding: "5px 10px",
                        }}
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
        </Box>
    );
};

export default Help;
