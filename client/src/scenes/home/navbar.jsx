import { useState } from "react";
import { Box, useMediaQuery, AppBar, Button, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
    const { setPrevPage } = props;
    // const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    const navigate = useNavigate();
    // const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

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
                            setPrevPage();
                            navigate("/login");
                        }}
                    >
                        Log in
                    </Button>
                    <Button
                        color="inherit"
                        variant="contained"
                        onClick={() => {
                            setPrevPage();
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
