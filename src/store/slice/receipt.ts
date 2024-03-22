import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { getProfile, updateProductInCart } from "../../apis/User.api";
// import { updateProductReq } from "../../types/TCart";

export type ReceiptStore = {
  receiptDetail: any[];
};

const initialState: ReceiptStore = {
  receiptDetail: [],
};

const receiptSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    setReceiptDetail: (state, action) => {
      state.receiptDetail = action.payload;
    },
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

const { actions, reducer } = receiptSlide;
export const { setReceiptDetail } = actions;
export default reducer;
