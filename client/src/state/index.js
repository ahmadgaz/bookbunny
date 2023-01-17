import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null, // Including all data
    theme: null,
    token: null,
    routeBeforeLogInOrSignUp: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setTheme: (state) => {
            state.theme = state.user.views.find(
                (view) => view.view_selected === true
            ).view_color;
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
    },
});

export const {
    setTheme,
    setLogin,
    setLogout,
    setUser,
    setRouteBeforeLogInOrSignUp,
} = authSlice.actions;
export default authSlice.reducer;
