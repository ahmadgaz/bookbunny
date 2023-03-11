import { Box, Link, Typography, useMediaQuery } from "@mui/material";
import { useDispatch } from "react-redux";
import { setRouteBeforeLogInOrSignUp } from "state";
import NavbarSpacer from "components/NavbarSpacer";
import Navbar from "./navbar";
import HeroSafariCompatible from "../../assets/HeroSafariCompatible.mov";
import Hero from "../../assets/Hero.webm";
import { tokens } from "theme";
import Button from "components/Container";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
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
                width="100%"
                padding="20px 50px"
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
            >
                <Box width={isNonMobileScreens ? "40vw" : "80vw"}>
                    <Typography variant="hero">
                        Schedule life with <b>ease</b>!
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
                        No more double-bookings, missed appointments, or
                        conflicting schedules.
                    </Typography>
                    <br
                        style={{
                            margin: "15px 0",
                            height: "1px",
                            border: "none",
                        }}
                    />
                    <Typography variant="body1" fontSize={24}>
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
                        <Box sx={{ marginRight: "20px" }}>
                            <Button
                                size="m"
                                variant="contained"
                                onClick={() => {
                                    setPrevPageToHome();
                                    navigate("/register");
                                }}
                            >
                                Try Free
                            </Button>
                        </Box>
                        <Button italicized size="m" variant="outlined">
                            See how it works
                        </Button>
                    </Box>
                    {/* STEPS */}
                    {/* <Typography variant="body1" fontSize={24}>
                            Make scheduling as simple as hop, skip, and{" "}
                            <i>jump</i>.
                        </Typography> */}
                </Box>
                <Box
                    width={isNonMobileScreens ? "50vw" : "80vw"}
                    display="flex"
                    justifyContent="center"
                >
                    <video height="600" autoPlay loop muted>
                        <source
                            src={HeroSafariCompatible}
                            type='video/mp4; codecs="hvc1"'
                        />
                        <source src={Hero} type="video/webm" />
                    </video>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
