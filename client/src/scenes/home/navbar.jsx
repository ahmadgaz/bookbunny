// import { useState } from "react";
import {
    Box,
    // useMediaQuery,
    AppBar,
    Toolbar,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo-02.svg";
import Button from "components/Button";

const Navbar = (props) => {
    const { setPrevPage } = props;
    // const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const navigate = useNavigate();
    // const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    return (
        <AppBar>
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
        </AppBar>
    );
};

export default Navbar;
