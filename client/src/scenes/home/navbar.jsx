// import { useState } from "react";
import {
    Box,
    // useMediaQuery,
    AppBar,
    Toolbar,
    Typography,
    useScrollTrigger,
    Slide,
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
    useEffect(() => {
        console.log(trigger);
    }, [trigger]);

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
};

const Navbar = (props) => {
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
                        style={{ height: "50px", margin: "10px 0" }}
                    />
                    <Button
                        rounded
                        variant="contained"
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
