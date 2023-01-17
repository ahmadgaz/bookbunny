import { useState } from "react";
import { Box, useMediaQuery, AppBar, Button, Toolbar } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRouteBeforeLogInOrSignUp } from "state";

const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return (
        <AppBar>
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                LOGO
                <Box>
                    <Button
                        color="inherit"
                        onClick={() => {
                            dispatch(
                                setRouteBeforeLogInOrSignUp({
                                    routeBeforeLogInOrSignUp: "/home",
                                })
                            );
                            navigate("/login");
                        }}
                    >
                        Log in
                    </Button>
                    <Button
                        color="inherit"
                        variant="contained"
                        onClick={() => {
                            navigate("/register");
                        }}
                    >
                        Sign up
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
