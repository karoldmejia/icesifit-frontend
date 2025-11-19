import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        token: null,
        role: null,
    },
    reducers: {
        setUserData: (state, action) => {
            state.token = action.payload;
            state.role = action.payload.role;
        },
        logout: (state) => {
            state.token = null;
            state.role = null;
        }
    }
});

export const { setUserData, logout } = userSlice.actions;
export default userSlice.reducer;
