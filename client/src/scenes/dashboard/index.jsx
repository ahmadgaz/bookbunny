import { Box, Typography, useMediaQuery } from "@mui/material";
import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "state";
import useEmblaCarousel from "embla-carousel-react";
import NavbarSpacer from "components/NavbarSpacer";
import Account from "./Account";
import Calendar from "./Calendar";
import Help from "./Help";
import Navbar from "./navbar";
import View from "./View";

const userURL = `${process.env.REACT_APP_SERVER_BASE_URL}/user`;
export const CRUDFunctionsContext = createContext();

const CRUDFunctionsContextProvider = (props) => {
    const { children } = props;
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    useEffect(() => {
        updateUser();
    }, []);

    // USER
    const updateUser = async () => {
        const updatedUserResponse = await fetch(`${userURL}/${user._id}`, {
            method: "GET",
            headers: {
                Authorization: `${token}`,
            },
        });
        const updatedUser = await updatedUserResponse.json();

        if (!updatedUser) {
            console.log("Error");
            return;
        }

        dispatch(
            setUser({
                user: updatedUser,
            })
        );
    };

    // VIEWS
    const getSelectedView = () => {
        if (user.views.length > 0) {
            return user.views.find((view) => view.view_selected);
        }
        return null;
    };
    const createView = async (view_name, view_desc, view_color) => {
        const newViewResponse = await fetch(
            `${userURL}/${user._id}/createView`,
            {
                method: "POST",
                body: JSON.stringify({
                    view_name: view_name,
                    view_desc: view_desc,
                    view_color: view_color,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            }
        );
        const newView = await newViewResponse.json();

        if (!newView) {
            console.log("Error");
            return;
        }

        await updateUser();
    };
    const updateView = async (view) => {
        const updatedViewResponse = await fetch(
            `${userURL}/${user._id}/updateView/${view._id}`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    view_name: view.view_name,
                    view_desc: view.view_desc,
                    view_color: view.view_color,
                    view_schedule: view.view_schedule,
                    view_selected: view.view_selected,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            }
        );
        const updatedView = await updatedViewResponse.json();

        if (!updatedView) {
            console.log("Error");
            return;
        }

        await updateUser();
    };
    const deleteView = async (view) => {
        const deleteViewResponse = await fetch(
            `${userURL}/${user._id}/deleteView/${view._id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        const deleteView = await deleteViewResponse.json();

        if (!deleteView) {
            console.log("Error");
            return;
        }

        await updateUser();
    };
    const createEventType = async (
        view,
        event_type_name,
        event_type_duration,
        event_type_location
    ) => {
        const newEventTypeResponse = await fetch(
            `${userURL}/${user._id}/${view._id}/createEventType`,
            {
                method: "POST",
                body: JSON.stringify({
                    event_type_name: event_type_name,
                    event_type_duration: event_type_duration,
                    event_type_location: event_type_location,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            }
        );
        const newEventType = await newEventTypeResponse.json();

        if (!newEventType) {
            console.log("Error");
            return;
        }

        await updateUser();
    };
    const updateEventType = async (view, eventType) => {
        const updatedEventTypeResponse = await fetch(
            `${userURL}/${user._id}/${view._id}/updateEventType/${eventType._id}`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    event_type_name: eventType.event_type_name,
                    event_type_duration: eventType.event_type_duration,
                    event_type_location: eventType.event_type_location,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            }
        );
        const updatedEventType = await updatedEventTypeResponse.json();

        console.log(updatedEventType);
        if (!updatedEventType) {
            console.log("Error");
            return;
        }

        await updateUser();
    };
    const deleteEventType = async (view, eventType) => {
        const deleteEventTypeResponse = await fetch(
            `${userURL}/${user._id}/${view._id}/deleteEventType/${eventType._id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        const deleteEventType = await deleteEventTypeResponse.json();

        console.log(deleteEventType);
        if (!deleteEventType) {
            console.log("Error");
            return;
        }

        await updateUser();
    };

    return (
        <CRUDFunctionsContext.Provider
            value={{
                user,
                createEventType,
                updateEventType,
                deleteEventType,
                createView,
                getSelectedView,
                updateView,
                deleteView,
            }}
        >
            {children}
        </CRUDFunctionsContext.Provider>
    );
};

const Dashboard = () => {
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const [tab, setTab] = useState(1);
    const [emblaRef, emblaApi] = useEmblaCarousel({
        axis: isNonMobileScreens ? "x" : "y",
        draggable: false,
    });

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    useEffect(() => {
        const onSelect = () => {
            setTab(emblaApi.selectedScrollSnap());
        };
        if (emblaApi) {
            emblaApi.scrollTo(tab);
            emblaApi.on("select", onSelect); // Add event listener
        }
    }, [emblaApi, tab]);

    return (
        <CRUDFunctionsContextProvider>
            <Box width="100%" height={isNonMobileScreens ? "100vh" : "95vh"}>
                <Navbar tab={tab} handleTabChange={handleTabChange} />
                {isNonMobileScreens && <NavbarSpacer />}

                <div
                    className="embla"
                    ref={emblaRef}
                    style={{
                        overflowY: isNonMobileScreens ? "" : "hidden",
                        overflowX: isNonMobileScreens ? "hidden" : "",
                        height: isNonMobileScreens
                            ? "calc(100% - 64px)"
                            : "100%",
                    }}
                >
                    <div
                        className="embla__container"
                        style={{
                            display: "flex",
                            flexDirection: isNonMobileScreens
                                ? "row"
                                : "column",
                            height: "100%",
                        }}
                    >
                        <div
                            className="embla__slide"
                            key="0"
                            style={{
                                flex: "0 0 100%",
                                minWidth: 0,
                            }}
                        >
                            <Typography variant="h1">View</Typography>
                            <View />
                        </div>
                        <div
                            className="embla__slide"
                            key="1"
                            style={{
                                flex: "0 0 100%",
                                minWidth: 0,
                            }}
                        >
                            <Typography variant="h1">Calendar</Typography>
                            <Calendar />
                        </div>
                        <div
                            className="embla__slide"
                            key="2"
                            style={{
                                flex: "0 0 100%",
                                minWidth: 0,
                            }}
                        >
                            <Typography variant="h1">Account</Typography>
                            <Account />
                        </div>
                        <div
                            className="embla__slide"
                            key="3"
                            style={{
                                flex: "0 0 100%",
                                minWidth: 0,
                            }}
                        >
                            <Typography variant="h1">Help</Typography>
                            <Help />
                        </div>
                    </div>
                </div>
            </Box>
        </CRUDFunctionsContextProvider>
    );
};

export default Dashboard;
