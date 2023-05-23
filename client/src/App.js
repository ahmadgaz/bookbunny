import { createContext, useEffect, useMemo } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { setUser } from "state";

import { themeSettings } from "theme";
import Home from "scenes/home";
import Login from "scenes/login";
import Register from "scenes/register";
import Dashboard from "scenes/dashboard";
import NewEvent from "scenes/newEvent";
import ForgotPassword from "scenes/forgotPassword";
import ResetPassword from "scenes/resetPassword";
import ConfirmedEmail from "scenes/register/confirmedEmail";
import Contact from "scenes/contact/contact";
import Privacy from "scenes/privacy/privacy";
import Tos from "scenes/tos";

function App() {
    const mode = useSelector((state) => state.mode);
    const theme = createTheme(themeSettings(mode));
    const isAuth = Boolean(useSelector((state) => state.token));

    return (
        <div className="app">
            <CRUDFunctionsContextProvider>
                <BrowserRouter>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    isAuth ? (
                                        <Navigate to="/dashboard" />
                                    ) : (
                                        <Home />
                                    )
                                }
                                // errorElement={}
                            />
                            <Route
                                path="/login"
                                element={
                                    isAuth ? (
                                        <Navigate to="/dashboard" />
                                    ) : (
                                        <Login />
                                    )
                                }
                                // errorElement={}
                            />
                            <Route
                                path="/register"
                                element={
                                    isAuth ? (
                                        <Navigate to="/dashboard" />
                                    ) : (
                                        <Register />
                                    )
                                }
                                // errorElement={}
                            />
                            <Route
                                path="/dashboard"
                                element={
                                    isAuth ? <Dashboard /> : <Navigate to="/" />
                                }
                                // errorElement={}
                            />
                            <Route
                                path="/newEvent/:eventTypeID"
                                element={<NewEvent />}
                            />
                            <Route
                                path="/forgot_password"
                                element={<ForgotPassword />}
                            />
                            <Route
                                path="/reset_password/:token/:userId"
                                element={<ResetPassword />}
                            />
                            <Route
                                path="/confirmation/:token"
                                element={<ConfirmedEmail />}
                            />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/tos" element={<Tos />} />
                        </Routes>
                    </ThemeProvider>
                </BrowserRouter>
            </CRUDFunctionsContextProvider>
        </div>
    );
}

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

    // GOOGLE
    const isConnectedToGoogle = async () => {
        if (!user || !token) {
            return;
        }

        const connectedToGoogleResponse = await fetch(
            `${userURL}/${user._id}/isConnectedToGoogle`,
            {
                method: "GET",
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        const connectedToGoogle = await connectedToGoogleResponse.json();

        if (!connectedToGoogle) {
            return;
        }

        return connectedToGoogle;
    };
    const unlinkFromGoogle = async (password) => {
        if (!user || !token) {
            return;
        }

        const unlinkResponse = await fetch(
            `${userURL}/${user._id}/unlinkFromGoogle`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    password,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            }
        );
        const unlink = await unlinkResponse.json();

        if (!unlink) {
            return;
        }

        return unlink;
    };
    const getGoogleEvents = async (date) => {
        if (!user || !token) {
            return;
        }

        const googleEventsResponse = await fetch(
            `${userURL}/${user._id}/getGoogleEvents`,
            {
                method: "POST",
                body: JSON.stringify({
                    date: date,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            }
        );
        const googleEvents = await googleEventsResponse.json();

        if (!googleEvents) {
            return;
        }

        await updateUser();
        return googleEvents;
    };

    // USER
    const deleteUser = async () => {
        await fetch(`${userURL}/${user._id}/deleteUser`, {
            method: "DELETE",
            headers: {
                Authorization: `${token}`,
            },
        });
    };
    const updateName = async (first_name, last_name) => {
        const updatedResponse = await fetch(
            `${userURL}/${user._id}/updateName`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    first_name,
                    last_name,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            }
        );
        const updated = await updatedResponse.json();

        if (!updated) {
            return { err: "THere has been an error! Please try again later." };
        } else if (updated.msg) {
            return { msg: updated.msg };
        } else if (updated.error) {
            return { err: updated.error };
        }

        await updateUser();
        return { success: updated };
    };
    const updatePass = async (password) => {
        const updatedResponse = await fetch(
            `${userURL}/${user._id}/updatePass`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    password,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            }
        );
        const updated = await updatedResponse.json();

        if (!updated) {
            return;
        }

        await updateUser();
    };
    const confirmPassword = async (password) => {
        const confirmedResponse = await fetch(
            `${userURL}/${user._id}/confirmPassword`,
            {
                method: "POST",
                body: JSON.stringify({
                    password,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            }
        );
        const confirmed = await confirmedResponse.json();

        if (!confirmed) {
            return;
        }

        return confirmed;
    };
    const updateUser = async () => {
        if (!user) {
            return;
        }

        const updatedUserResponse = await fetch(`${userURL}/${user._id}`, {
            method: "GET",
            headers: {
                Authorization: `${token}`,
            },
        });
        const updatedUser = await updatedUserResponse.json();

        if (!updatedUser) {
            return;
        }

        dispatch(
            setUser({
                user: updatedUser,
            })
        );
    };
    const getRecievingUser = async (eventType) => {
        const receivingUserResponse = await fetch(
            `${userURL}/${user._id}/getRecievingUser/${eventType}`,
            {
                method: "GET",
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        const receivingUser = await receivingUserResponse.json();

        if (!receivingUser) {
            return;
        }

        return receivingUser;
    };
    const getFirstFourUsers = async (filter) => {
        const firstFourUsersResponse = await fetch(
            `${userURL}/${user._id}/getFirstFourUsers/${filter ? filter : 0}`,
            {
                method: "GET",
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        const firstFourUsers = await firstFourUsersResponse.json();

        if (!firstFourUsers) {
            return;
        }

        return firstFourUsers;
    };
    const getAttendeesInfo = async (eventid) => {
        const attendeesInfoResponse = await fetch(
            `${userURL}/${user._id}/getAttendeesInfo/${eventid}`,
            {
                method: "GET",
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        const attendeesInfo = await attendeesInfoResponse.json();

        if (!attendeesInfo) {
            return;
        }

        return attendeesInfo;
    };

    // VIEWS
    const getSelectedView = () => {
        if (user.views) {
            if (user.views.length > 0) {
                return user.views.find((view) => view.view_selected);
            }
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

        if (!updatedEventType) {
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

        if (!deleteEventType) {
            return;
        }

        await updateUser();
    };
    const createEvent = async (event, eventTypeID) => {
        const newEventResponse = await fetch(
            `${userURL}/${user._id}/${eventTypeID}/createEvent`,
            {
                method: "POST",
                body: JSON.stringify({
                    event_date: event.event_date,
                    event_duration: event.event_duration,
                    event_notes: event.event_notes,
                    event_attendees: event.event_attendees,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
            }
        );
        const newEvent = await newEventResponse.json();

        if (!newEvent) {
            return;
        }

        await updateUser();
    };
    const acceptEvent = async (event) => {
        const acceptEventResponse = await fetch(
            `${userURL}/${user._id}/acceptEvent/${event.event_id}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        const acceptEvent = await acceptEventResponse.json();

        if (!acceptEvent) {
            return;
        }

        await updateUser();
    };
    const deleteEvent = async (event) => {
        const deleteEventResponse = await fetch(
            `${userURL}/${user._id}/deleteEvent/${event.event_id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        const deleteEvent = await deleteEventResponse.json();

        if (!deleteEvent) {
            return;
        }

        await updateUser();
    };

    return (
        <CRUDFunctionsContext.Provider
            value={{
                user,
                deleteUser,
                updateName,
                updatePass,
                confirmPassword,
                unlinkFromGoogle,
                isConnectedToGoogle,
                getGoogleEvents,
                getAttendeesInfo,
                getRecievingUser,
                getFirstFourUsers,
                createEventType,
                updateEventType,
                deleteEventType,
                createView,
                getSelectedView,
                updateView,
                deleteView,
                createEvent,
                acceptEvent,
                deleteEvent,
            }}
        >
            {children}
        </CRUDFunctionsContext.Provider>
    );
};

export default App;
