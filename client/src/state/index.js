import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null, // Including all data
    token: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
});
