// import { useState } from "react";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    useScrollTrigger,
    Slide,
    useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo-02.svg";
import Button from "components/Container";
import { useEffect } from "react";

const HideOnScroll = (props) => {
    const { children } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger();
    useEffect(() => {}, [trigger]);

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
};

const Navbar = (props) => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1400px)");
    const { setPrevPage } = props;
    // const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const navigate = useNavigate();
    // const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return (
        <AppBar>
            <HideOnScroll>
                <Toolbar>
                    <Button
                        variant="outlined"
                        size="s"
                        outerStyle={{ margin: "0 10px" }}
                        onClick={() => {
                            setPrevPage();
                            navigate("/login");
                        }}
                    >
                        Log In
                    </Button>
                    <img
                        src={Logo}
                        alt="Logo"
                        style={{
                            height: isNonMobileScreens ? "50px" : "40px",
                            margin: "10px 0",
                        }}
                    />
                    <Button
                        rounded
                        variant="contained"
                        size="s"
                        outerStyle={{ margin: "0 10px" }}
                        onClick={() => {
                            setPrevPage();
                            navigate("/register");
                        }}
                    >
                        Sign Up
                    </Button>
                </Toolbar>
            </HideOnScroll>
        </AppBar>
    );
};

export default Navbar;
