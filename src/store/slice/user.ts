import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { getProfile, updateProductInCart } from "../../apis/User.api";
// import { updateProductReq } from "../../types/TCart";

export type User = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl?: string;
};

export type UserStore = {
  user: User;
  cart: any;
  isLogin: boolean;
};

export type Address = {
  nameAddress: string;
}

const initialState: UserStore = {
  user: {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    avatarUrl: "",
  },
  cart: [],
  isLogin: false,
};

// export const getUserProfile = createAsyncThunk("user/getProfile", async () => {
//   try {
//     const reponse = await getProfile();
//     return reponse;
//   } catch (error) {
//     return error;
//   }
// });



const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    }
  },
  extraReducers: (builder) => {
    // // get profile
    // builder.addCase(getUserProfile.fulfilled, (state, action: any) => {
    //   // Update the state with the fetched user data
    //   state.user.email = action?.payload?.email;
    //   state.user.firstName = action?.payload?.firstName;
    //   state.user.lastName = action?.payload?.lastName;
    //   state.user.phone = action?.payload?.phone;
    // });
    // builder.addCase(getUserProfile.rejected, (state, action) => {
    //   // Handle the case when fetching user data fails
    //   console.error("Error fetching user data:", action.payload);
    // });
  },
});

const { actions, reducer } = userSlice;
export const { setIsLogin,} = actions;
export default reducer;
