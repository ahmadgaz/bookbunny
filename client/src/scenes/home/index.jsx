import { Box, Link, Typography, useMediaQuery } from "@mui/material";
import { useDispatch } from "react-redux";
import { setRouteBeforeLogInOrSignUp } from "state";
import NavbarSpacer from "components/NavbarSpacer";
import Navbar from "./navbar";
import Hero from "../../assets/Hero.gif";
import { tokens } from "theme";
import Container from "components/Container";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1400px)");
    const colors = tokens();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const setPrevPageToHome = () => {
        dispatch(
            setRouteBeforeLogInOrSignUp({
                routeBeforeLogInOrSignUp: "/",
            })
        );
    };

    return (
        <Box
            width="100%"
            display="flex"
            flexWrap="nowrap"
            flexDirection="column"
            alignItems="center"
        >
            <Navbar setPrevPage={setPrevPageToHome} />
            <NavbarSpacer />
            <Box
                maxWidth="80%"
                padding="20px 0px"
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
            >
                <Box width={isNonMobileScreens ? "500px" : "100%"}>
                    <Typography variant="hero">
                        <em>
                            Schedule life with <b>ease</b>!
                        </em>
                    </Typography>
                    <hr
                        style={{
                            margin: "15px 0",
                            height: "1px",
                            border: "none",
                            background: colors.neutralDark[500],
                        }}
                    />
                    <Typography variant="h3">
                        <b>
                            No more double-bookings, missed appointments, or
                            conflicting schedules.
                        </b>
                    </Typography>
                    <br
                        style={{
                            margin: "15px 0",
                            height: "1px",
                            border: "none",
                        }}
                    />
                    <Typography variant="body1">
                        With <b>Bookbunny</b>, you can <Link>manage</Link> your
                        schedule and have more time for the things that matter.
                        Share your availability with friends, family and
                        colleagues.
                    </Typography>
                    <br
                        style={{
                            margin: "15px 0",
                            height: "1px",
                            border: "none",
                        }}
                    />
                    <Box display="flex" alignItems="center">
                        <Container
                            size={isNonMobileScreens ? "m" : "s"}
                            variant="contained"
                            outerStyle={{ marginRight: "50px" }}
                            onClick={() => {
                                setPrevPageToHome();
                                navigate("/register");
                            }}
                        >
                            Try Free
                        </Container>
                        <Container
                            italicized
                            size={isNonMobileScreens ? "m" : "s"}
                            variant="outlined"
                        >
                            See how it works
                        </Container>
                    </Box>
                </Box>
                <Box
                    width={isNonMobileScreens ? "700px" : "50vw"}
                    display="flex"
                    justifyContent="center"
                >
                    <img
                        src={Hero}
                        style={{
                            height: isNonMobileScreens ? "450px" : "80vw",
                        }}
                        alt="hero"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
