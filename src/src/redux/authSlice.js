import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
        token:localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
        changeDetector : false,
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
        },
        setToken:(state, action) => {
            state.token = action.payload;
        },
        setChangeDetector :(state, action) => {
            state.changeDetector = !state.changeDetector;
        }
    }
});
export const {setLoading, setUser, setToken,setChangeDetector} = authSlice.actions;
export default authSlice.reducer;