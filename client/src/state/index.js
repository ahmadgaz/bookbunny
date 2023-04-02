import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null, // Including all data
    mode: "light",
    token: null,
    routeBeforeLogInOrSignUp: null,
    snackbars: {
        viewAdded: false,
        viewDeleted: false,
        viewEdited: false,
        eventTypeCopied: false,
        eventTypeDeleted: false,
        eventTypeEdited: false,
        eventTypeAdded: false,
        eventAccepted: false,
        eventDenied: false,
        eventCanceled: false,
    },
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setTheme: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
        },
        setRouteBeforeLogInOrSignUp: (state, action) => {
            state.routeBeforeLogInOrSignUp =
                action.payload.routeBeforeLogInOrSignUp;
        },
        showSnackbar: (state, action) => {
            state.snackbars[action.payload.snackbar] = true;
        },
        hideSnackbar: (state, action) => {
            state.snackbars[action.payload.snackbar] = false;
        },
    },
});

export const {
    setTheme,
    setLogin,
    setLogout,
    setUser,
    setRouteBeforeLogInOrSignUp,
    showSnackbar,
    hideSnackbar,
} = authSlice.actions;
export default authSlice.reducer;
