import { Box, Button } from "@mui/material";
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { CRUDFunctionsContext } from "scenes/dashboard";
import { setRouteBeforeLogInOrSignUp } from "state";

const NewEvent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = Boolean(useSelector((state) => state.token));
    const { getRecievingUser } = useContext(CRUDFunctionsContext);
    let { eventType } = useParams();
    let receivingUser = getRecievingUser(eventType);

    const setPrevPageToNewEvent = () => {
        console.log(`/newEvent/${eventType}`);
        dispatch(
            setRouteBeforeLogInOrSignUp({
                routeBeforeLogInOrSignUp: `/newEvent/${eventType}`,
            })
        );
    };

    return isAuth ? (
        <Box>Book an event with {eventType}!</Box>
    ) : (
        <Box>
            Log in and book an event with {eventType}!
            <Box>
                <Button
                    color="inherit"
                    onClick={() => {
                        setPrevPageToNewEvent();
                        navigate("/login");
                    }}
                >
                    Log in
                </Button>
                <Button
                    color="inherit"
                    variant="contained"
                    onClick={() => {
                        setPrevPageToNewEvent();
                        navigate("/register");
                    }}
                >
                    Sign up
                </Button>
            </Box>
        </Box>
    );
};

export default NewEvent;
