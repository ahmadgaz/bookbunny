import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { setUser } from "state";

import Home from "scenes/home";
import Login from "scenes/login";
import Register from "scenes/register";
import Dashboard from "scenes/dashboard";
import NewEvent from "scenes/newEvent";

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
            console.log("Error");
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
            `${userURL}/getRecievingUser/${eventType}`,
            {
                method: "GET",
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        const receivingUser = await receivingUserResponse.json();

        if (!receivingUser) {
            console.log("Error");
            return;
        }

        return receivingUser;
    };
    const getFirstFourUsers = async (filter) => {
        const firstFourUsersResponse = await fetch(
            `${userURL}/getFirstFourUsers/${filter ? filter : 0}`,
            {
                method: "GET",
                headers: {
                    Authorization: `${token}`,
                },
            }
        );
        const firstFourUsers = await firstFourUsersResponse.json();

        if (!firstFourUsers) {
            console.log("Error");
            return;
        }

        return firstFourUsers;
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

        if (!deleteEventType) {
            console.log("Error");
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

        console.log(newEvent);
        if (!newEvent) {
            console.log("Error");
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

        console.log(acceptEvent);
        if (!acceptEvent) {
            console.log("Error");
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
            console.log("Error");
            return;
        }

        await updateUser();
    };

    return (
        <CRUDFunctionsContext.Provider
            value={{
                user,
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

function App() {
    const isAuth = Boolean(useSelector((state) => state.token));

    return (
        <div className="app">
            <CRUDFunctionsContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                isAuth ? <Navigate to="/dashboard" /> : <Home />
                            }
                            // errorElement={}
                        />
                        <Route
                            path="/login"
                            element={<Login />}
                            // errorElement={}
                        />
                        <Route
                            path="/register"
                            element={<Register />}
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
                    </Routes>
                </BrowserRouter>
            </CRUDFunctionsContextProvider>
        </div>
    );
}

export default App;
