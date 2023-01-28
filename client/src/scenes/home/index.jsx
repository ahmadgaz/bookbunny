import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { setRouteBeforeLogInOrSignUp } from "state";
import NavbarSpacer from "components/NavbarSpacer";
import Navbar from "./navbar";

const Home = () => {
    const dispatch = useDispatch();

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
        </Box>
    );
};

export default Home;
