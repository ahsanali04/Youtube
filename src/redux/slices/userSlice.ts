import { createSlice } from "@reduxjs/toolkit";

export const UserSlice = createSlice({
    name: 'user',
    initialState:{
        user:[],
    },
    reducers:{
            updateUser:(state,action)=>{
                state.user= action.payload;
            },
    }
})

export const {updateUser} = UserSlice.actions;
export const selectUser = state => state.user.user;

export default UserSlice.reducer;