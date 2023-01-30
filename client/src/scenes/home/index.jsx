import { Box, Link, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setRouteBeforeLogInOrSignUp } from "state";
import NavbarSpacer from "components/NavbarSpacer";
import Navbar from "./navbar";
import Hero from "../../assets/Hero-01.svg";
import { tokens } from "theme";
import Button from "components/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {
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
        <Box>
            <Navbar setPrevPage={setPrevPageToHome} />
            <NavbarSpacer />
            <Box
                width="100vw"
                padding="20px 50px"
                display="flex"
                flexWrap="wrap"
                justifyContent="center"
                alignItems="center"
            >
                <Box width="750px">
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
                        <Button
                            size="m"
                            variant="contained"
                            onClick={() => {
                                setPrevPageToHome();
                                navigate("/register");
                            }}
                            style={{ marginRight: "50px" }}
                        >
                            Try Free
                        </Button>
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
                <Box width="600px">
                    <img
                        src={Hero}
                        alt="Hero"
                        style={{ margin: "50px 50px" }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
